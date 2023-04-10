import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface Jwt {
  encode: (data: any) => string;
  decode: (token: string) => jwt.JwtPayload;
  
}

export default class JwtImpl implements Jwt {
  private secret: string = process.env.SECRET_KEY || 'secretKey';

  encode(data: any) {
    return jwt.sign(
      {
        data
      },
      this.secret,
      { expiresIn: "1h" }
    );
  }

  decode(token: string) {
    return jwt.verify(token, this.secret) as jwt.JwtPayload;
  }

  async isAuthenticated (req: Request, res:Response, next:NextFunction){
    try{
      if (!req.header('Authorization')) {
        return res.status(401).json({
          success: false,
          message: 'UNAUTHORIZED'
        })
      }
    
      const token = req.header('Authorization').split('Bearer ')
      if (token.length < 2) {
        return res.status(401).json({
          success: false,
          message: 'UNAUTHORIZED'
        })
      }
    
      const newToken = token[1]
      const verifiedJToken = new JwtImpl().decode(newToken)
  
      if(Number(verifiedJToken.exp) * 1000 < new Date().getTime()){
        return res.status(401).json({
          success: false,
          message: 'TOKEN_EXPIRED'
        })
      }
  
      res.locals.userData = verifiedJToken
  
      next()
    }catch(err){
      return res.status(401).json({
        success: false,
        message: 'TOKEN_EXPIRED'
      })
    }
  }
  
}

