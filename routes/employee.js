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

router.patch('/:id/fire', async (request, response) => {
    const id = request.params.id;

    try {
        const employee = await Employee.findByPk(id);
        await employee.update({ is_fired: 1 });
        response.json(employee);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;