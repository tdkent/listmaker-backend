# ListMaker

## About

Welcome to the backend codebase of ListMaker, a list-making application begun in February and
launched in June of 2023. ListMaker is in ongoing development, with improvements and new features
planned. Read on for details!

[Visit ListMaker](https://mylistmaker.netlify.com)

## Run

### Environment Variables

The following variables are required in `.env` or `.env.local` to run backend server locally:

```
PORT = 3001    // or another port aside from 3000
FRONTEND_URL = "http://localhost:3000"    // default CRA port
DEV_DB = "http://localhost:5432/<database-name>"    // use local Postgres database name
JWT_SECRET = "<secret-string>"    // use a custom secret string
GEOCODING_API_KEY = "<api-key>"    // requires a Google Geocoding API key
```

### Scripts

Production

- `npm run start`: start production server
- `build`: run TypeScript compiler
- `db`: tear down and build database

Heroku

- `postinstall`: executes `npm run build` (see above) when updating remote server with
  `git push heroku main`

Testing

- `npm run start:dev`: start testing server with nodemon
- `npm run db:dev`: tear down and build database with nodemon
- `tsc -w`: run TypeScript compiler in watch mode

## Stack

### Languages:

- `TypeScript`

### Libraries &amp; Frameworks

- `Node`
- `Express`

### Node Packages

- `Axios`
- `bcrypt`
- `body-parser`
- `cors`
- `dotenv`
- `express-validator`
- `jsonwebtoken`
- `node-postgres`
- `slugify`
