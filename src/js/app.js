fetch('https://api.npoint.io/ec21414b0e15972dbfde/data')
    .then((res) => res.json())
    .then((data) => {
        renderCustomerTableRows(data)
    });

function calculateTotalMontlyPay(loans) {
    const total = loans.reduce(function (sum, currentElement) {
        if (!currentElement.closed) {
            return sum + currentElement.perMonth.value;
        }
        return sum;
    }, 0);

    return total;
}

function renderCustomerTableRows(customers) {
    const tableBody = document.getElementById('customer-table-body');

    for (var i = 0; i < customers.length; i++) {
        const customer = customers[i];
        const tr = document.createElement('tr');

        tr.setAttribute('data-bs-toggle', 'modal');
        tr.setAttribute('data-bs-target', '#staticBackdrop');
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
        const hasActiveLoan = customer.hasLoanHistory && customer.loans.some((loan) => !loan.closed);
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

function renderLoansTableRows(loans) {
    const tableBody = document.getElementById('loans-table-body');

}