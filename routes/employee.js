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

router.get('/:id', async (request, response) => {
    try {
        const employee = await Employee.findByPk(request.params.id);
        response.json(employee);
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

    try {
        const employee = await Employee.findByPk(request.params.id);
        await employee.update({ is_fired: 1 });
        response.json(employee);
    } catch (err) {
        console.log(err);
    }
});

router.put('/:id', async (request, response) => {
    try {
        const employee = await Employee.findByPk(request.params.id);
        await employee.update(request.body);
        response.json(employee);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;