const express = require('express');
const router = express.Router();
const {
    handleGetAllUsers,
    handleGetUserById,
    handleRegisterUser,
    handleUpdateUserById,
    handleDeleteUserById,
    userRegistrationPage,
    userLoginPage,
    userProfilePage,
    createGroup,
    addPatientToGroup
} = require('../controllers/user');

const { authLogin, authForgotPassword } = require('../controllers/auth');

// Define routes
router.get('/list', handleGetAllUsers)
    .get('/registerPage', userRegistrationPage)
    .get('/loginPage', userLoginPage)
    .get('/profilePage', userProfilePage);
router.route('/')
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById);
router.post('/register', handleRegisterUser)
    .post('/login', authLogin)
    .post('/id', handleGetUserById)
    .post('/forgotpassword', authForgotPassword)
    .post('/createGroup', createGroup)
    .post('/addPatientToGroup', addPatientToGroup);

module.exports = router;
