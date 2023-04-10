import { Router } from "express"
import { UserFactory } from "../factories/user"

import JwtImpl from "../../infrastructure/utils/token"
import formData from "express-form-data"
import os from "os"

const jwt: JwtImpl = new JwtImpl()
const userFactory = UserFactory.init()
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
}

export const init = (APIRouter: Router)=> {
  APIRouter.post('/user/create', formData.parse(options), (req, res) => userFactory.createAccount(req, res))
  APIRouter.post('/user/login', (req, res) => userFactory.login(req, res))
  
  APIRouter.get('/user/profile', jwt.isAuthenticated, (req, res) => userFactory.getUser(req, res))
  
  APIRouter.put('/user/update-profile', jwt.isAuthenticated, formData.parse(options), (req, res) => userFactory.updateUser(req, res))
  APIRouter.put('/user/update-password', jwt.isAuthenticated, (req, res) => userFactory.updatePassword(req, res))
}