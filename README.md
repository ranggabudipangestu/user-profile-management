# User Profile API

In User Profile API, I try to implement Domain Driven Design. I also implement Dependency Inversion to make my code testtable.

## Tech Stack
- ExpressJS as NodeJS framework and Typescript as programming language
- MySQL as main database, and ElasticSearch for the second database(using free trial ElasticSearch Enterprise)
- Using Docker for containerization my app and deploy into my private server

## API Docs

http://38.242.247.44:4000/api-docs/#/


## Running Tests

To run tests, run the following command

```bash
  npm run test
```

To run test and code coverage, run the following command

```bash
  npm run test -- --coverage
```