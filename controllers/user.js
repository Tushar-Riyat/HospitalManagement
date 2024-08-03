const {User, Group} = require('../models/user');
const { Op } = require('sequelize');
const {Patients, Doctors, MedicalExamination, Appointments} = require('../DatabaseDesign/models/index');
const emailValidator = require('emailvalid');
const EmailValidation = new emailValidator();
const RESPONSE_CODES = require('../config/constants.js');

async function isEmailValid(email) {
    console.log(email);
    return emailValidator.validate(email);
}

async function handleGetAllUsers(req, res) {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
}

async function userRegistrationPage(req, res) {
    return res.render("home");
}

async function userLoginPage(req, res) {
    return res.render("login");
}

async function userProfilePage(req, res) {
    return res.render('profile');
}

async function handleRegisterUserMongoDB(req, res) {
    const { userName, email, password, confirmPassword, role } = req.body;
    try {
        if (!userName || !email || !password) {
            res.status(RESPONSE_CODES.PRECONDITION_FAILED).json({ msg: 'Please provide all the fields.' });
        } else if (password != confirmPassword) {
            res.status(RESPONSE_CODES.PRECONDITION_FAILED).json({ msg: 'Password and Confirm password must be same.' })
        } else {
            const existingUser = await User.findOne({ userName, email });
            if (existingUser) {
                return res.status(RESPONSE_CODES.BAD_REQUEST).json({ msg: 'Email already exists.' });
            }

            // Create a new user
            const newUser = new User({ userName, email, password, role});
            await newUser.save();
            res.status(RESPONSE_CODES.CREATED).json({ msg: 'User created successfully.', user: newUser });
        }
    } catch (err) {
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ msg: `Internal Server Error with error ${err}.` });
    }
    return res;
}

async function handleRegisterPatient(req, res) {
    const { name, email, password, confirmPassword, gender, appointmentDate, appointmentTime, doctorId } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(RESPONSE_CODES.PRECONDITION_FAILED).json({ msg: 'Please provide all the fields.' });
        } else if (password !== confirmPassword) {
            return res.status(RESPONSE_CODES.PRECONDITION_FAILED).json({ msg: 'Password and Confirm password must be the same.' });
        }

        const existingPatient = await Patients.findOne({ where: { email } });
        if (existingPatient) {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({ msg: 'Email already exists.' });
        }

        // Create a new patient
        const newPatient = await Patients.create({ name, email, password, gender });

        // Schedule an appointment
        const doctor = await Doctors.findByPk(doctorId);
        if (!doctor) {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({ msg: 'Invalid doctor ID.' });
        }

        // Define working hours and appointment duration
        const workingHoursStart = 9;
        const workingHoursEnd = 17;
        const appointmentDuration = 1; // 1 hour

        // Helper function to find the next available slot
        async function findNextAvailableSlot(doctorId, date) {
            for (let hour = workingHoursStart; hour < workingHoursEnd; hour++) {
                const startTime = new Date(date);
                startTime.setHours(hour, 0, 0, 0);

                const endTime = new Date(startTime);
                endTime.setHours(hour + appointmentDuration, 0, 0, 0);

                const appointmentExists = await Appointments.findOne({
                    where: {
                        doctorId,
                        appointmentDate: startTime,
                        appointmentTime: { [Op.between]: [startTime, endTime] },
                    },
                });

                if (!appointmentExists) {
                    return startTime;
                }
            }

            // No slot available, return next day
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            return findNextAvailableSlot(doctorId, nextDay);
        }

        let appointmentSlot;

        if (appointmentDate && appointmentTime) {
            const requestedDate = new Date(appointmentDate);
            const requestedTime = new Date(appointmentTime);

            requestedDate.setHours(requestedTime.getHours(), requestedTime.getMinutes(), 0, 0);

            const startTime = new Date(requestedDate);
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + appointmentDuration);

            const appointmentExists = await Appointments.findOne({
                where: {
                    doctorId,
                    appointmentDate: requestedDate,
                    appointmentTime: { [Op.between]: [startTime, endTime] },
                },
            });

            if (appointmentExists) {
                // Find the closest available slot
                appointmentSlot = await findNextAvailableSlot(doctorId, requestedDate);
            } else {
                appointmentSlot = startTime;
            }
        } else {
            // Find the earliest available slot starting from today
            appointmentSlot = await findNextAvailableSlot(doctorId, new Date());
        }

        // Create the appointment
        const newAppointment = await Appointments.create({
            patients_id: newPatient.id,
            doctors_id: doctorId,
            appointment_date: appointmentSlot,
            appointment_time: appointmentSlot,
        });

        res.status(RESPONSE_CODES.CREATED).json({ 
            msg: 'User created successfully and appointment scheduled.', 
            user: newPatient, 
            appointment: newAppointment 
        });

    } catch (err) {
        console.error(err);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ msg: `Internal Server Error with error ${err}.` });
    }
}

async function handleGetUserById(req, res) {
    try {
        if (!req.body.id) {
            return res.status(RESPONSE_CODES.PRECONDITION_FAILED).json({ msg: 'missing argument(s). Please provide the ID.', err: err });
        }
        const user = await User.findById(req.body.id);
        return res.json({ user });
    } catch (err) {
        return res.status(RESPONSE_CODES.NOT_FOUND).json({ msg: 'User not found.', err: err });
    }
}

async function handleUpdateUserById(req, res) {
    try {
        const user = await User.findByIdAndUpdate(req.body.id, { lastName: "Changed" });
        return res
            .status(RESPONSE_CODES.OK)
            .json({ msg: "User updated successfully", user: user })
    } catch (err) {
        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ err: err });

    }
}

async function handleDeleteUserById(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.body.id);
        if (!user) return res.status(RESPONSE_CODES.NOT_FOUND).json({ msg: 'User wasn\'t found.' });
        return res.json({ msg: "User was removed successfully." })
    } catch (err) {
        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ error: err.error });
    }
}

async function createGroup(req, res) {
    const { name, adminId } = req.body;

    try {
        const admin = await User.findById(adminId);
        if (!admin || (admin.role !== 'doctor' && admin.role !== 'superAdmin')) {
            return res.status(RESPONSE_CODES.FORBIDDEN).json({ message: 'You are not authorized for this action.' });
        }
        const newGroup = new Group({
            name,
            admin: adminId
        });
        await newGroup.save();
        res.status(RESPONSE_CODES.CREATED).json(newGroup);
    } catch (err) {
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

async function addPatientToGroup(req, res) {
    const { groupId, patientId, adminId } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(RESPONSE_CODES.NOT_FOUND).json({ message: 'Group not found.' });
        }

        if (group.admin.toString() !== adminId.toString()) {
            return res.status(RESPONSE_CODES.FORBIDDEN).json({ message: 'You are not authorized for this action.' });
        }

        const patient = await User.findById(patientId);
        if (!patient || patient.role !== 'patient') {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({ message: 'Invalid patient ID.' });
        }

        if (group.patients.includes(patientId)) {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({ message: 'Patient already in the group.' });
        }

        group.patients.push(patientId);
        await group.save();
        res.status(RESPONSE_CODES.OK).json(group);
    } catch (err) {
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

module.exports = {
    handleRegisterPatient,
    userRegistrationPage,
    userLoginPage,
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    createGroup,
    addPatientToGroup,
    userProfilePage
}