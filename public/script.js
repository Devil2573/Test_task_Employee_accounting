const tableBody = document.getElementById('table-body');
const form = document.getElementById('employee-form');
const cancelEditBtn = document.getElementById('cancel-edit');

const fullNameInput = document.getElementById('full-name');
const birthDateInput = document.getElementById('birth-date');
const passportInput = document.getElementById('passport');
const contactInfoInput = document.getElementById('contact-info');
const addressInput = document.getElementById('address');
const departmentInput = document.getElementById('department');
const positionInput = document.getElementById('position');
const salaryInput = document.getElementById('salary');
const hireDateInput = document.getElementById('hire-date');



function renderTable(employees) {
    tableBody.innerHTML = '';
    console.log(employees)
    employees.forEach(emp => {
        const row = document.createElement('tr');
        if (emp.is_fired === 1) {
            row.classList.add('fired');
        }

        row.innerHTML = `
            <td>${emp.full_name}</td>
            <td>${emp.birth_date}</td>
            <td>${emp.passport}</td>
            <td>${emp.contact_info}</td>
            <td>${emp.address}</td>
            <td>${emp.department}</td>
            <td>${emp.position}</td>
            <td>${emp.salary}</td>
            <td>${emp.hire_date}</td>
            <td>${emp.is_fired ? '<span class="fired-label">Уволен</span>' : 'Работает'}</td>
            <td>
                 <button class="action-btn edit-btn" onclick="editEmployee(${emp.id})" ${emp.is_fired ? 'disabled' : ''}>Редактировать</button>
                <button class="action-btn fire-btn" onclick="fireEmployee(${emp.id})" ${emp.is_fired ? 'disabled' : ''}>Уволить</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


async function loadEmployees() {

    try {
        const response = await fetch('/employee');
        const employees = await response.json();
        renderTable(employees);
    } catch (error) {
        console.log('loadEmployees_error:', error);
    }
}

loadEmployees();

function resetForm() {
    form.reset();
}

cancelEditBtn.addEventListener('click', resetForm);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const employeeData = {
        full_name: fullNameInput.value.trim(),
        birth_date: birthDateInput.value,
        passport: passportInput.value.trim(),
        contact_info: contactInfoInput.value.trim(),
        address: addressInput.value.trim(),
        department: departmentInput.value.trim(),
        position: positionInput.value.trim(),
        salary: salaryInput.value.trim(),
        hire_date: hireDateInput.value
    };

    try {
        const response = await fetch(`/employee`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        resetForm();
        loadEmployees();
    } catch (error) {
        console.error('submit_error:',error)
    }

});


window.fireEmployee = async function(id) {
    if (!confirm('Подтвердить удаление?')) return;

    try {
        const response = await fetch(`/employee/${id}/fire`, {
            method: 'PATCH'
        });
        loadEmployees();
    } catch (error) {
        console.error('fire_error:',error)
    }
};