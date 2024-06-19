// imports
import express, { response } from "express"
import cors from "cors"
import jsforce from "jsforce"
import { PrismaClient } from '@prisma/client'
import session from "express-session"
import { config } from "dotenv"

config();

// js-force declarations
const { OAuth2 } = jsforce
const conn = new jsforce.Connection({
    clientId: process.env.SF_CONSUMER_KEY,
    clientSecret: process.env.SF_CONSUMER_SECRET,
    redirectUri: process.env.SF_CALLBACK_URL
})
const oauth2 = new OAuth2({
    clientId: process.env.SF_CONSUMER_KEY,
    clientSecret: process.env.SF_CONSUMER_SECRET,
    redirectUri: process.env.SF_CALLBACK_URL
})

// prisma declarations
export const prisma = new PrismaClient();

// express declarations
const app = express()
const PORT = process.env.PORT || 8080
const whitelist = [
    'http://localhost:3000',
    'https://didwesync.netlify.app',
    '*'
]
const corsOptions = {
    origin: whitelist,
    credentials: true
};
async function main() {
    app.use(express.json());
    app.use(cors(corsOptions))
    app.use(
        session({
            secret: process.env.SESSION_SECRET_KEY,
            cookie: { secure: process.env.IS_HTTPS === 'true' },
            resave: false,
            saveUninitialized: false
        })
    );

    app.get('/user', (req, res) => {
        console.log('Veriying user...');
        const session = req.session;
        if (!session.sfdcAuth) {
            res.status(500).send('Failed to get authorization code from server callback.');
            return;
        }
        return res.json({
            user: session.sfdcAuth.userInfo
        }).end();
    })

    // read
    app.get('/fetch/sObjectDescribe', async (req, res) => {
        console.log('Fetching object description and records...');
        const sObject = req.query.sobject;
        const meta = await conn.sobject(sObject).describe();
        let result = {};
        if (sObject === 'Account') {
            result = await conn.query('SELECT Id, Name, BillingState, Phone, Type, ShippingState, Industry, Website FROM Account ORDER BY CreatedDate DESC LIMIT 500');
        } else if (sObject === 'Opportunity') {
            result = await conn.query('SELECT Id, Name, AccountId, CloseDate, StageName, Amount FROM Opportunity ORDER BY CreatedDate DESC LIMIT 500');
        }
        res.send({
            meta,
            result
        }).status(200).end();
    })

    // delete
    app.delete("/delete", async (req, res) => {
        const sobject = req.query.sobject;
        const id = req.query.id;
        console.log('Deleting record with id= ', id);
        const ret = await conn.sobject(sobject).delete(id);
        if (ret.success) {
            res.send({
                message: `${sobject} deleted successfully: `,
            }).status(200).end();
        }
    })

    // update
    app.put("/update", async (req, res) => {
        const sobject = req.query.sobject;
        const record = req.body;
        console.log('Updating record ', record);
        const ret = await conn.sobject(sobject).update(record);
        if (ret.success) {
            res.send(ret).status(200).end();
        }
    })

    // create
    app.post('/create', async (req, res) => {
        console.log('Creating new record ', req.body);
        const sobject = req.query.sobject;
        const ret = await conn.sobject(sobject).create(req.body);
        res.send(ret.id).status(200).end();
    })

    // login
    app.get('/login', async (req, res) => {
        console.log('Redirecting to Salesforce...');
        const authUri = oauth2.getAuthorizationUrl({ scope: 'api full' });
        res.status(200).json({ authUri: authUri });
    })

    /**
     * Login callback endpoint (only called by Salesforce)
    */
    app.get('/auth/sfdc/callback', async (req, res) => {
        const code = req.query.code;
        console.log('Authenticating with Salesforce...');
        const userInfo = await conn.authorize(code);

        if (!code) {
            res.status(500).send('Failed to get authorization code from server callback.');
            return;
        }
        const user = await conn.sobject('User').retrieve(userInfo.id);

        req.session.sfdcAuth = {
            accessToken: conn.accessToken,
            instanceUrl: conn.instanceUrl,
            userInfo: {
                username: user.Username,
                id: user.Id,
                name: user.Name
            }
        }
        res.status(200).redirect('https://didwesync.netlify.app/');
    });

    // callback
    app.get('/logout', async (req, res) => {
        console.log('Logging out...');
        delete req.session?.sfdcAuth;
        await conn.logout();
        return res.status(200).end();
    })

    // Synchronize records AWS RDS
    app.post('/sync/accounts', async (req, res) => {
        console.log('Synchronizing accounts...');
        const accounts = req.body;
        accounts.forEach(account => {
            delete account.attributes
        })
        accounts.forEach(async (account) => {
            const upsertAccount = await prisma.account.upsert({
                where: {
                    Id: account.Id
                },
                update: {
                    Name: account.Name,
                    BillingState: !account.BillingState ? null : account.BillingState,
                    Phone: !account.Phone ? null : account.Phone,
                    Type: !account.Type ? null : account.Type,
                    ShippingState: !account.ShippingState ? null : account.ShippingState,
                    Website: !account.Website ? null : account.Website,
                    Industry: !account.Industry ? null : account.Industry
                },
                create: { ...account }

            })
        })
        return res.status(200).end();
    })

    app.post('/sync/opportunities', async (req, res) => {
        console.log('Synchronizing opportunities...');
        const opportunities = req.body;
        opportunities.forEach(opportunity => {
            delete opportunity.attributes
            opportunity.CloseDate = new Date(opportunity.CloseDate).toISOString();
        })
        const result = await prisma.opportunity.createMany({
            data: opportunities,
            skipDuplicates: true
        })
        return res.status(200).end();
    })

    // server
    const server = app.listen(PORT, () => {
        console.log(`did-we-sync server is up and running on port ${server.address().port}`)
    })
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
