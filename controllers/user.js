const {User, Group} = require('../models/user');
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

async function handleRegisterUser(req, res) {
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
    handleRegisterUser,
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