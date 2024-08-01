const sequelize = require('../index');
const Patients = require('./patients');
const Doctors = require('./doctors');
const MedicalExamination = require('./medical_examination');
const Appointments = require('./appointments');

Patients.hasMany(Doctors, { foreignKey: 'patients_id' });
Doctors.belongsTo(Patients, { foreignKey: 'patients_id' });

Patients.hasMany(MedicalExamination, { foreignKey: 'patients_id' });
MedicalExamination.belongsTo(Patients, { foreignKey: 'patients_id' });

Doctors.hasMany(MedicalExamination, { foreignKey: 'doctors_id' });
MedicalExamination.belongsTo(Doctors, { foreignKey: 'doctors_id' });

Patients.hasMany(Appointments, { foreignKey: 'patients_id' });
Appointments.belongsTo(Patients, { foreignKey: 'patients_id' });

Doctors.hasMany(Appointments, { foreignKey: 'doctors_id' });
Appointments.belongsTo(Doctors, { foreignKey: 'doctors_id' });

// Define associations here

module.exports = {
  Patients,
  Doctors,
  MedicalExamination,
  Appointments,
  sequelize,
};
