import { UserRepositoryImpl } from "../../domain/repositories/user";
import { UserServiceImpl } from "../../domain/services/user";
import { UserControllerImpl } from "../../infrastructure/controllers/user";
import JwtImpl from "../../infrastructure/utils/token";
import HashImpl from "../../infrastructure/utils/hashing";
import { APIResponseImpl } from "../../infrastructure/utils/responseWrapper";

export class UserFactory {
  static init() {
    const repository = new UserRepositoryImpl();
    const jwt = new JwtImpl();
    const hashing = new HashImpl();
    const service = new UserServiceImpl(repository, hashing, jwt);
    const apiResponse = new APIResponseImpl();
    const controller = new UserControllerImpl(service, apiResponse);

    return controller;
  }
}