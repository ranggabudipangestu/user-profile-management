import { UserControllerImpl } from '../src/infrastructure/controllers/user';
import { UserService } from '../src/domain/services/user';
import { APIResponse } from '../src/infrastructure/utils/responseWrapper';
import fs from 'fs';

describe('UserControllerImpl', () => {
  let controller: UserControllerImpl;
  let userService: UserService;
  let req: any;
  let res: any;
  let apiResponse: APIResponse;


  beforeEach(() => {
    userService = {
      createAccount: jest.fn(),
      login: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
    };

    apiResponse = {
      wrap: jest.fn(),
    }
    controller = new UserControllerImpl(userService, apiResponse);
    req = {
      body: {
        email: '',
        password:'',
        fullName: '',
      },
    };
    res = {
      locals: {
        userData: {
          data: {
            id: 1,
            email: 'test@example.com',
          },
        },
      },
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createAccount', () => {
    it('should return a 400 response if service returns an error', async () => {
      const error = { error: true, message: 'Failed to create user' };
      jest.spyOn(userService, 'createAccount').mockReturnValueOnce(error);
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(error);

      await controller.createAccount(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        400,
        false,
        error.message,
        null
      );
    });

    it('should return a 200 response with data if service returns a success result', async () => {
      const success = { error: false, message: 'Successfully createAccount', data: {} };
      jest.spyOn(userService, 'createAccount').mockReturnValueOnce(success);
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(success);
      await controller.createAccount(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        200,
        true,
        success.message,
        success.data
      );
    });

    it('should return a 500 response if service returns an error', async () => {
      const error = { error: true, message: 'Failed to update User' };
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(error);

      await controller.createAccount(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        500,
        false,
        'INTERNAL SERVER ERROR',
        null
      );
    })
  });

  describe('login', () => {
    it('should return a 400 response if service returns an error', async () => {
      const error = { error: true, message: 'Failed to Login' };
      jest.spyOn(userService, 'login').mockReturnValueOnce(error);
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(res);

      await controller.login(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        400,
        false,
        error.message,
        null
      );
    });

    it('should return a 200 response with data if service returns a success result', async () => {
      const success = { error: false, data:'my token' };
      jest.spyOn(userService, 'login').mockReturnValueOnce(success);
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(success);
      await controller.login(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        200,
        true,
        undefined,
        undefined,
      );
    });

    it('should return a 500 response if service returns an error', async () => {
      const error = { error: true, message: 'Failed to update User' };
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(error);

      await controller.login(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        500,
        false,
        'INTERNAL SERVER ERROR',
        null
      );
    })
  });

  describe('get user by id', () => {

    it('should return a 200 response with data if service returns a success result', async () => {
      const success = {
        error: false,
        data: {
          userId: 1,
          fullName: "lorem ipsum",
          description: "lorem ipsum",
          phoneNumber: "lorem ipsum",
          profileImage: "profile-image-url",
        },
      };
      jest.spyOn(userService, 'getUserById').mockReturnValueOnce(success);
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(success);
      await controller.getUser(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        200,
        true,
        undefined,
        success.data,
      );
    });

    it('should return a 400 response if service returns an error', async () => {
      const error = { error: true, message: 'Failed to get user' };
      jest.spyOn(userService, 'getUserById').mockReturnValueOnce(error);
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(error);

      await controller.getUser(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        400,
        false,
        error.message,
        null
      );
    });

    it('should return a 500 response if service returns an error', async () => {
      const error = { error: true, message: 'Failed to get user' };
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(error);

      await controller.getUser(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        500,
        false,
        'INTERNAL SERVER ERROR',
        null
      );
    });

  });


  describe('Update User', () => {

    it('should return a 200 response with data if service returns a success result', async () => {
      const success = {
        error: false,
        data: 'User Updated Successfully',
      };
      jest.spyOn(userService, 'updateUser').mockReturnValueOnce(success);
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(success);
      await controller.updateUser(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        200,
        true,
        undefined,
        success.data,
      );
    });

    it('should return a 400 response if service returns an error', async () => {
      const error = { error: true, message: 'Failed to updateUser' };
      jest.spyOn(userService, 'updateUser').mockReturnValueOnce(error);
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(error);

      await controller.updateUser(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        400,
        false,
        error.message,
        null
      );
    });

    it('should return a 500 response if service returns an error', async () => {
      const error = { error: true, message: 'Failed to update User' };
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(error);

      await controller.updateUser(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        500,
        false,
        'INTERNAL SERVER ERROR',
        null
      );
    });
  })

  describe('Update Password', () => {

    it('should return a 200 response with data if service returns a success result', async () => {
      const success = {
        error: false,
        data: 'Password Updated Successfully',
      };
      jest.spyOn(userService, 'updatePassword').mockReturnValueOnce(success);
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(success);
      await controller.updatePassword(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        200,
        true,
        undefined,
        success.data,
      );
    });

    it('should return a 400 response if service returns an error', async () => {
      const error = { error: true, message: 'Failed to update password' };
      jest.spyOn(userService, 'updatePassword').mockReturnValueOnce(error);
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(error);

      await controller.updatePassword(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        400,
        false,
        error.message,
        null
      );
    });

    it('should return a 500 response if service returns an error', async () => {
      const error = { error: true, message: 'Failed to update User' };
      jest.spyOn(apiResponse, 'wrap').mockReturnValueOnce(error);

      await controller.updatePassword(req, res);
      expect(apiResponse.wrap).toHaveBeenCalledWith(
        res,
        500,
        false,
        'INTERNAL SERVER ERROR',
        null
      );
    });
  })

});