const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const Patients = require('./patients'); // Import the Patient model
const Doctors = require('./doctors'); // Impoprt the Doctors model

const Appointments = sequelize.define('appointments', {
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
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Appointments;
