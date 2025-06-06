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
addEmailBtn.addEventListener('click', async () => {
    const email = newEmailInput.value.trim();
    if (email && !authorizedEmails.includes(email)) {
        const payload = { email };
        await fetch('https://recorder.fuelmates.com/api/auth/allowed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
        })
        newEmailInput.value = '';
        renderEmailList();
    }
});

// Remove email
async function removeEmail(email) {
    const payload = { email };
    await fetch('https://recorder.fuelmates.com/api/auth/allowed', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    })
    renderEmailList();
}

// Renderizar la lista
async function renderEmailList() {
    await updateEmailsAllowed();
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

async function updateEmailsAllowed() {
    await fetch('https://recorder.fuelmates.com/api/auth/allowed', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    }).then(async res => {
        return await res.json()
    }).then(data => {
        if (data.emailsAllowed) authorizedEmails = data.emailsAllowed;
    }).catch(err => console.error('Error:', err))
}

renderEmailList();

document.getElementById('settings-button').addEventListener('click', () => {
    document.getElementById('modal-overlay').style.display = 'flex';
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal-overlay').style.display = 'none';
});