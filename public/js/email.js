var EMAILS = [];
var USERNAME = '';

function writeEmailDiv(email) {
    const chatList = document.getElementById('email-list');
    const div = document.createElement('div');
    div.className = 'chat-item';
    div.id = email.id
    div.innerHTML = `
        <div class="chat-item-header">
            <span class="chat-item-title">${email.subject || 'Sin asunto'}</span>
        </div>        
    `;

    div.addEventListener('click', async () => {
        try {
            const response = await fetch('https://api.fuelmates.com/api/decompress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: email.compressed
            });

            if (!response.ok) {
                throw new Error('Fallo al descomprimir');
            }

            const decompressed = await response.json();

            document.getElementById('email-content').innerHTML = `${decompressed.compressed}`;
        } catch (error) {
            console.error('Error al descomprimir:', error);
        }
    });

    chatList.appendChild(div);
}


async function onClickSendMessage() {
    const input = document.getElementById('textarea-message');
    const emailContent = input.value.trim();

    if (!emailContent) return;

    addMessage(input.value, 'user');
    input.value = '';

    try {
        const response = await fetch('https://recorder.fuelmates.com/api/talk/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ message: emailContent })
        });

        if (!response.ok) {
            throw new Error('Error al enviar el correo');
        }

        const data = await response.json();
        const idEmailResponse = data.result[0].payload.emailId;

        const divEmail = document.getElementById(idEmailResponse);
        divEmail.click()

        addMessage(data.answer, 'bot');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

function addMessage(text, from = 'user') {
    const messagesContainer = document.getElementById('chat-content'); // importante usar el contenedor de mensajes

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', from); // clase: 'message user' o 'message bot'
    messageDiv.textContent = text;

    messagesContainer.appendChild(messageDiv);

    // Scroll automático al último mensaje
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

document.addEventListener('DOMContentLoaded', async () => {
    const sendButton = document.getElementById('send-button');
    sendButton.addEventListener('click', onClickSendMessage)

    const textarea = document.getElementById('textarea-message');
    textarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onClickSendMessage();
        }
    });

    fetch('https://recorder.fuelmates.com/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    }).then(res => {
        return res.json()
    }).then(data => {
        USERNAME = data.username || '';
        document.getElementById('modal-title-name').textContent = USERNAME
    }).catch(err => console.error('Error:', err))

    fetch('https://recorder.fuelmates.com/api/email/all', {
        method: 'GET',
        credentials: 'include'
    }).then(res => {
        return res.json()
    }).then(data => {
        EMAILS = data.emails || [];
        EMAILS.forEach(email => {
            writeEmailDiv({
                subject: email.subject,
                from: email.from,
                compressed: email.compressed,
                id: email.id,
            });
        });
    }).catch(err => console.error('Error:', err))

});
