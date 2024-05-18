const User = require('../models/user');
const emailValidator = require('emailvalid');
const EmailValidation = new emailValidator();
const RESPONSE_CODES = require('../config/constants.js');

async function isEmailValid(email) {
    console.log(email);
    return emailValidator.validate(email);
}

async function handleGetAllUsers(req, res) {
    const allDbUsers = await User.find({});
    res.json(allDbUsers);
}

async function handleRegisterUser(req, res) {
    const { firstName, email, gender } = req.body;
    const emailCheck = EmailValidation.check(email);
    try {
        if (!firstName || !email || !gender) {
            res.status(RESPONSE_CODES.PRECONDITION_FAILED).json({ msg: 'Please provide all the fields.' });
        } else if (!emailCheck.valid) {
            res.status(RESPONSE_CODES.PRECONDITION_FAILED).json({ msg: `Please enter a valid email.` });
        } else {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(RESPONSE_CODES.BAD_REQUEST).json({ msg: 'Email already exists.' });
            }

            // Create a new user
            const newUser = new User({ firstName, email, gender });
            await newUser.save();
            res.status(RESPONSE_CODES.CREATED).json({ msg: 'User created successfully.', user: newUser });
        }
    } catch (err) {
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ msg: `Internal Server Error with error ${err}.` });
    }
    return res;
}

async function handleGetUserById(req, res) {
    try{
        if(!req.body.id){
        return res.status(RESPONSE_CODES.PRECONDITION_FAILED).json({msg : 'missing argument(s). Please provide the ID.', err : err});
        }
        const user = await User.findById(req.body.id);
        return res.json({user});
    } catch (err) {
        return res.status(RESPONSE_CODES.NOT_FOUND).json({msg : 'User not found.', err : err});
    }
}

async function handleUpdateUserById(req, res) {
    try{
        const user = await User.findByIdAndUpdate(req.body.id, { lastName: "Changed" });
        return res
        .status(RESPONSE_CODES.OK)
        .json({ msg: "User updated successfully", user: user })
    } catch (err) {
        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({err : err});

    }
}

async function handleDeleteUserById(req, res) {
    try{
        const user = await User.findByIdAndDelete(req.body.id);
        if (!user) return res.status(RESPONSE_CODES.NOT_FOUND).json({ msg: 'User wasn\'t found.' });
        return res.json({msg : "User was removed successfully."})
    } catch (err) {
        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({error : err.error});
    }
}


module.exports = {
    handleRegisterUser,
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
}