import { UserService } from "../../domain/services/user"
import { responseWrapper } from "../utils/responseWrapper"
import fs from "fs"


interface UserController{
  createAccount(req, res)
  login(req, res)
  getUser(_, res)
  updateUser(req, res)
  updatePassword(req, res)
}
export class UserControllerImpl implements UserController{
  constructor(
    private service: UserService
  ){}

  async createAccount(req, res){
    try{
      const input = req.body
      const { profileImage } = req.files
      input.profileImage = fs.readFileSync(profileImage.path);

      const result = await this.service.createAccount(input)
      if (result.error) {
        return responseWrapper(res, 400, false, result.message, null);
      }
      return responseWrapper(res, 200, true, result.message, result.data);
    }catch(err){
      return responseWrapper(res, 500, false, "INTERNAL SERVER ERROR", null);
    }
  }

  async login(req, res){
    try{
      const input = req.body
      const result = await this.service.login(input)
      if (result.error) {
        return responseWrapper(res, 400, false, result.message, null);
      }
      return responseWrapper(res, 200, true, result.message, result.token);
    }catch(err){
      console.log(err)
      return responseWrapper(res, 500, false, "INTERNAL SERVER ERROR", null);
    }
  }

  async getUser(_, res){
    try{
      const { id } = res.locals.userData.data
      const result = await this.service.getUserById({ id })
      if (result.error) {
        return responseWrapper(res, 400, false, result.message, null);
      }
      return responseWrapper(res, 200, true, result.message, result.data);
    }catch(err){
      console.log(err)
      return responseWrapper(res, 500, false, "INTERNAL SERVER ERROR", null);
    }
  }

  async updateUser(req, res){
    try{
      const { id } = res.locals.userData.data
      const input = req.body
      const { profileImage } = req.files
      input.profileImage = fs.readFileSync(profileImage.path);

      const result = await this.service.updateUser(id, input)
      if (result.error) {
        return responseWrapper(res, 400, false, result.message, null);
      }
      return responseWrapper(res, 200, true, result.message, result.data);
    }catch(err){
      console.log(err)
      return responseWrapper(res, 500, false, "INTERNAL SERVER ERROR", null);
    }
  }

  async updatePassword(req, res){
    try{
      const { email } = res.locals.userData.data
      const input = req.body

      const result = await this.service.updatePassword(email, input)
      if (result.error) {
        return responseWrapper(res, 400, false, result.message, null);
      }
      return responseWrapper(res, 200, true, result.message, result.data);
    }catch(err){
      console.log(err)
      return responseWrapper(res, 500, false, "INTERNAL SERVER ERROR", null);
    }
  }
  
}
