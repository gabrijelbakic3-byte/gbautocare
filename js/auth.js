const registerForm = document.getElementById('register-form');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

   const fullName = document.getElementById('register-name').value.trim();
const [firstName = '', lastName = ''] = fullName.split(' ');
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const messageEl = document.getElementById('register-message');

    messageEl.textContent = 'Registracija u tijeku...';

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
     options: {
  data: {
    full_name: fullName,
    first_name: firstName,
    last_name: lastName
  }
}
    });

    if (error) {
      messageEl.textContent = 'Greška: ' + error.message;
      return;
    }

    messageEl.textContent = 'Registracija uspješna! Provjeri email.';
    console.log('Registracija uspješna:', data);
  });
}

const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const messageEl = document.getElementById('login-message');

    messageEl.textContent = 'Prijava u tijeku...';

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      messageEl.textContent = 'Greška: ' + error.message;
      return;
    }

  messageEl.textContent = 'Prijava uspješna.';
console.log('Login uspješan:', data);

setTimeout(() => {
  window.location.href = 'index.html';
}, 800);
  });
}

async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error('Greška kod dohvaćanja usera:', error.message);
    return null;
  }

  return data.session?.user ?? null;
}



async function updateNavbar() {
  const authLinks = document.getElementById('auth-links');
  if (!authLinks) return;

  const user = await getCurrentUser();

  if (user) {
    authLinks.innerHTML = `
     <a href="profil.html">Moj profil</a>
      <button id="logout-btn">Odjava</button>
    `;

    document.getElementById('logout-btn')?.addEventListener('click', async () => {
      await supabaseClient.auth.signOut();
      location.reload();
    });

  } else {
    authLinks.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Registracija</a>
    `;
  }
}

updateNavbar();

// Funkcija za prikazivanje/skrivanje lozinke (sa standardnim ikonicama)
function togglePassword(inputId, iconSpan) {
    const input = document.getElementById(inputId);
    
    // HTML kod za standardno oko
    const eyeOpen = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    
    // HTML kod za prekriženo oko
    const eyeClosed = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

    if (input.type === "password") {
        input.type = "text";
        iconSpan.innerHTML = eyeClosed; // Prikazuje prekriženo oko
    } else {
        input.type = "password";
        iconSpan.innerHTML = eyeOpen; // Prikazuje normalno oko
    }
}
