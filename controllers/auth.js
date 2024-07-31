const User = require('../models/user');
const {setUser} = require('../services/auth');
const RESPONSE_CODES = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

async function authLogin(req, res) {
    try{
        const {userName, password} =   req.body;
        const user =  await User.findOne({userName});
        if (!user){
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({msg: 'There is no user with this username.'});
        }
        const isCorrectPassword = await user.comparePassword(password);
        if(!isCorrectPassword){
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({msg: 'Incorrect Password.'});
        }
        const sessionID = uuidv4();
        setUser(sessionID, user);
        res.cookie('uid', sessionID);
        return res.status(RESPONSE_CODES.OK).json({msg: 'Login Successful.', redirectURL:'/api/user/profilePage'});
    } catch (err) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({msg: "Something went wrong.", err: err})
    }   
}

async function authForgotPassword(req, res){
    //Yet to be implemented
    return res.status(RESPONSE_CODES.NOT_IMPLEMENTED).json({msg: 'Not yet implemented.'})
}

module.exports = {
    authLogin,
    authForgotPassword
}