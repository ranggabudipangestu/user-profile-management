import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../infrastructure/database/sql/sequelize';

interface IUser {
  id: number;
	fullName: string;
	description: string;
	phoneNumber: string;
  email: string;
  username: string;
  password: string;
	profileImage: Blob;
  
}

export class User extends Model<IUser, Omit<IUser, 'id'>> {
  declare id: number;
	declare fullName: string;
	declare description: string;
	declare phoneNumber: string;
  declare email: string;
  declare username: string;
  declare password: string;
	declare profileImage: Blob;
}

User.init({
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true,
    autoIncrement: true
  }, 
	fullName: {
    type: DataTypes.STRING,
    allowNull: true
  },
	description: {
    type: DataTypes.STRING,
    allowNull: true
  },
	phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
	profileImage: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'users'
})