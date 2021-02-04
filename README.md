# How to run

1. Create a `.env` file inside the root directory of the project and add the following:

```
PG_USER=example
PG_PASS=example
PG_HOST=example
PG_DB=example
PG_PORT=example
SESSION_SECRET=example
JWT_SECRET=example
```

- Swap `example` for valid credential
- SESSION_SECRET and JWT_SECRET can be anything you want, postgres credentials is specific to the user

2. Create Tables

- refer to db/database.sql to see tables you need to create
