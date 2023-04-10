import { UserServiceImpl } from "../../src/domain/services/user";
import { UserRepositoryImpl } from "../../src/domain/repositories/user";
import { expect } from "chai";
import { Login, CreateUser } from "../../src/domain/dtos/user";
import { ObjectId } from "mongoose/lib/types";

describe("User Service", () => {
  describe("SIGN IN", () => {
    it("It Should Be Success", async () => {
      class MockRepository extends UserRepositoryImpl {
        async getUserByEmailOrUsername({ email }): Promise<any> {
          return {
            _id : ObjectId("63f85db4f912f85555c21a90"),
            email : "admin@mailinator.com",
            password : "$2b$10$q986R1IfL8wQA1O0hPv2.uFc7jnOd3.JrUXqXSeb1vCQ9KpgswIvu",
            username : "admin",
            role : "ADMIN",
            __v : 0
          }
        }
      }
      const repository = new MockRepository();
      const service = new UserServiceImpl(repository);
      const data:Login = {
        email:"admin",
        password: "admin123"
      }
      const result = await service.login(data);
      expect(result.error).to.be.false;
      expect(result.token).to.be.an('string')
    });

    it("Username or email not found", async () => {
      class MockRepository extends UserRepositoryImpl {
        async getUserByEmailOrUsername({ email }): Promise<any> {
          return null
        }
      }
      const repository = new MockRepository();
      const service = new UserServiceImpl(repository);
      const data:Login = {
        email:"admin",
        password: "admin123"
      }
      const result = await service.login(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal(`Username or email doen't exist`)
    });

    it("password doesn't match", async () => {
      class MockRepository extends UserRepositoryImpl {
        async getUserByEmailOrUsername({ email }): Promise<any> {
          return {
            _id : ObjectId("63f85db4f912f85555c21a90"),
            email : "admin@mailinator.com",
            password : "$2b$10$q986R1IfL8wQA1O0hPv2.uFc7jnOd3.JrUXqXSeb1vCQ9KpgswIvu",
            username : "admin",
            role : "ADMIN",
            __v : 0
          }
        }
      }
      const repository = new MockRepository();
      const service = new UserServiceImpl(repository);
      const data:Login = {
        email:"admin",
        password: "admin14124"
      }
      const result = await service.login(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal(`Password doesn't match`)
    });

    it("Username not filled", async () => {
      class MockRepository extends UserRepositoryImpl {
        async getUserByEmailOrUsername({ email }): Promise<any> {
          return null
        }
      }
      const repository = new MockRepository();
      const service = new UserServiceImpl(repository);
      const data = {
        email:null,
        password: "admin14124"
      }
      const result = await service.login(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal(`email is a required field`)
    });

    it("Password not filled", async () => {
      class MockRepository extends UserRepositoryImpl {
        async getUserByEmailOrUsername({ email }): Promise<any> {
          return null
        }
      }
      const repository = new MockRepository();
      const service = new UserServiceImpl(repository);
      const data = {
        email: "admin",
        password: null
      }
      const result = await service.login(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal(`password is a required field`)
    });

  });

  describe("SIGN UP", () => {
    it("It Should Be Success", async () => {
      class MockRepository extends UserRepositoryImpl {
        async getUserByEmailOrUsername({ email }): Promise<any> {
          return null
        }
        async create({email, password, username, role}): Promise<boolean> {
          return true
        }
      }
      const repository = new MockRepository();
      const service = new UserServiceImpl(repository);
      const data:CreateUser = {
        email:"admin@mail.com",
        password: "admin123",
        username:"admin",

      }
      const result = await service.createAccount(data);
      expect(result.error).to.be.false;
      expect(result.data).to.equal("Successfully createAccount")
    });

    it("username or email already exists", async () => {
      class MockRepository extends UserRepositoryImpl {
        async getUserByEmailOrUsername({ email }): Promise<any> {
          return {
            _id : ObjectId("63f85db4f912f85555c21a90"),
            email : "admin@mailinator.com",
            password : "$2b$10$q986R1IfL8wQA1O0hPv2.uFc7jnOd3.JrUXqXSeb1vCQ9KpgswIvu",
            username : "admin",
            role : "ADMIN",
            __v : 0
          }
        }
        async create({email, password, username, role}): Promise<boolean> {
          return true
        }
      }
      const repository = new MockRepository();
      const service = new UserServiceImpl(repository);
      const data:CreateUser = {
        email:"admin@mail.com",
        password: "admin123",
        username:"admin",

      }
      const result = await service.createAccount(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal("Username or email already exist")
    });


    it("email not filled", async () => {
      class MockRepository extends UserRepositoryImpl {
        async getUserByEmailOrUsername({ email }): Promise<any> {
          return null
        }
      }
      const repository = new MockRepository();
      const service = new UserServiceImpl(repository);
      const data = {
        email:null,
        password: "admin14124",
        username: 'admin'
      }
      const result = await service.createAccount(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal(`email is a required field`)
    });

    it("Password not filled", async () => {
      class MockRepository extends UserRepositoryImpl {
        async getUserByEmailOrUsername({ email }): Promise<any> {
          return null
        }
      }
      const repository = new MockRepository();
      const service = new UserServiceImpl(repository);
      const data = {
        email: "admin@gmail.com",
        password: null,
        username: 'admin'
      }
      const result = await service.createAccount(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal(`password is a required field`)
    });

    it("Username not filled", async () => {
      class MockRepository extends UserRepositoryImpl {
        async getUserByEmailOrUsername({ email }): Promise<any> {
          return null
        }
      }
      const repository = new MockRepository();
      const service = new UserServiceImpl(repository);
      const data = {
        email: "admin@gmail.com",
        password: 'admin',
        username: null
      }
      const result = await service.createAccount(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal(`username is a required field`)
    });

  });
});
