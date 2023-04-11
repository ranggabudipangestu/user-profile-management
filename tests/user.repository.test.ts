import { Sequelize } from 'sequelize';

// Import your Sequelize model
import { User } from '../src/models/user';

// Import Elasticsearch client
import { Client } from '@elastic/elasticsearch';

// Import your CreateInput type
import { CreateUser } from '../src/domain/dtos/user';
import { UserRepositoryImpl } from '../src/domain/repositories/user';

// Set up mock Sequelize model
console.log("test ini")
const MockUser = User as jest.Mocked<typeof User>;

console.log(MockUser)
// const sequelizeMock = new Sequelize('sqlite::memory:', { logging: false });
// jest.mock('../src/models/user', () => ({
//   User: jest.fn().mockReturnValue(MockUser)
// }));

// // Set up mock Elasticsearch client
// const elasticClientMock = new Client({
//   node: 'http://localhost:9200',
//   auth: {
//     username: 'test',
//     password: 'test',
//   },
// });

// jest.mock('@elastic/elasticsearch', () => ({
//   Client: jest.fn().mockReturnValue(elasticClientMock),
// }));

// const userRepository = new UserRepositoryImpl();
// describe('create', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   // it('should create user and index to Elasticsearch', async () => {
//   //   // Set up input data
//   //   const input: CreateUser = {
//   //     email: 'test@example.com',
//   //     password: 'password123',
//   //     username: 'testuser',
//   //     description: 'Test description',
//   //     fullName: 'Test User',
//   //     phoneNumber: '123456789',
//   //     profileImage: 'testimage.jpg',
//   //   };

//   //   // Set up expected Sequelize result
//   //   const sequelizeResult = {
//   //     dataValues: {
//   //       id: 1,
//   //     },
//   //   };
//   //   MockUser.create.mockResolvedValue(sequelizeResult);

//   //   // Set up Elasticsearch index response
//   //   elasticClientMock.index.mockResolvedValue({
//   //     body: {
//   //       result: 'created',
//   //       _id: '1',
//   //     },
//   //   });

//   //   // Call the function and assert the result
//   //   const result = await create(input);

//   //   expect(result).toBe(true);
//   //   expect(MockUser.create).toHaveBeenCalledWith({
//   //     email: input.email,
//   //     password: input.password,
//   //     username: input.username,
//   //     profileImage: input.profileImage,
//   //   });
//   //   expect(elasticClientMock.index).toHaveBeenCalledWith({
//   //     index: 'users',
//   //     id: '1',
//   //     body: {
//   //       userId: 1,
//   //       fullName: input.fullName,
//   //       description: input.description,
//   //       phoneNumber: input.phoneNumber,
//   //     },
//   //   });
//   // });

//   it('should return false if there is an error', async () => {
//     // Set up input data
//     const input: CreateUser = {
//       email: 'test@example.com',
//       password: 'password123',
//       username: 'testuser',
//       description: 'Test description',
//       fullName: 'Test User',
//       phoneNumber: '123456789',
//       profileImage: 'testimage.jpg',
//     };

//     // Set up expected Sequelize error
//     const sequelizeError = new Error('Error creating user');
//     MockUser.create.mockRejectedValue(sequelizeError);

//     // Call the function and assert the result
//     const result = await userRepository.create(input);

//     expect(result).toBe(false);
//     expect(MockUser.create).toHaveBeenCalledWith({
//       email: input.email,
//       password: input.password,
//       username: input.username,
//       profileImage: input.profileImage,
//     });
//     expect(elasticClientMock.index).not.toHaveBeenCalled();
//   });
// });