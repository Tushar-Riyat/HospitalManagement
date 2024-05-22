const express = require('express');
const router = express.Router();
const {
    handleGetAllUsers,
    handleGetUserById,
    handleRegisterUser,
    handleUpdateUserById,
    handleDeleteUserById,
    userRegistrationPage
} = require('../controllers/user');

const {authLogin, authForgotPassword} = require('../controllers/auth');

// Define routes
router.get('/list', handleGetAllUsers);
router.get('/registerPage', userRegistrationPage);
router.get('/:id', handleGetUserById);
router.route('/')
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById);
router.post('/register', handleRegisterUser);

module.exports = router;
