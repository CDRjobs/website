# CDRjobs

## Backend

### Prerequisite

You need the following pieces of software and accounts to launch the backend:
- Postgres >= v16
- A [Brevo](https://www.brevo.com/) account to send emails
- A [Mapbox](https://www.mapbox.com/) account to get city coordinates 

### Installation

```bash
# Go inside the backend directory
cd ./website/backend

# Install the node modules and generate Prisma
yarn && yarn prisma:generate

# Copy `.env.dist` to `.env`
cp .env.dist .env

# Fill `.env` with the correct values (see section Backend environment variables)
nano .env # or any IDE

# Copy `.env.dist` to `.env`
cp .env.test.dist .env.test

# Fill `.env` with the correct values (see section Backend environment variables)
nano .env.test # or any IDE

# Generate Prisma database
yarn prisma:migrate
```

### Launch

To launch the backend server, run:
```bash
yarn dev
```

### Test

To test the backend server, run:
```bash
# Unit tests
yarn test:unit

# Integration tests
yarn test:api
```

### Backend environment variables 
| Name | Type | Description | Example |
| ---- | ---- | ----------- | ------- |
| **DATABASE_URL** | string | A postgres connexion URL | `postgresql://cdrjobs:cdrjobs@127.0.0.1:5432/cdrjobs?schema=public` |
| **KOA_KEYS** | string | Koa secrets keys to sign cookies |  `key1,key2,key3` |
| **BREVO_KEY** | string | Brevo API key |  `a31445bc-67c5-b514-a684-26c2f780f341` |
| **FROM_EMAIL** | string | Email address from which emails are sent | `CDRjobs <info@cdrjobs.earth>` |
| **REPORT_NO_NL_TEMPLATE_ID** | number | Template ID from Brevo that corresponds to the email sending the salary report when the user didn't register to the newsletter | `12345678` |
| **REPORT_WITH_NL_TEMPLATE_ID** | number | Template ID from Brevo that corresponds to the email sending the salary report when the user already registered to the newsletter | `12345678` |
| **JWT_KEY** | string | Secret key to hash the user passwords | `123456abc` |
| **API_TOKEN** | string | Secret token used to access the REST API routes | `123456abc` |
| **MAPBOX_TOKEN** | string | `Mapbox API key` |  `123456abc` |
| **PUBLIC_PATH** | string | Relative path to the public folder to serve it | `./public` |
| **IMAGE_FOLDER** | string | Folder name inside [PUBLIC_PATH] that serve the images | `images` |
| **ATTACHMENTS_PATH** | string | Relative path to the attachment folder that contains emails attachments such as the salary survey | `./attachments` |
| **WEBHOOK_TOKEN** | string | Wix webhook token to authenticate requests from wix (used to send the salary report) | `123456abc` |


## Frontend

### Prerequisite

You need the following accounts to launch the backend:
- A [Mapbox](https://www.mapbox.com/) account to get city coordinates 
- An [Amplitude](https://amplitude.com/) account for telemetry

### Installation

```bash
# Go inside the front directory
cd ./website/frontend

# Install the node modules
yarn

# Copy `.env.local.dist` to `.env.local`
cp .env.local.dist .env.local

# Fill `.env.local` with the correct values (see section Frontend environment variables)
nano .env # or any IDE
````

### Launch

To launch the frontend server, run:
```bash
yarn dev
```

### Frontend environment variables 
| Name | Type | Description | Example |
| ---- | ---- | ----------- | ------- |
| **NEXT_PUBLIC_PUBLIC_SERVER_URL** | string | URL that serves the public folder | `http://localhost:4000/public` |
| **NEXT_PUBLIC_GRAPHQL_SERVER_URL** | string | Graphql Endpoint | `http://localhost:4000/graphql` |
| **NEXT_PUBLIC_MAPBOX_PUBLIC_KEY** | string | `Mapbox API key` |  `123456abc` |
| **NEXT_PUBLIC_AMPLITUDE_KEY** | string | `Amplitude API key` |  `123456abc` |