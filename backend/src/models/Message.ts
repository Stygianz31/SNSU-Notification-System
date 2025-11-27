import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/config';
import User from './User';

export interface MessageAttributes {
  id: number;
  content: string;
  senderId: number;
  recipientId?: number;
  isBroadcast: boolean;
  readStatus: boolean;
  readTimestamp?: Date;
  attachmentPath?: string;
  attachmentType?: string;
  deletedFor?: string;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'recipientId' | 'isBroadcast' | 'readStatus' | 'readTimestamp' | 'attachmentPath' | 'attachmentType' | 'deletedFor' | 'timestamp'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public content!: string;
  public senderId!: number;
  public recipientId?: number;
  public isBroadcast!: boolean;
  public readStatus!: boolean;
  public readTimestamp?: Date;
  public attachmentPath?: string;
  public attachmentType?: string;
  public deletedFor?: string;
  public timestamp!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    isBroadcast: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    readStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    readTimestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attachmentPath: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    attachmentType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    deletedFor: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true
  }
);

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient', onDelete: 'CASCADE' });

export default Message;
