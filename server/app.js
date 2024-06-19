import express, { response } from "express"
import cors from "cors"
import nforce from "nforce"
import { PrismaClient } from '@prisma/client'
import session from "express-session"
import { config } from "dotenv"

config();
const app = express()
const PORT = process.env.PORT || 4000
export const prisma = new PrismaClient();

async function main() {
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))
    
    app.use(
        session({
            secret: process.env.SESSION_SECRET_KEY,
            cookie: { secure: process.env.IS_HTTPS === 'true' },
            resave: false,
            saveUninitialized: false
        })
    );

    const org = nforce.createConnection({
        clientId: process.env.SF_CONSUMER_KEY,
        clientSecret: process.env.SF_CONSUMER_SECRET,
        redirectUri: process.env.SF_CALLBACK_URL,
        mode: 'single',
        environment: 'production',
        apiVersion: process.env.API_VERSION,
        autoRefresh: true,
        onRefresh: (newOauth, oldOauthm, cb) => {
            // find outdated access token and refresh it in the database
        }
    })


    app.get('/', (req, res) => {
        res.redirect("https://www.netflix.com/watch/81238727?trackId=155573558")
    })

    app.get('/login', async (req, res) => {
        const authUri = org.getAuthUri({ responseType: 'code' });
        res.status(200).json({ authUri: authUri });
    })

    /**
     * Login callback endpoint (only called by Salesforce)
    */
    app.get('/auth/sfdc/callback', (request, response) => {
        if (!request.query.code) {
            response.status(500).send('Failed to get authorization code from server callback.');
            return;
        }

        org.authenticate({ code: request.query.code }, (err, res) => {
            if (!err) {
                request.session.sfdcAuth = {
                    instanceUrl: res.instance_url,
                    accessToken: res.access_token
                }
            } else {
                response.status(500).json(err);
            }
            return response.status(200).redirect('http://localhost:3000/')
        })
    });

    app.get('/logout', (req, res) => {
        delete req.session?.sfdcAuth;
        return res.status(200).end();

    })

    const getMySession = (req, res) => {
        const session = req.session;
        if (!session.sfdcAuth) {
            response.status(401).send("Unauthorized! No active session found")
            return null;
        }
        return session;
    }
}

const server = app.listen(PORT, () => {
    console.log(`did-we-sync server is up and running on port ${server.address().port}`)
})
