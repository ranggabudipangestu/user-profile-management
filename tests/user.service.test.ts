import { loginValidation } from "../src/domain/validator/loginValidation";

import { UserServiceImpl } from "../src/domain/services/user";
import { CreateUser, UpdateProfile } from "../src/domain/dtos/user";

class UserRepositoryMock {
  getUserByEmailOrUsername = jest.fn();
  create = jest.fn();
  getUserById = jest.fn();
  getProfilePicture = jest.fn();
  updateUser = jest.fn();
  updatePassword = jest.fn();
}

class HashingMock {
  compare = jest.fn();
  hash = jest.fn();
}

class JwtMock {
  encode = jest.fn();
  decode = jest.fn();
}

const userRepositoryMock = new UserRepositoryMock();
const hashingMock = new HashingMock();
const jwtMock = new JwtMock();
const userService = new UserServiceImpl(
  userRepositoryMock,
  hashingMock,
  jwtMock
);

describe("createAccount", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create an account when input is valid", async () => {
    userRepositoryMock.getUserByEmailOrUsername.mockResolvedValueOnce(null);
    userRepositoryMock.create.mockResolvedValueOnce({ id: 1 });
    const input: CreateUser = {
      email: "test@example.com",
      username: "testuser",
      password: "password",
      fullName: "Test User",
      description: "Test Description",
      phoneNumber: "1234567890",
      // profileImage: new Blob(['test']),
    };
    const result = await userService.createAccount(input);
    expect(userRepositoryMock.getUserByEmailOrUsername).toHaveBeenCalledWith({
      email: input.email,
    });
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      email: input.email,
      username: input.username,
      description: "Test Description",
      fullName: input.fullName,
      profileImage: undefined,
      phoneNumber: "1234567890",
    });
    expect(result).toEqual({
      error: false,
      data: "Successfully createAccount",
    });
  });

  it("should return an error if email or username already exists", async () => {
    userRepositoryMock.getUserByEmailOrUsername.mockResolvedValueOnce({
      id: 1,
    });
    const input: CreateUser = {
      email: "test@example.com",
      username: "testuser",
      password: "password",
      fullName: "Test User",
      phoneNumber: "",
    };
    const result = await userService.createAccount(input);
    expect(userRepositoryMock.getUserByEmailOrUsername).toHaveBeenCalledWith({
      email: input.email,
    });
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      error: true,
      message: "Username or email already exist",
    });
  });

  it("should return an error if failed to create user", async () => {
    userRepositoryMock.getUserByEmailOrUsername.mockRejectedValueOnce(new Error("Failed to create user"));
    userRepositoryMock.create.mockResolvedValueOnce(null);
    hashingMock.hash.mockResolvedValueOnce("password");

    const input: CreateUser = {
      email: "test@example.com",
      username: "testuser",
      password: "password",
      fullName: "Test User",
      phoneNumber: "1234567890",
    };
    const result = await userService.createAccount(input);
    expect(userRepositoryMock.getUserByEmailOrUsername).toHaveBeenCalledWith({
      email: input.email,
    });
    expect(result).toEqual({ error: true, message: "Failed to create user" });
  });

  it("should return an error if failed to create user", async () => {
    userRepositoryMock.getUserByEmailOrUsername.mockResolvedValueOnce(null);
    userRepositoryMock.create.mockResolvedValueOnce(false);
    hashingMock.hash.mockResolvedValueOnce("password");

    const input: CreateUser = {
      email: "test@example.com",
      username: "testuser",
      password: "password",
      fullName: "Test User",
      phoneNumber: "1234567890",
    };
    const result = await userService.createAccount(input);
    expect(userRepositoryMock.getUserByEmailOrUsername).toHaveBeenCalledWith({
      email: input.email,
    });
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      email: input.email,
      username: input.username,
      password: "password",
      fullName: input.fullName,
      profileImage: undefined,
      phoneNumber: "1234567890",
      description: undefined,
    });
    expect(result).toEqual({ error: true, message: "Failed to create user" });
  });

});

describe("login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a token when user exists and password is correct", async () => {
    const user = {
      id: 1,
      email: "john@example.com",
      username: "john",
      password: "$2a$10$HYe5aWX7Am./13az5qu5XeI5lL0ZrNzrQiaN8InV.YMqwEqgRiTXa", // hashed password: 'password'
    };
    jest
      .spyOn(userRepositoryMock, "getUserByEmailOrUsername")
      .mockResolvedValue(user);
    jest.spyOn(hashingMock, "compare").mockResolvedValue(true);
    jest.spyOn(jwtMock, "encode").mockReturnValue("mocked_token");

    const result = await userService.login({
      email: "john@example.com",
      password: "password",
    });

    expect(result).toEqual({
      error: false,
      token: "mocked_token",
    });
  });

  it("should return an error when user does not exist", async () => {
    jest
      .spyOn(userRepositoryMock, "getUserByEmailOrUsername")
      .mockResolvedValue(null);

    const result = await userService.login({
      email: "nonexistent@example.com",
      password: "password",
    });

    expect(result).toEqual({
      error: true,
      message: "Username or email doen't exist",
    });
  });

  it("should return an error when password is incorrect", async () => {
    const user = {
      id: 1,
      email: "john@example.com",
      username: "john",
      password: "$2a$10$HYe5aWX7Am./13az5qu5XeI5lL0ZrNzrQiaN8InV.YMqwEqgRiTXa", // hashed password: 'password'
    };
    jest
      .spyOn(userRepositoryMock, "getUserByEmailOrUsername")
      .mockResolvedValue(user);
    jest.spyOn(hashingMock, "compare").mockResolvedValue(false);

    const result = await userService.login({
      email: "john@example.com",
      password: "wrong_password",
    });

    expect(result).toEqual({
      error: true,
      message: "Password doesn't match",
    });
  });

  it("should return an error when an internal error occurs", async () => {
    jest
      .spyOn(userRepositoryMock, "getUserByEmailOrUsername")
      .mockRejectedValue(new Error("Internal error"));

    const result = await userService.login({
      email: "john@example.com",
      password: "password",
    });

    expect(result).toEqual({
      error: true,
      message: "Internal error",
    });
  });
});

