# CDRjobs

## Backend

### Prerequisite

You need the following pieces of software and accounts to launch the backend:
- Postgres >= v16
- A [Postmark](https://postmarkapp.com/) account to send emails
- A [Mapbox](https://www.mapbox.com/) account to get city coordinates 

### Installation

1. Go inside the backend directory
```bash
cd ./website/backend
```

2. Install the node modules and generate Prisma
```bash
yarn && yarn prisma:generate
```

3. Copy `.env.dist` to `.env`
```bash
cp .env.dist .env
```

4. Fill `.env` with the correct values (see section [Backend environment variables](#backend-environment-variables))
```bash
nano .env # or IDE
```

5. Generate Prisma database
```bash
yarn prisma:migrate
```

### Launch

To launch the backend server, run:
```bash
yarn dev
```

### Backend environment variables 
| Name | Type | Description | Example |
| ---- | ---- | ----------- | ------- |
| **DATABASE_URL** | string | A postgres connexion URL | `postgresql://cdrjobs:cdrjobs@127.0.0.1:5432/cdrjobs?schema=public` |
| **KOA_KEYS** | string | Koa secrets keys to sign cookies |  `key1,key2,key3` |
| **POSTMARK_KEY** | string | Postmark API key |  `a31445bc-67c5-b514-a684-26c2f780f341` |
| **FROM_EMAIL** | string | Email address from which emails are sent | `CDRjobs <info@cdrjobs.earth>` |
| **FIRST_EMAIL_TEMPLATE_ID** | number | Template ID from Postmark that corresponds to the first matching email people receive | `12345678` |
| **SECOND_EMAIL_TEMPLATE_ID** | number | Template ID from Postmark that corresponds to the second and following matching emails people receive | `12345678` |
| **FIRST_EMAIL_NO_MATCH_TEMPLATE_ID** | number | Template ID from Postmark that corresponds to the first matching emails people receive when they have no match | `12345678` |
| **SECOND_EMAIL_NO_MATCH_TEMPLATE_ID** | number | Template ID from Postmark that corresponds to the second and following matching emails people receive when they have no match | `12345678` |
| **REPORT_NO_NL_TEMPLATE_ID** | number | Template ID from Postmark that corresponds to the email sending the salary report when the user didn't register to the newsletter | `12345678` |
| **REPORT_WITH_NL_TEMPLATE_ID** | number | Template ID from Postmark that corresponds to the email sending the salary report when the user already registered to the newsletter | `12345678` |
| **JWT_KEY** | string | Secret key to hash the user passwords | `123456abc` |
| **RESET_PASSWORD_URL** | string | URL used to create the reset password link | `http://localhost:3000/app/auth/reset-password/` |
| **API_TOKEN** | string | Secret token used to access the REST API routes | `123456abc` |
| **MAPBOX_TOKEN** | string | `Mapbox API key` |  `123456abc` |
| **PUBLIC_PATH** | string | Relative path to the public folder to serve it | `./public` |
| **IMAGE_FOLDER** | string | Folder name inside [PUBLIC_PATH] that serve the images | `images` |
| **ALLOW_SENDING_MATCHING_EMAILS** | boolean | Enables the route that triggers the emails matching sending | `false` |
| **ATTACHMENTS_PATH** | string | Relative path to the attachment folder that contains emails attachments such as the salary survey | `./attachments` |
| **WEBHOOK_TOKEN** | string | Wix webhook token to authenticate requests from wix (used to send the salary report) | `123456abc` |


## Frontend

### Prerequisite

You need the following accounts to launch the backend:
- A [Mapbox](https://www.mapbox.com/) account to get city coordinates 
- An [Amplitude](https://amplitude.com/) account for telemetry

### Installation

1. Go inside the front directory
```bash
cd ./website/frontend
```

2. Install the node modules
```bash
yarn
```

3. Copy `.env.local.dist` to `.env.local`
```bash
cp .env.local.dist .env.local
```

4. Fill `.env.local` with the correct values (see section [Frontend environment variables](#frontend-environment-variables))

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