const User = require('../models/user');
const RESPONSE_CODES = require('../config/constants.js')


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
    const user = await User.findById(req.params.id);
    res.json({ user });
}

async function handleUpdateUserById(req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" });
    return res
        .status(RESPONSE_CODES.OK)
        .json({ msg: "User updated successfully", user: user })
}

async function handleDeleteUserById(req, res) {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(RESPONSE_CODES.OK).json({ user: user });
}


module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
}