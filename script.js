'use strict';

let usersData = [];
let currentPage = 1;
const itemsPerPage = 5;
const userListContainer = document.getElementById('userList');
const searchInput = document.getElementById('searchInput');
const paginationContainer = document.getElementById('pagination');
const sortByDateButton = document.getElementById('sortByDate');
const sortByRatingButton = document.getElementById('sortByRating');

function fetchUsers() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            usersData = JSON.parse(xhr.responseText);
            displayUsers(usersData);
            renderPagination();
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.error('Ошибка при загрузке пользователей:', xhr.statusText);
        }
    };
    xhr.open('GET', 'https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users', true);
    xhr.send();
}

function displayUsers(users) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedUsers = users.slice(startIndex, endIndex);

    userListContainer.innerHTML = '';

    displayedUsers.forEach(user => {
        const userRow = document.createElement('tr');
        userRow.innerHTML = `
            <td class="username">${user.username}</td>
            <td class="email">${user.email}</td>
            <td class="registration-date">${formatDate(user.registration_date)}</td>
            <td class="rating">${user.rating}</td>
            <td><button class="delete-button" onclick="confirmDelete('${user.id}')">&#10006;</button></td>
        `;
        userListContainer.appendChild(userRow);
    });
}

function confirmDelete(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        const updatedUsers = usersData.filter(user => user.id !== userId);
        usersData = updatedUsers;
        displayUsers(updatedUsers);
        renderPagination();
    }
}

function clearFilter() {
    searchInput.value = '';
    fetchUsers();
    sortByRatingButton.classList.remove('active');
    sortByDateButton.classList.remove('active');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', options);
}

function handleSearch(event) {
    if (event.keyCode === 13) {
        searchUser();
    }
}

function searchUser() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredUsers = usersData.filter(user => {
        return user.username.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm);
    });
    currentPage = 1;
    displayUsers(filteredUsers);
    renderPagination();
}

function sortByDate() {
    usersData.sort((a, b) => new Date(a.registration_date) - new Date(b.registration_date));
    displayUsers(usersData);
    renderPagination();
    sortByDateButton.classList.add('active');
    sortByRatingButton.classList.remove('active');
}

function sortByRating() {
    usersData.sort((a, b) => b.rating - a.rating);
    displayUsers(usersData);
    renderPagination();
    sortByRatingButton.classList.add('active');
    sortByDateButton.classList.remove('active');
}

function renderPagination() {
    const totalPages = Math.ceil(usersData.length / itemsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('span');
        pageLink.classList.add('page-link');
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.onclick = () => {
            currentPage = i;
            displayUsers(usersData);
            renderPagination();
        };
        paginationContainer.appendChild(pageLink);
    }
}

window.onload = fetchUsers;
