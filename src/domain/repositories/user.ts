import { Op } from "sequelize";
import { User } from "../../models/user";
import { elasticClient } from "../../infrastructure/database/elasticsearch/config";
import { CreateUser } from "../dtos/user";

export interface UserRepository{
  create(input:CreateUser): Promise<any>
  getUserByEmailOrUsername({ email }): Promise<any>
  getUserById({ id }): Promise<any>
  getProfilePicture({ id }): Promise<any>
  updateUser({ id, fullName, description, phoneNumber, profileImage }): Promise<any>
  updatePassword({ id, password }): Promise<any>
}

export class UserRepositoryImpl implements UserRepository {
  async create(input:CreateUser): Promise<any> {
    const {email, password, username, description, fullName, phoneNumber, profileImage} = input
    try{
      const result = await User.create({
        profileImage,
        email,
        username,
        password,
      });

      await elasticClient.index({
        index: 'users',
        id: result.dataValues.id.toString(),
        body: {
          userId: result.dataValues.id,
          fullName,
          description,
          phoneNumber,

        }
      })
      await elasticClient.indices.refresh({index: 'users'})
      return true
    }catch(error){
      console.log(error)
      return false
    }
  }

  async getUserByEmailOrUsername({ email }): Promise<any> {
    const getData = await User.findOne({
      where:{
        [Op.or]: [
          { email },
          { username: email }
        ]
      },
      attributes: ['id', 'username', 'email', 'password']
    })

    return getData
  }

  async getUserById({ id }): Promise<any> {
    try{
      const getData = await elasticClient.search({
        index: 'users',
        query: {
          match : {
            userId: id
          }
        }
      })
  
      return getData.hits.hits
    }catch(error){
      throw new Error(error)
    }
  }

  async getProfilePicture({ id }): Promise<any> {
    const getData = await User.findOne({
      where:{
        id
      },
      attributes:['profileImage']
    })

    return getData.dataValues.profileImage
  }

  async updateUser({ id, fullName, description, phoneNumber, profileImage }): Promise<any> {
    await elasticClient.updateByQuery({
      index: 'users',
      query:{
        match: {
          userId: id
        }
      },
      body: {
        script: {
          source: `
          ctx._source.fullName = '${fullName}'; 
          ctx._source.description = '${description}'; 
          ctx._source.phoneNumber = '${phoneNumber}';`
        }
      }
    })

    const updateData = await User.update({
      profileImage
    },{
      where:{
        id
      }
    })

    return updateData
  }

  async updatePassword({ id, password }): Promise<any> {
    return await User.update(
      {
        password
      },
      {
        where:{ id },
      },
    )
  }
}