async function loadProfile() {
  const user = await getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Greška:", error);
    return;
  }

  document.getElementById("firstName").value = data?.first_name || "";
  document.getElementById("lastName").value = data?.last_name || "";
  document.getElementById("phone").value = data?.phone || "";
  document.getElementById("email").value = user.email;
}

async function saveProfile(e) {
  e.preventDefault();

  const user = await getCurrentUser();

  if (!user) return;

  const { error } = await supabaseClient.from("profiles").upsert({
    id: user.id,
    first_name: document.getElementById("firstName").value.trim(),
    last_name: document.getElementById("lastName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    updated_at: new Date().toISOString()
  });

  const message = document.getElementById("profile-message");

  if (error) {
    console.error(error);
    message.textContent = "Greška kod spremanja.";
    return;
  }

  message.textContent = "Podaci su spremljeni.";
}

/* ========================= */
/* EVENTI */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("profile-form")
    ?.addEventListener("submit", saveProfile);

  loadProfile();
});