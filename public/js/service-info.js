document.getElementById('service-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const serviceName = document.getElementById('service-name').value.trim();
    const rentalPeriod = document.getElementById('rental-period').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!serviceName || !rentalPeriod || !description) {
        alert('Пожалуйста, заполните все поля. Поля не могут быть пустыми или содержать только пробелы.');
        return;
    }

    if (!/^\d{11}$/.test(phoneNumber)) {
        alert('Номер телефона должен содержать ровно 11 цифр.');
        return;
    }

    const template = document.getElementById('row-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.service-name').textContent = serviceName;
    clone.querySelector('.rental-period').textContent = rentalPeriod;
    clone.querySelector('.phone-number').textContent = phoneNumber;
    clone.querySelector('.description').textContent = description;

    const deleteButton = clone.querySelector('.delete-row');
    deleteButton.addEventListener('click', function () {
        this.closest('tr').remove();
        saveToLocalStorage();
        notifyChange();
    });

    document.querySelector('.service-form tbody').appendChild(clone);

    saveToLocalStorage();
    notifyChange();
});

document.getElementById('save-params').addEventListener('click', function () {
    saveToLocalStorage();
    notifyChange();
    alert('Параметры сохранены!');
});

document.getElementById('load-params').addEventListener('click', function () {
    loadFromLocalStorage();
});

function saveToLocalStorage() {
    const rows = document.querySelectorAll('.service-form tbody tr');
    const data = Array.from(rows).map(row => ({
        serviceName: row.querySelector('.service-name').textContent,
        rentalPeriod: row.querySelector('.rental-period').textContent,
        phoneNumber: row.querySelector('.phone-number').textContent,
        description: row.querySelector('.description').textContent,
    }));

    localStorage.setItem('serviceParams', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const params = JSON.parse(localStorage.getItem('serviceParams'));
    if (params && params.length > 0) {
        const tableBody = document.querySelector('.service-form tbody');
        tableBody.innerHTML = '';

        const template = document.getElementById('row-template');

        params.forEach(rowData => {
            const clone = template.content.cloneNode(true);

            clone.querySelector('.service-name').textContent = rowData.serviceName;
            clone.querySelector('.rental-period').textContent = rowData.rentalPeriod;
            clone.querySelector('.phone-number').textContent = rowData.phoneNumber;
            clone.querySelector('.description').textContent = rowData.description;

            const deleteButton = clone.querySelector('.delete-row');
            deleteButton.addEventListener('click', function () {
                this.closest('tr').remove();
                saveToLocalStorage();
                notifyChange();
            });

            tableBody.appendChild(clone);
        });
    }
}


window.addEventListener('storage', function (event) {
    if (event.key === 'serviceParams') {
        loadFromLocalStorage();
    }
});


function notifyChange() {
    localStorage.setItem('lastUpdate', Date.now());
}


document.addEventListener('DOMContentLoaded', function () {
    loadFromLocalStorage();
});
