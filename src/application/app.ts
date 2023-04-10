import express from 'express';
import http from 'http';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import * as routes from "./routes"

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

  // await elasticClient.indices.delete({
  //   index: 'users'
  // })

  app.use('/', APIRouter)
  routes.init(APIRouter)
  
  return httpServer
}