# Nc News Back End.

This project is a demonstration of a RESTful API written in JavaScript and using Express JS alongside PostgreSQL as a database.

This API is used as the Back End of my Front End project: https://github.com/jjcrl/fe-nc-news

## Available Data Interactions 

* GET All available endpoints
* GET An article by its id
* GET All articles , with the abilitly to filter by topic, and sort by various feilds and decide the order
* GET All users 
* GET A single user
* GET All Topics 
* GET Comments for a given article

* POST Publish a new article
* POST Comment on an article
* POST Create a new topic

* PATCH Vote on a comment 
* PATCH Vote on an article 

* DELETE Your own article
* DELETE Your own comment

## <b>How to clone and set up this repository</b>

### <b>Step 1:</b> Meet Minimum Requirements

- Node.js (v16.13.1)
- PostgreSQL (v2.5.2)

### <b>Step 2:</b> Clone this GitHub repository

`'git clone https://github.com/jjcrl/be-nc-news.git'`

### <b>Step 3:</b> Install dependencies

Install JS dependencies by running `'npm i'` within the cloned repository

You must also have PostgreSQL installed and running for following steps to succeed

### <b>Step 4:</b> Add configuration files

Create `'.env.test'` and `'.env.development'` files containing `'PGDATABASE=nc_news_test'` and `'PGDATABASE=nc_news'` respectively, <b>in the root directory</b> of this repository

### <b>Step 5:</b> Run setup scripts

- Run `'npm run setup-dbs'` to create the databases in PostgreSQL
- Run `'npm run seed'` to seed the created databases

### <b>Step 6:</b> Run tests OR Experiment with API locally

At this stage, you're able to run tests with `'npm run test'`

You can also test the API manually by running `'npm run start'` and making requests to localhost:[_port_] to whichever endpoints you wish to test
