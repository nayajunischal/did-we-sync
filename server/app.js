import express, { response } from "express"
import cors from "cors"
import nforce from "nforce"
import pg from 'pg'
import session from "express-session"
import { config } from "dotenv"
config();

console.log(process.env.PORT)
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

const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

const { Client } = pg;
const client = new Client();
await client.connect();


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

app.get('/login', async (req, res) => {
    console.log('Redirecting to Salesforce...');
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
            console.log('Authentication complete', res);
            console.log('Authentication successful');
            console.log('Received authentication code ', res.access_token);
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
    console.log('Logging out...');
    console.log(req.session);
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

const server = app.listen(PORT, () => {
    console.log(`did-we-sync server is up and running on port ${server.address().port}`)
})