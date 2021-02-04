## Stack
 
- React
- Node.js
- Express.js
- PostgreSQL

## How to run

In case set up takes too long, I've created a video demonstration: [video](https://www.youtube.com/watch?v=NDR2G3UnSOI&ab_channel=MichaelYogar)

1. Create a `.env` file inside the server folder of the project and add the following:

```
PG_USER=example
PG_PASS=example
PG_HOST=example
PG_DB=example
PG_PORT=example
SESSION_SECRET=example
JWT_SECRET=example
API_KEY=example
```

- Swap `example` for valid credential
- SESSION_SECRET and JWT_SECRET can be anything you want, postgres credentials is specific to the user
- API_KEY can be retrieved from: https://www.alphavantage.co/support/#api-key

2. Create Tables

- refer to db/database.sql to see tables you need to create

3. Running Client
- `npm install`
- `cd client` and `npm run start`

4. Running Server
- `npm install`
- `cd server` and `npm run dev`

## Key Points

- In the client side, the core business logic is in Profile.js
- In the server side, the core business logic is in controllers/auth.js
- Rest of files are for routing, user authentication/authorization using JSON Web Tokens, and setup
- I am not familar with stocks, it may be reflected in variable names, etc. 
- Feedback is always welcomed! Thank you for taking the time to review this

## Completed Features
- Your system should have support for users to login/logout
- Users should be able to add balance to their wallet
- Users should be able to buy/sell shares (transactions need not be stored)
- Users should have the ability to see their portfolio

## Proud Of Section
- I completed this in about 15 hours, give or take. That being said, I am proud of the backend, and I learned a lot while making this.
- Another website I am currently working on is: [where-to-work](https://www.where-to-work.com). It highlights my backend abilities as well.

