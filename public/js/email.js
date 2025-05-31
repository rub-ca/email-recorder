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

    div.addEventListener('click', () => {
        console.log('Compressed value:', email.compressed);
    });

    chatList.appendChild(div);
}

// on document load
document.addEventListener('DOMContentLoaded', () => {

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