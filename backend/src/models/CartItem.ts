/**
 * CartItem Model
 * Represents items in user's shopping cart
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CartItemAttributes {
  id: number;
  user_id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  added_at: Date;
  updated_at: Date;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id' | 'variant_id' | 'added_at' | 'updated_at'> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
  public id!: number;
  public user_id!: number;
  public product_id!: number;
  public variant_id!: number | null;
  public quantity!: number;
  public added_at!: Date;
  public updated_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
}

CartItem.init(
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
    variant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'product_variants',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'cart_items',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id', 'variant_id'],
      },
      {
        fields: ['user_id'],
      },
    ],
  }
);

export default CartItem;
