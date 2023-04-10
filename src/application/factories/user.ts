import { UserRepositoryImpl } from "../../domain/repositories/user";
import { UserServiceImpl } from "../../domain/services/user";
import { UserControllerImpl } from "../../infrastructure/controllers/user";
import JwtImpl from "../../infrastructure/utils/token";
import HashImpl from "../../infrastructure/utils/hashing";

export class UserFactory {
  static init() {
    const repository = new UserRepositoryImpl();
    const jwt = new JwtImpl();
    const hashing = new HashImpl();
    const service = new UserServiceImpl(repository, hashing, jwt);
    const controller = new UserControllerImpl(service);

    return controller;
  }
}