const modal = document.getElementById('modal-overlay');
const closeModal = document.getElementById('close-modal');
const settingsBtn = document.getElementById('settings-button');
const logoutBtn = document.getElementById('logout-button');

const emailList = document.getElementById('authorized-emails');
const newEmailInput = document.getElementById('new-email');
const addEmailBtn = document.getElementById('add-email');

let authorizedEmails = [];

// Mostrar modal
settingsBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    renderEmailList();
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Logout
logoutBtn.addEventListener('click', async () => {
    await fetch('https://recorder.fuelmates.com/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    window.location.href = '/';
});

// Add email
addEmailBtn.addEventListener('click', () => {
    const email = newEmailInput.value.trim();
    if (email && !authorizedEmails.includes(email)) {
        authorizedEmails.push(email);
        newEmailInput.value = '';
        renderEmailList();
    }
});

// Remove email
function removeEmail(email) {
    authorizedEmails = authorizedEmails.filter(e => e !== email);
    renderEmailList();
}

// Renderizar la lista
function renderEmailList() {
    emailList.innerHTML = '';
    authorizedEmails.forEach(email => {
        const li = document.createElement('li');
        li.textContent = email;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Eliminar';
        removeBtn.onclick = () => removeEmail(email);

        li.appendChild(removeBtn);
        emailList.appendChild(li);
    });
}



document.getElementById('settings-button').addEventListener('click', () => {
    document.getElementById('modal-overlay').style.display = 'flex';
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal-overlay').style.display = 'none';
});