describe("getUserById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return data when user exists", async () => {
    const id = 1;
    const user = {
      _source: {
        userId: "1",
        fullName: "John Doe",
        description: "Lorem ipsum",
        phoneNumber: "1234567890",
      },
    };
    const profileImage = "profile-image-url";
    userRepositoryMock.getUserById.mockResolvedValue([user]);
    userRepositoryMock.getProfilePicture.mockResolvedValue(profileImage);

    const result = await userService.getUserById({ id });

    expect(userRepositoryMock.getUserById).toHaveBeenCalledWith({ id });
    expect(userRepositoryMock.getProfilePicture).toHaveBeenCalledWith({ id });
    expect(result).toEqual({
      error: false,
      data: {
        userId: user._source.userId,
        fullName: user._source.fullName,
        description: user._source.description,
        phoneNumber: user._source.phoneNumber,
        profileImage,
      },
    });
  });

  it("should return null data when user does not exist", async () => {
    const id = 1;
    userRepositoryMock.getUserById.mockResolvedValue([]);

    const result = await userService.getUserById({ id });

    expect(userRepositoryMock.getUserById).toHaveBeenCalledWith({ id });
    expect(userRepositoryMock.getProfilePicture).not.toHaveBeenCalled();
    expect(result).toEqual({
      error: false,
      data: null,
    });
  });
});

describe("updateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update user profile and return success message", async () => {
    const id = "123";
    const input: UpdateProfile = {
      fullName: "John Doe",
      description: "Lorem ipsum",
      phoneNumber: "1234567890",
      profileImage: "image-url",
    };
    const getUserById = {
      id,
      fullName: "Jane Doe",
      description: "Dolor sit amet",
      phoneNumber: "0987654321",
      profileImage: "old-image-url",
    };
    userRepositoryMock.getUserById.mockResolvedValue(getUserById);

    const result = await userService.updateUser(id, input);

    expect(userRepositoryMock.getUserById).toHaveBeenCalledWith({ id });
    expect(userRepositoryMock.updateUser).toHaveBeenCalledWith({
      id,
      fullName: input.fullName,
      description: input.description,
      phoneNumber: input.phoneNumber,
      profileImage: input.profileImage,
    });
    expect(result).toEqual({
      error: false,
      data: "Successfully Update User Profile",
    });
  });

  it("should return error message when user does not exist", async () => {
    const id = "123";
    const input = {
      fullName: "John Doe",
      description: "Lorem ipsum",
      phoneNumber: "1234567890",
      profileImage: "image-url",
    };
    userRepositoryMock.getUserById.mockResolvedValue(null);
    const result = await userService.updateUser(id, input);
    expect(userRepositoryMock.getUserById).toHaveBeenCalledWith({ id });
    expect(userRepositoryMock.updateUser).not.toHaveBeenCalled();
    expect(result).toEqual({
      error: true,
      message: "User not found",
    });
  });

  it("should return error message when update fails", async () => {
    const id = "123";
    const input = {
      fullName: "John Doe",
      description: "Lorem ipsum",
      phoneNumber: "1234567890",
      profileImage: "image-url",
    };
    const error = new Error("Something went wrong");
    userRepositoryMock.getUserById.mockResolvedValue({
      id,
      fullName: "Jane Doe",
      description: "Dolor sit amet",
      phoneNumber: "0987654321",
      profileImage: "old-image-url",
    });
    userRepositoryMock.updateUser.mockRejectedValue(error);

    // Act
    const result = await userService.updateUser(id, input);

    // Assert
    expect(userRepositoryMock.getUserById).toHaveBeenCalledWith({ id });
    expect(userRepositoryMock.updateUser).toHaveBeenCalledWith({
      id,
      fullName: input.fullName,
      description: input.description,
      phoneNumber: input.phoneNumber,
      profileImage: input.profileImage,
    });
    expect(result).toEqual({
      error: true,
      message: "Something went wrong",
    });
  });
});

