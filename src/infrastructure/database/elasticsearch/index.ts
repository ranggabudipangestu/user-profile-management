import { AppServer } from "./application/app"
import loginv from 'loginv';
loginv.config();

const start= async() =>{
  const httpServer = await AppServer()
  const port = process.env.PORT || 4000
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}`);
}

start()