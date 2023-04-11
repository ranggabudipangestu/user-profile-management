import { UserRepository } from "../repositories/user";
import { CreateUser, Login, UpdateProfile, UpdatePassword } from "../dtos/user";

import { loginValidation } from "../validator/loginValidation";
import { createAccountValidation } from "../validator/createAccountValidation";

import { Hash } from "../../infrastructure/utils/hashing";
import { Jwt } from "../../infrastructure/utils/token";

export interface UserService {
  createAccount(input: CreateUser): Promise<any>;
  login(input: Login): Promise<any>;
  getUserById({ id }): Promise<any>;
  updateUser(id, input: UpdateProfile): Promise<any>;
  updatePassword(email, input: UpdatePassword): Promise<any>;
}

export class UserServiceImpl implements UserService {
  constructor(
    private repository: UserRepository,
    private hashing: Hash,
    private jwt: Jwt
  ) {
    this.repository = repository;
    this.hashing = hashing;
    this.jwt = jwt;
  }

  async createAccount(input: CreateUser): Promise<any> {
    try {
      await createAccountValidation(input);
      let { password } = input;
      const {
        email,
        username,
        description,
        fullName,
        profileImage,
        phoneNumber,
      } = input;
      const checkExists = await this.repository.getUserByEmailOrUsername({
        email,
      });
      if (checkExists)
        return { error: true, message: "Username or email already exist" };
      password = await this.hashing.hash(password);
      const result = await this.repository.create({
        email,
        username,
        password,
        description,
        fullName,
        profileImage,
        phoneNumber,
      });

      if (!result) return { error: true, message: "Failed to create user" };

      return {
        error: false,
        data: "Successfully createAccount",
      };
    } catch (err) {
      return {
        error: true,
        message: err.message || "Failed to create user",
      };
    }
  }

  async login(input: Login): Promise<any> {
    try {
      await loginValidation(input);
      const { email, password } = input;
      const result = await this.repository.getUserByEmailOrUsername({ email });
      if (!result)
        return { error: true, message: "Username or email doen't exist" };

      const isPasswordMatch = await this.hashing.compare(
        password,
        result.password
      );
      if (result && isPasswordMatch) {
        const token = this.jwt.encode({
          id: result.id,
          email: result.email,
          username: result.username,
        });
        return {
          error: false,
          token,
        };
      } else {
        return {
          error: true,
          message: "Password doesn't match",
        };
      }
    } catch (err) {
      return { error: true, message: err.message || "Failed to login" };
    }
  }

  async getUserById({ id }): Promise<any> {
    const result = await this.repository.getUserById({ id });
    if (result && result.length > 0) {
      const { _source } = result[0];
      const data = {
        userId: _source.userId,
        fullName: _source.fullName,
        description: _source.description,
        phoneNumber: _source.phoneNumber,
        profileImage: await this.repository.getProfilePicture({ id }),
      };

      return {
        error: false,
        data,
      };
    }

    return {
      error: false,
      data: null,
    };
  }

  async updateUser(id, input: UpdateProfile): Promise<any> {
    try {
      const getUserById = await this.repository.getUserById({ id });
      if (!getUserById) {
        return {
          error: true,
          message: "User not found",
        };
      }

      const { fullName, description, phoneNumber, profileImage } = input;

      await this.repository.updateUser({
        id,
        fullName,
        description,
        phoneNumber,
        profileImage,
      });

      return {
        error: false,
        data: "Successfully Update User Profile",
      };
    } catch (err) {
      return {
        error: true,
        message: err.message || "Failed to Update User Profile",
      };
    }
  }

  async updatePassword(email, input: UpdatePassword): Promise<any> {

    try {
      const { oldPassword, retypePassword, newPassword  } = input;
      if(oldPassword !== retypePassword) {
        return {
          error: true,
          message: "Password doesn't match",
        };
      }

      const getUserData = await this.repository.getUserByEmailOrUsername({ email });
      const isPasswordMatch = await this.hashing.compare(oldPassword, getUserData.password);

      if (!isPasswordMatch) {
        return {
          error: true,
          message: "Your old Password doesn't match",
        };
      }

      if(oldPassword === newPassword) {
        return {
          error: true,
          message: "Please use different password with your old password",
        };
      }

      await this.repository.updatePassword({ 
        id: getUserData.id, 
        password: await this.hashing.hash(newPassword)
      });
      
      return {
        error: false,
        data: "Successfully Update Password",
      };
      
    } catch (err) {
      return { error: true, message: err || "Failed to Update Password" };
    }
  }
}
