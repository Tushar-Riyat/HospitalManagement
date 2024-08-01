'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('appointments', {
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
              appointment_date: {
                type: DataTypes.DATE,
                allowNull: false,
              },
              appointment_time: {
                type: DataTypes.TIME,
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
        await queryInterface.dropTable('appointments');
    },
};
