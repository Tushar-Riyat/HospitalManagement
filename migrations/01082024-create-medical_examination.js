'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('medical_examination', {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
              },
              patients_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                  model: Patients,
                  key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
              },
              doctors_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                  model: Doctors,
                  key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
              },
              medical_examination: {
                type: DataTypes.LONGTEXT,
                allowNull: false,
              },
              created_at: {
                type: DataTypes.TIMESTAMP,
                allowNull: false,
                defaultValue: DataTypes.NOW,
              },
              updated_at: {
                type: DataTypes.TIMESTAMP,
                allowNull: false,
                defaultValue: DataTypes.NOW,
              },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('medical_examination');
    },
};
