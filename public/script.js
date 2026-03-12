const tableBody = document.getElementById('table-body');
const form = document.getElementById('employee-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit');

const employeeIdInput = document.getElementById('employee-id');
const fullNameInput = document.getElementById('full-name');
const birthDateInput = document.getElementById('birth-date');
const passportInput = document.getElementById('passport');
const contactInfoInput = document.getElementById('contact-info');
const addressInput = document.getElementById('address');
const departmentInput = document.getElementById('department');
const positionInput = document.getElementById('position');
const salaryInput = document.getElementById('salary');
const hireDateInput = document.getElementById('hire-date');

const filterDepartment = document.getElementById('filter-department');
const filterPosition = document.getElementById('filter-position');
const searchInput = document.getElementById('search-input');

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
setDefaultContact();
function setDefaultContact(){
    contactInfoInput.value = '+7 ('
}

function resetForm() {
    formTitle.textContent = 'Добавить сотрудника';
    submitBtn.textContent = 'Сохранить';
    form.reset();
    setDefaultContact();
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

    const id = employeeIdInput.value;

    if(!id){
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
    }else{
        try {
            const response = await fetch(`/employee/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData)
            });
            resetForm();
            loadEmployees();

        } catch (error) {
            console.error('submit_error:',error)
        }
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

window.editEmployee = async function(id) {
    try {
        const response = await fetch(`/employee/${id}`);
        const emp = await response.json();
        if (!emp) return;

        employeeIdInput.value = emp.id;
        fullNameInput.value = emp.full_name;
        birthDateInput.value = emp.birth_date;
        passportInput.value = emp.passport;
        contactInfoInput.value = emp.contact_info;
        contactInfoInput.dispatchEvent(new Event("input"))
        addressInput.value = emp.address;
        departmentInput.value = emp.department;
        positionInput.value = emp.position;
        salaryInput.value = emp.salary;
        hireDateInput.value = emp.hire_date;

        formTitle.textContent = 'Редактировать сотрудника';
        submitBtn.textContent = 'Обновить';
    } catch (error) {
        console.error('edit_error:', error);
    }
};

async function FilterEmployees() {
    try {
        const response = await fetch('/employee');
        const employees = await response.json();
        
        let filtered = employees;

        const deptFilter = filterDepartment.value.trim().toLowerCase();
        const posFilter = filterPosition.value.trim().toLowerCase();
        const searchQuery = searchInput.value.trim().toLowerCase();

        if (deptFilter) {
            filtered = filtered.filter(emp => 
                emp.department.toLowerCase().includes(deptFilter)
            );
        }
        if (posFilter) {
            filtered = filtered.filter(emp => 
                emp.position.toLowerCase().includes(posFilter)
            );
        }
        if (searchQuery) {
            filtered = filtered.filter(emp => 
                emp.full_name.toLowerCase().includes(searchQuery)
            );
        }

        renderTable(filtered);
    } catch (error) {
        console.error('filter_error:', error);
    }
}

filterDepartment.addEventListener('input', FilterEmployees);
filterPosition.addEventListener('input', FilterEmployees);
searchInput.addEventListener('input', FilterEmployees);

passportInput.addEventListener('input', function() {
    let val = this.value.replace(/\D/g, '');
    if (val.length > 4) {
        val = val.substring(0, 4) + ' ' + val.substring(4, 10);
    }
    this.value = val;
});

contactInfoInput.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    let formatted = '';

    if (value.length > 0) {
        if (value[0] === '7' || value[0] === '8') {
            formatted = '+7';
            value = value.substring(1);
        } else {
            formatted = '+7';
        }


        formatted += ' (' + value.substring(0, 3);
        if (value.length >= 4) {
            formatted += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formatted += '-' + value.substring(6, 8);
        }
        if (value.length >= 9) {
            formatted += '-' + value.substring(8, 10);
        }
        
    }
    this.value = formatted;
});