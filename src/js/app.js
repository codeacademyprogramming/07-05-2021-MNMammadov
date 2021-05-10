// Reference to bootstrap's modal.
const loansModal = new bootstrap.Modal(document.getElementById('loansModal'));


// https://stackoverflow.com/questions/58128248/how-can-i-resolve-the-error-url-scheme-must-be-http-or-https-for-cors-reque
fetch('./data/customers.json')
    .then((res) => res.json())
    .then((json) => {
        data = json;
        renderCustomerTable(data);
    });

const selectOption = document.getElementById('loan-status-filter');

// Filter by loans status.
selectOption.addEventListener('change', function (event) {
    if (event.target.value === "all") {
        renderCustomerTable(data);
    } else if (event.target.value === "active") {
        const loanActiveCustomers = data.filter(function (element) {
            return loanActiveStatus(element);
        });

        renderCustomerTable(loanActiveCustomers);
    } else {
        const loanNonActiveCustomers = data.filter(function (element) {
            return !loanActiveStatus(element);
        });

        renderCustomerTable(loanNonActiveCustomers);
    }
});


const searchInputCustomer = document.getElementById('search-customer');

searchInputCustomer.addEventListener('keyup', function (event) {
    const searchValue = event.target.value.toLowerCase();
    const searchingCustomers = data.filter(function (element) {
        const fullName = element.name + ' ' + element.surname;
        return fullName.toLowerCase().includes(searchValue);
    });

    renderCustomerTable(searchingCustomers);

});

// Calculate customer's monthly pay.
function calculateTotalMontlyPay(loans) {
    const total = loans.reduce(function (sum, currentElement) {
        if (!currentElement.closed) {
            return sum + currentElement.perMonth.value;
        }
        return sum;
    }, 0);

    return total;
}

function loanActiveStatus(customer) {
    return customer.hasLoanHistory && customer.loans.some((loan) => !loan.closed);
}

function renderCustomerTable(customers) {
    const tableBody = document.getElementById('customer-table-body');

    tableBody.innerHTML = '';

    for (var i = 0; i < customers.length; i++) {
        const customer = customers[i];
        const tr = document.createElement('tr');

        tr.addEventListener('click', function () {
            renderLoansTable(customer.loans);
            loansModal.show();
        });

        tr.setAttribute('class', 'cursor-p');

        const td1 = document.createElement('td');
        td1.innerText = i + 1;
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.innerText = customer.name + ' ' + customer.surname;
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        const image = document.createElement('img');
        image.setAttribute('class', 'card-img-top');
        image.setAttribute('alt', 'Profile photo');
        image.src = customer.img
        td3.appendChild(image);
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        td4.innerText = customer.salary.value + ' ' + customer.salary.currency;
        tr.appendChild(td4);

        const td5 = document.createElement('td');
        const hasActiveLoan = loanActiveStatus(customer);
        td5.innerText = hasActiveLoan ? 'Yes' : 'No';
        tr.appendChild(td5);

        const td6 = document.createElement('td');
        let totalMonthlyPay = 0;
        if (!hasActiveLoan) {
            td6.innerText = '-';
        } else {
            totalMonthlyPay = calculateTotalMontlyPay(customer.loans);

            td6.innerText = totalMonthlyPay + ' ' + 'AZN';
        }
        tr.appendChild(td6);

        const td7 = document.createElement('td');
        const maxMonthlyPay = customer.salary.value * 0.45;
        td7.innerText = totalMonthlyPay < maxMonthlyPay ? "Yes" : "No";
        tr.appendChild(td7);

        tableBody.appendChild(tr);
    };
}

function renderLoansTable(loans) {
    const tableBody = document.getElementById('loans-table-body');

    // Empty table body
    tableBody.innerHTML = '';

    loans.forEach((loan, i) => {
        const tr = document.createElement('tr');

        const td1 = document.createElement('td');
        td1.innerText = i + 1;
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.innerText = loan.loaner;
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.innerText = loan.amount.value + ' ' + loan.amount.currency;
        tr.appendChild(td3);

        const td4 = document.createElement('td');
        td4.innerText = loan.closed ? "No" : "Yes";
        tr.appendChild(td4);

        const td5 = document.createElement('td');
        if (loan.perMonth) {
            td5.innerText = loan.perMonth.value + " " + loan.perMonth.currency;
        } else {
            td5.innerText = '-';
        }
        tr.appendChild(td5);

        const td6 = document.createElement('td');
        td6.innerText = loan.dueAmount.value + " " + loan.dueAmount.currency;
        tr.appendChild(td6);

        const td7 = document.createElement('td');
        td7.innerText = loan.loanPeriod.start + "-" + loan.loanPeriod.end;
        tr.appendChild(td7);

        tableBody.appendChild(tr);
    });
}