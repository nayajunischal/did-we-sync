import express, { response } from "express"
import cors from "cors"
import jsforce from "jsforce"

const { OAuth2 } = jsforce
import session from "express-session"
import { config } from "dotenv"
config();

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

const app = express()
const PORT = process.env.PORT || 4000
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

app.get('/', (req, res) => {
    res.redirect("https://www.netflix.com/watch/81238727?trackId=155573558")
})

app.get('/user', (req, res) => {
    const session = req.session;
    if (!session.sfdcAuth) {
        res.status(500).send('Failed to get authorization code from server callback.');
        return;
    }
    console.log(req.session)
    return res.json({
        user: session.sfdcAuth.userInfo
    }).end();
})

app.get('/fetch/sObjectDescribe', async (req, res) => {
    const sObject = req.query.sobject;
    const meta = await conn.sobject(sObject).describe();
    // const result = await conn.query('SELECT Id, Name, BillingState, Phone, Type, Owner.Alias FROM Account LIMIT 20');
    // console.log(`total: ${result.totalSize}`)
    // console.log(`fetched: ${result.records.length}`)
    res.send({ meta }).status(200).end();
})


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
    res.status(200).redirect('http://localhost:3000/');
});

app.get('/logout', async (req, res) => {
    console.log('Logging out...');
    console.log(req.session);
    delete req.session?.sfdcAuth;
    await conn.logout();
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

const server = app.listen(PORT, () => {
    console.log(`did-we-sync server is up and running on port ${server.address().port}`)
})