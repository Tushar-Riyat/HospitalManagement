const express = require('express');
const RESPONSE_CODES = require('../config/constants.js');
const {handleGetAllUsers, 
    handleGetUserById, 
    handleUpdateUserById, 
    handleDeleteUserById} = require('../controllers/user.js');
const User = require('../models/user');
const router = express.Router();

router
.get('/api/usersList', handleGetAllUsers(req, res));

router
    .route('/:id')
    .get(handleGetUserById)
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById);

router.post('/api/userRegisteration', );