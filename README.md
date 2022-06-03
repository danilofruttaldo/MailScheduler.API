# MailScheduler API
Web service to schedule the automatic sending of emails

The service shows the current status of the various schedules, and allows you to update them

Scheduling is only possible for authenticated users

## Specifications
- Node.js
- TypeScript
- CRUD-like
- OpenAPI / Swagger
- File database
- Logging
- Test


# Setup
## Install dependencies
    npm install

## Environment file
### File content
    ./src/pre-start/env/development.env

    ## Environment ##
    NODE_ENV=development


    ## Server ##
    PORT=3000
    HOST=localhost


    ## Setup jet-logger ##
    JET_LOGGER_MODE=CONSOLE
    JET_LOGGER_FILEPATH=jet-logger.log
    JET_LOGGER_TIMESTAMP=TRUE
    JET_LOGGER_FORMAT=LINE


    ## Setup nodemailer ##
    NODE_MAILER_HOST=stmp.email.com
    NODE_MAILER_PORT=2525
    NODE_MAILER_USER=username
    NODE_MAILER_PASS=password

## Run the app
    npm run start
    npm run start:dev

## Run the tests
    npm run test
    npm run test:no reloading

## Other commands
    npm run build
    npm run lint


# Authentication (production only)
In production mode a basicAuth middleware will be loaded, using password from related environment variable file
### File content
    ./src/pre-start/env/production.env

    ## Setup basic auth ##
    BASIC_AUTH_PASS=supersecret456


# Rest API
The REST API is described below.

## Get all Emails
### Request
`GET /api/emails`

    curl -i -H 'Accept: application/json' http://localhost:3000/api/emails/
### Response
    HTTP/1.1 200 OK
    Status: 200 OK
    Content-Type: application/json
    {"emails":[{"id":"e9fa27de-22d8-4201-b293-9d86e0d37985","to":["utente1@email.com","utente2@email.com"],"cc":[""],"ccn":["admin1@email.com"],"subject":"Test 1","body":"This is a scheduled email","job":{"cron":"","id":"608c271d-4974-426f-b911-3449a5360819","status":"Disabled"}},{"id":"69166e72-3372-4b53-b7b2-903cde9d8c8d","to":["admin1@email.com"],"cc":["admin2@email.com","admin3@email.com"],"ccn":[""],"subject":"Test 2","body":"This is another scheduled email","job":{"cron":"","id":"ae2a19b9-5bc0-4213-a80d-a8d113642922","status":"Disabled"}},{"id":"8f749c26-7e3c-4295-9fdc-6ae06f4310fd","to":[""],"cc":["admin1@email.com","admin2@email.com","admin3@email.com"],"ccn":["admin0@email.com"],"subject":"Test 3","body":"This is the third scheduled email","job":{"cron":"","id":"cd1b71e7-084f-4e0f-abc4-77df07b91bd2","status":"Disabled"}}]}

## Get an Email by id
### Request
`GET /api/emails/:id`

    curl -i -H 'Accept: application/json' http://localhost:7000/api/emails/e9fa27de-22d8-4201-b293-9d86e0d37985
### Response
    HTTP/1.1 200 OK
    Status: 200 OK
    Content-Type: application/json
    {"emails":{"id":"e9fa27de-22d8-4201-b293-9d86e0d37985","to":["utente1@email.com","utente2@email.com"],"cc":[""],"ccn":["admin1@email.com"],"subject":"Test 1","body":"This is a scheduled email","job":{"cron":"","id":"608c271d-4974-426f-b911-3449a5360819","status":"Disabled"}}}


## Create an Email
### Request
`POST /api/emails`

    curl -i -H 'Accept: application/json' POST http://localhost:3000/api/emails
    -d '{"email":{"to":["utente1@email.com","utente2@email.com"],"cc":[""],"ccn":["admin1@email.com"],"subject":"Test 1","body":"This is a scheduled email","job":{"cron":""}}}'
### Response
    HTTP/1.1 201 Created
    Status: 201 Created

## Update an Email
### Request
`PUT /api/emails/:id`

    curl -i -H 'Accept: application/json' PUT http://localhost:7000/api/emails
    -d '{"email":{"id":"e9fa27de-22d8-4201-b293-9d86e0d37985","to":["utente1@email.com","utente2@email.com"],"cc":[""],"ccn":["admin1@email.com"],"subject":"Test 1","body":"This is a scheduled email","job":{"cron":"","id":"608c271d-4974-426f-b911-3449a5360819"}}}'
### Response
    HTTP/1.1 200 OK
    Status: 200 OK

## Delete an Email
### Request
`DELETE /api/emails/:id`

    curl -i -H 'Accept: application/json' DELETE http://localhost:7000/api/emails/e9fa27de-22d8-4201-b293-9d86e0d37985
### Response
    HTTP/1.1 200 OK
    Status: 200 OK