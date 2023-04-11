# User Profile API

In User Profile API, I try to implement Domain Driven Design. I also implement Dependency Inversion to make my code testtable.


## Tech Stack

- ExpressJS as NodeJS framework and Typescript as programming language
- MySQL as main database, and ElasticSearch for the second database(using free trial ElasticSearch Enterprise)
- Using Docker for containerization my app and deploy into my private server


## API url

http://38.242.247.44:4000/


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

## Containerization

Clone the project

```bash
  git clone https://github.com/ranggabudipangestu/populix
```

Go to the project directory

```bash
  cd populix
```

Adjust environment in docker-compose.yaml

```bash
  - PORT=4000
  - DB_HOST=mysql
  - DB_USER=your_user
  - DB_PASSWORD=your_password
  - DB_PORT=3306
  - DB_NAME=populix
  - SECRET_KEY=your_secret_key
  - ELASTIC_SEARCH_CLOUD_USERNAME=your_cloud_username
  - ELASTIC_SEARCH_CLOUD_PASSWORD=your_cloud_password
  - ELASTIC_SEARCH_CLOUD_ID=your_cloud_id
```

Run docker-compose
```bash
  docker-compose up -d
```