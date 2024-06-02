const express = require('express');
const router = express.Router();
const {
    handleGetAllUsers,
    handleGetUserById,
    handleRegisterUser,
    handleUpdateUserById,
    handleDeleteUserById,
    userRegistrationPage,
    userLoginPage
} = require('../controllers/user');

const {authLogin, authForgotPassword} = require('../controllers/auth');

// Define routes
router.get('/list', handleGetAllUsers)
    .get('/registerPage', userRegistrationPage)
    .get('/loginPage', userLoginPage);
router.route('/')
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById);
router.post('/register', handleRegisterUser);
router.post('/login', authLogin);
router.post('/id', handleGetUserById);
router.post('/forgotpassword', authForgotPassword);

module.exports = router;
