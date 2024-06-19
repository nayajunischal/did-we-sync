
# Did we sync
This advanced application streamlines the management of Salesforce records through an intuitive React frontend and a robust backend. The app facilitates seamless CRUD operations, ensuring efficient and reliable handling of data. The backend is built with Node.js and Express, deployed on Heroku, and leverages PostgreSQL hosted on AWS RDS for secure and scalable data storage. The React frontend is deployed on Netlify, providing a responsive and smooth user experience.
## Tech Stack

**Client:** React, TailwindCSS, Shadcn-ui

**Server:** Node, Express

**ORM:** Prisma ORM

**Database:** PostgreSql (AWS RDS)

**Packages:** jsforce, express-session, cors



## Installation

Make sure to setup connected app and populate the SF Consumer Secret and Consumer Key in the 
.env file and your database is up and running

#### Installation Steps

Clone the repository:

```sh
git clone https://github.com/nayajunischal/did-we-sync.git
cd salesforce-records-manager
```

Create an .env file

Populate the .env file with the following details:

```env
# Salesforce Connected App Details
SF_LOGIN_URL='https://login.salesforce.com'
SF_CALLBACK_URL='http://localhost:4000/auth/sfdc/callback/'
SF_CONSUMER_KEY='3M718c77682597c6ea32062839869986b3310ffc22d6bec3b1102bce67abde0c34450b5c89ef733a3a810971e24b699b80647b338b378ea025b4b226009bd3629a'
SF_CONSUMER_SECRET='8066A69BF49B51512AB26'
API_VERSION='59.0'
IS_HTTPS='false'
SESSION_SECRET_KEY='718c77682597c6ea32062839869986b3310ffc22d6bec3b1102bce67abde0c34450b5c89ef733a3a810971e24b699b80647b338b378ea025b4b226009bd3629a'
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/dbname?schema=public"
```
Search and replace all instances of the Heroku URL with your backend server URL:
Ensure that any hardcoded references to the Heroku URL in your code are updated to point to your actual backend server URL.

Install server dependencies and start the server:

```sh
Copy code
cd server
npm install
npm start
```
Install client dependencies and start the client:

```sh
Copy code
cd ../client
npm install
npm start
```

Access the application:
Open your browser and navigate to http://localhost:3000 to access the React frontend of the application.
    
## Screenshots

![Login Page](https://github.com/nayajunischal/did-we-sync/assets/158505791/95b2e863-5a52-4ceb-99a4-fd6257b6d007)
![Accounts](https://github.com/nayajunischal/did-we-sync/assets/158505791/adae5c88-8592-4e9a-b32b-008701d21488)
![Create an account modal](https://github.com/nayajunischal/did-we-sync/assets/158505791/042a6ae5-c0de-41c8-a397-07e569cc22d9)
![Edit existing account modal](https://github.com/nayajunischal/did-we-sync/assets/158505791/fc4ac88f-be27-4d03-90a5-943a7847fc28)
![Delete record](https://github.com/nayajunischal/did-we-sync/assets/158505791/616977e2-c6c3-43f3-a568-3e8a069a1bd1)
![Opportunities](https://github.com/nayajunischal/did-we-sync/assets/158505791/ca69ee63-eb11-4064-ac8d-f57b0b77f5eb)
![Create an opportunity](https://github.com/nayajunischal/did-we-sync/assets/158505791/b7d484d6-4388-4034-9920-a987931c6a3b)
![Edit an opportunity](https://github.com/nayajunischal/did-we-sync/assets/158505791/719aba0d-120e-4f01-a1d1-c4d66d39646b)

