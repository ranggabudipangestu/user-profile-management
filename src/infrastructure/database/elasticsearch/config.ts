import { Client } from '@elastic/elasticsearch'
import dotenv from 'dotenv';
dotenv.config();

export const elasticClient = new Client({
  cloud: {
    id: process.env.ELASTIC_SEARCH_CLOUD_ID
  },
  auth: {
    username: process.env.ELASTIC_SEARCH_CLOUD_USERNAME,
    password: process.env.ELASTIC_SEARCH_CLOUD_PASSWORD
  }
})