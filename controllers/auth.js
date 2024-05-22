const User = require('../models/user');
const RESPONSE_CODES = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

async function authLogin(req, res) {
    try{
        const {userName, password} =   req.body;
        const user =  await User.findOne({userName});
        if (!user){
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({msg: 'There is no user with this username'});
        }
    } catch (err) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({msg: "Something went wrong.", err: err})
    }

}