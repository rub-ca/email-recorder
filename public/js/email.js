var EMAILS = [];

function writeEmailDiv(email) {
    const chatList = document.getElementById('chat-list');
    const div = document.createElement('div');
    div.className = 'chat-item';
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

            const decompressed = await response.json(); // Recibe texto plano descomprimido

            const chatContent = document.getElementById('email-content');

            chatContent.innerHTML = `${decompressed.compressed}`;

            console.log('Contenido descomprimido:', decompressed);
        } catch (error) {
            console.error('Error al descomprimir:', error);
        }
    });

    chatList.appendChild(div);
}

// on document load
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

    try {
        await fetch('https://recorder.fuelmates.com/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
    } catch (err) {
        console.log('Error: ' + err.message)
    }

    fetch('https://recorder.fuelmates.com/api/email/all', {
        method: 'GET',
        credentials: 'include' // 👈 NECESARIO para enviar cookies
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            EMAILS = data.emails || [];
            EMAILS.forEach(email => {
                writeEmailDiv({
                    subject: email.subject,
                    from: email.from,
                    compressed: email.compressed
                });
            });
        })
        .catch(err => console.error('Error:', err))
});


async function onClickSendMessage() {
    const input = document.getElementById('textarea-message');
    const emailContent = input.value.trim();

    if (!emailContent) return;

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
        console.log('Correo enviado:', data);

        console.dir("\n")
        console.dir("\n")
        console.dir(EMAILS)

        // Limpiar el input
        input.value = '';
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}