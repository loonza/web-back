document.addEventListener('DOMContentLoaded', function () {
    const apiContainer = document.getElementById('api-content');
    const preloader = document.getElementById('preloader');
    const paginationContainer = document.getElementById('pagination');
    const reviewsPerPage = 5;
    let allReviews = [];
    let currentPage = 1;

    function fetchReviews() {
        return new Promise((resolve, reject) => {
            preloader.classList.remove('hidden');
            const random = Math.random();
            const filter = random > 0.5 ? '?id_gte=100' : '?id_lte=200';

            fetch(`https://jsonplaceholder.typicode.com/comments${filter}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network Error');
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }

    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';

        const createButton = (text, page, isDisabled = false, isEllipsis = false) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.disabled = isDisabled;
            button.className = isEllipsis ? 'pagination-ellipsis' : 'pagination-button';
            if (page === currentPage) button.classList.add('active');

            if (!isDisabled && !isEllipsis) {
                button.addEventListener('click', () => {
                    currentPage = page;
                    renderReviews();
                    renderPagination(totalPages);
                });
            }
            return button;
        };

        paginationContainer.appendChild(createButton('<<', 1, currentPage === 1));
        paginationContainer.appendChild(createButton('<', currentPage - 1, currentPage === 1));

        const maxVisiblePages = 5;
        const halfRange = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(currentPage - halfRange, 1);
        let endPage = Math.min(currentPage + halfRange, totalPages);

        if (currentPage <= halfRange) {
            endPage = Math.min(maxVisiblePages, totalPages);
        }
        if (currentPage > totalPages - halfRange) {
            startPage = Math.max(totalPages - maxVisiblePages + 1, 1);
        }

        if (startPage > 1) {
            paginationContainer.appendChild(createButton('1', 1));
            if (startPage > 2) {
                paginationContainer.appendChild(createButton('...', null, true, true));
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(createButton(i, i));
        }


        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationContainer.appendChild(createButton('...', null, true, true));
            }
            paginationContainer.appendChild(createButton(totalPages, totalPages));
        }

        paginationContainer.appendChild(createButton('>', currentPage + 1, currentPage === totalPages));
        paginationContainer.appendChild(createButton('>>', totalPages, currentPage === totalPages));
    }

    function renderReviews() {
        apiContainer.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('tariff-table');

        const headerRow = document.createElement('tr');
        ['Автор', 'Email', 'Отзыв'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        const startIndex = (currentPage - 1) * reviewsPerPage;
        const endIndex = startIndex + reviewsPerPage;
        const reviewsToDisplay = allReviews.slice(startIndex, endIndex);

        reviewsToDisplay.forEach(item => {
            const row = document.createElement('tr');
            const authorCell = document.createElement('td');
            const emailCell = document.createElement('td');
            const bodyCell = document.createElement('td');

            authorCell.textContent = item.name;
            emailCell.textContent = item.email;
            bodyCell.textContent = item.body;

            row.appendChild(authorCell);
            row.appendChild(emailCell);
            row.appendChild(bodyCell);

            table.appendChild(row);
        });

        apiContainer.appendChild(table);
    }

    fetchReviews()
        .then(data => {
            preloader.classList.add('hidden');
            allReviews = data;

            const totalPages = Math.ceil(allReviews.length / reviewsPerPage);
            renderPagination(totalPages);
            renderReviews();
        })
        .catch(error => {
            preloader.classList.add('hidden');
            apiContainer.innerHTML = `<div id="error-message">⚠ Что-то пошло не так. Попробуйте ещё раз позже.</div>`;
            console.error(error);
        });
});
