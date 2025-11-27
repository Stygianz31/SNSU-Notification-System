import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/config';
import User from './User';

export interface ClassAttributes {
  id: number;
  className: string;
  subject: string;
  description?: string;
  teacherId: number;
  schedule: string;
  room?: string;
  semester: string;
  academicYear: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClassCreationAttributes extends Optional<ClassAttributes, 'id' | 'description' | 'room' | 'isActive'> {}

class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  public id!: number;
  public className!: string;
  public subject!: string;
  public description?: string;
  public teacherId!: number;
  public schedule!: string;
  public room?: string;
  public semester!: string;
  public academicYear!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Class.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    className: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    schedule: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    room: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    semester: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    academicYear: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'classes',
    timestamps: true
  }
);

Class.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher', onDelete: 'CASCADE' });

export default Class;
