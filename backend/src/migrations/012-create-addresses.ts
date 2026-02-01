import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('addresses', {
      address_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      address_type: {
        type: DataTypes.ENUM('shipping', 'billing', 'both'),
        allowNull: false,
      },
      recipient_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      alternate_phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      address_line1: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      address_line2: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      landmark: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'India',
      },
      postal_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex('addresses', ['user_id']);
    await queryInterface.addIndex('addresses', ['is_default']);
    await queryInterface.addIndex('addresses', ['address_type']);
    await queryInterface.addIndex('addresses', ['is_deleted']);
    await queryInterface.addIndex('addresses', ['created_at']);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('addresses');
  },
};
