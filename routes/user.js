const express = require('express');
const router = express.Router();
const {handleGetAllUsers,
    handleGetUserById,
    handleRegisterUser,
    handleUpdateUserById,
    handleDeleteUserById} = require('../controllers/user.js');
const User = require('../models/user');

router
.get('/list', handleGetAllUsers);

router.get('/:id',handleGetUserById);
router.route('/').patch(handleUpdateUserById)
    .delete(handleDeleteUserById);

router.post('/register', handleRegisterUser);

module.exports = router;