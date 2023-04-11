import express from 'express';
import http from 'http';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import * as routes from "./routes"
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import SwaggerDoc from '../../swagger.json'

export async function AppServer(){

  const app = express();
  const APIRouter = express.Router();
  const httpServer = http.createServer(app);
  app.use(cors())
  app.use(express.urlencoded({ extended: true }))
  app.use(json())
  app.use(urlencoded({extended: true}))

  app.get('/', (req, res) =>{
    res.send('Server is running properly')
  })

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerDoc));

  app.use('/', APIRouter)

  
  routes.init(APIRouter)
  
  return httpServer
}