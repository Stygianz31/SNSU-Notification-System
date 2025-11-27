import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/config';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  profilePicture?: string;
  onlineStatus: boolean;
  lastActive: Date;
  department?: string;
  course?: string;
  yearLevel?: number;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'profilePicture' | 'onlineStatus' | 'lastActive' | 'department' | 'course' | 'yearLevel'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public phone!: string;
  public password!: string;
  public role!: 'admin' | 'teacher' | 'student';
  public profilePicture?: string;
  public onlineStatus!: boolean;
  public lastActive!: Date;
  public department?: string;
  public course?: string;
  public yearLevel?: number;
  public bio?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public toJSON(): any {
    const values: any = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(13),
      allowNull: false,
      validate: {
        is: /^\+639\d{9}$/
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'teacher', 'student'),
      allowNull: false,
      defaultValue: 'student'
    },
    profilePicture: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    onlineStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    course: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    yearLevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

export default User;
