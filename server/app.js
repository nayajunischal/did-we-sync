import express from "express"
import { config } from "dotenv"
import cors from "cors"
config();

const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('Welcome to did-we-sync-server!')
})

const server = app.listen(PORT, () => {
    console.log(`did-we-sync server is up and running on port ${server.address().port}`)
})