describe("updatePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should update password and return success message", async () => {
    const mockUserData = {
      id: "1234",
      email: "test@example.com",
      password: "oldpassword",
    };

    jest
      .spyOn(userRepositoryMock, "getUserByEmailOrUsername")
      .mockResolvedValue(mockUserData);

    jest.spyOn(hashingMock, "compare").mockResolvedValue(true);

    jest.spyOn(hashingMock, "hash").mockResolvedValue("newhashedpassword");
    // Arrange
    const email = "test@example.com";
    const input = {
      oldPassword: "oldpassword",
      retypePassword: "oldpassword",
      newPassword: "newpassword",
    };
    const expectedResponse = {
      error: false,
      data: "Successfully Update Password",
    };

    const result = await userService.updatePassword(email, input);

    // Assert
    expect(userRepositoryMock.getUserByEmailOrUsername).toHaveBeenCalledWith({
      email,
    });
    expect(hashingMock.compare).toHaveBeenCalledWith(
      "oldpassword",
      "oldpassword"
    );
    expect(userRepositoryMock.updatePassword).toHaveBeenCalledWith({
      id: "1234",
      password: "newhashedpassword",
    });
    expect(result).toEqual(expectedResponse);
  });

  it('should return an error message if old password and retype password do not match', async () => {
    const email = 'test@example.com';
    const input = {
      oldPassword: 'oldpassword',
      retypePassword: 'wrongpassword',
      newPassword: 'newpassword',
    };
    const expectedResponse = {
      error: true,
      message: "Password doesn't match",
    };

    const result = await userService.updatePassword(email, input);

    expect(userRepositoryMock.getUserByEmailOrUsername).not.toHaveBeenCalled();
    expect(hashingMock.compare).not.toHaveBeenCalled();
    expect(userRepositoryMock.updatePassword).not.toHaveBeenCalled();
    expect(result).toEqual(expectedResponse);
  });

  it('should return an error message if old password does not match', async () => {
    const email = 'test@example.com';
    const input = {
      oldPassword: 'wrongpassword',
      retypePassword: 'wrongpassword',
      newPassword: 'newpassword',
    };
    const mockUserData = {
      id: 1,
      email: "test@example.com",
      password: "oldpassword",
    };

    jest
      .spyOn(userRepositoryMock, "getUserByEmailOrUsername")
      .mockResolvedValue(mockUserData);

    jest.spyOn(hashingMock, "compare").mockResolvedValue(false);

    const expectedResponse = {
      error: true,
      message: "Your old Password doesn't match",
    };

    const result = await userService.updatePassword(email, input);

    expect(userRepositoryMock.getUserByEmailOrUsername).toHaveBeenCalledWith({ email });
    expect(hashingMock.compare).toHaveBeenCalledWith(input.oldPassword, mockUserData.password);
    expect(userRepositoryMock.updatePassword).not.toHaveBeenCalled();
    expect(result).toEqual(expectedResponse);
  });

  it('should return an error message if old password and new password are the same', async () => {
    const email = 'test@example.com';
    const input = {
      oldPassword: 'oldpassword',
      retypePassword: 'oldpassword',
      newPassword: 'oldpassword',
    };
    const mockUserData = {
      id: 1,
      email: "test@example.com",
      password: "oldpassword",
    };

    jest
      .spyOn(userRepositoryMock, "getUserByEmailOrUsername")
      .mockResolvedValue(mockUserData);

    jest.spyOn(hashingMock, "compare").mockResolvedValue(true);
    const expectedResponse = {
      error: true,
      message: 'Please use different password with your old password',
    };

    const result = await userService.updatePassword(email, input);

    expect(userRepositoryMock.getUserByEmailOrUsername).toHaveBeenCalledWith({ email });
    expect(hashingMock.compare).toHaveBeenCalledWith('oldpassword', 'oldpassword');
    expect(userRepositoryMock.updatePassword).not.toHaveBeenCalled();
    expect(result).toEqual(expectedResponse);
  });

  it('should return an error message if there is an error during the update process', async () => {
    const email = 'test@example.com';
    const input = {
      oldPassword: 'oldpassword',
      retypePassword: 'oldpassword',
      newPassword: 'newpassword',
    };
    const mockUserData = {
      id: 1,
      email: "test@example.com",
      password: "oldpassword",
    };

    jest
      .spyOn(userRepositoryMock, "getUserByEmailOrUsername")
      .mockResolvedValue(mockUserData);

    jest.spyOn(hashingMock, "compare").mockResolvedValue(true);
    jest.spyOn(hashingMock, "hash").mockResolvedValue('newpassword');
    const expectedResponse = {
      error: true,
      message: new Error('Failed to Update User Profile'),
    };
    const mockError = new Error('Failed to Update User Profile');
    userRepositoryMock.updatePassword.mockRejectedValue(mockError);

    const result = await userService.updatePassword(email, input);

    expect(userRepositoryMock.getUserByEmailOrUsername).toHaveBeenCalledWith({ email });
    expect(hashingMock.compare).toHaveBeenCalledWith(input.oldPassword, mockUserData.password);
    expect(userRepositoryMock.updatePassword).toHaveBeenCalledWith({ id: 1, password: input.newPassword });
    expect(result).toEqual(expectedResponse);
  });
});
