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
  window.location.href = 'index main.html';
}, 800);
  });
}

async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.error('Greška kod dohvaćanja usera:', error.message);
    return null;
  }

  return data.user;
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