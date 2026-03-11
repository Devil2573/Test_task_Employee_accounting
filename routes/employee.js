const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const employees = await Employee.findAll();
        response.json(employees);
    } catch (err) {
        console.log(err);
    }
});

router.post('/', async (request, response) => {
    try {
        const newEmployee = await Employee.create(request.body);
        response.json(newEmployee);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;