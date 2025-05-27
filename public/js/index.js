function showLogin() {
    document.getElementById('register-screen').style.display = 'none'
    document.getElementById('login-screen').style.display = 'block'
}

function showRegister() {
    document.getElementById('login-screen').style.display = 'none'
    document.getElementById('register-screen').style.display = 'block'
}

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const payload = {
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password')
    }

    try {
        const response = await fetch('https://recorder.fuelmates.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
        })

        if (response.ok) {
            showLogin()
        }
    } catch (err) {
    }
})

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const payload = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    try {
        const response = await fetch('https://recorder.fuelmates.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
        })

        if (response.ok) {
            window.location.href = '/email.html'
        } else {
            const data = await response.json()
            console.log('Login failed: ' + (data.message || 'Unknown error'))
        }
    } catch (err) {
        console.log('Error: ' + err.message)
    }
})

document.getElementById('refresh-token-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('https://recorder.fuelmates.com/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        })

        if (response.ok) {
            console.log('Access token refreshed successfully.')
        } else {
            const data = await response.json()
            console.log('Refresh failed: ' + (data.message || 'Unknown error'))
        }
    } catch (err) {
        console.log('Error: ' + err.message)
    }
})
