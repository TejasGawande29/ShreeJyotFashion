/**
 * WishlistItem Model
 * Represents items in user's wishlist
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WishlistItemAttributes {
  id: number;
  user_id: number;
  product_id: number;
  added_at: Date;
}

interface WishlistItemCreationAttributes extends Optional<WishlistItemAttributes, 'id' | 'added_at'> {}

class WishlistItem extends Model<WishlistItemAttributes, WishlistItemCreationAttributes> implements WishlistItemAttributes {
  public id!: number;
  public user_id!: number;
  public product_id!: number;
  public added_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
}

WishlistItem.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'wishlist_items',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id'],
      },
      {
        fields: ['user_id'],
      },
    ],
  }
);

export default WishlistItem;
