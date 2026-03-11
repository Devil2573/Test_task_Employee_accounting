const express = require('express');
const path = require('path');
const sequelize = require('./config/database'); 
const employeeRoutes = require('./routes/employee');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/employee', employeeRoutes);

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Сервер запущен на http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Ошибка синхронизации БД:', err);
    });