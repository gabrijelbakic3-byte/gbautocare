async function autofillBookingForm() {
  const user = await getCurrentUser();

  if (!user) {
    console.log("Nema prijavljenog korisnika, nema autofilla.");
    return;
  }

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Greška kod dohvaćanja profila za booking:", error);
    return;
  }

  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");
  const vehicleInput = document.getElementById("vehicle");
  const vehicleTypeInput = document.getElementById("vehicleType");

  if (fullNameInput && !fullNameInput.value) {
    fullNameInput.value = data?.full_name || user.user_metadata?.full_name || "";
  }

  if (phoneInput && !phoneInput.value) {
    phoneInput.value = data?.phone || "";
  }

  if (vehicleInput && !vehicleInput.value) {
    vehicleInput.value = data?.vehicle || "";
  }

  let vehicleTypeText = "";

  if (data?.vehicle_type === "Kombi" && data?.vehicle_subtype) {
    vehicleTypeText = "Kombi";
  } else {
    vehicleTypeText = mapVehicleTypeToBookingOption(data?.vehicle_type || "");
  }

  if (vehicleTypeInput && !vehicleTypeInput.value) {
    vehicleTypeInput.value = vehicleTypeText;
  }

  console.log("Booking forma je auto-popunjena.");
}

function mapVehicleTypeToBookingOption(vehicleType) {
  if (vehicleType === "Hatchback") return "Malo vozilo";
  if (vehicleType === "Sedan") return "Srednje vozilo";
  if (vehicleType === "SUV") return "Veliko vozilo / SUV";
  if (vehicleType === "Kombi") return "Kombi";
  return "";
}

async function loadSavedVehiclesForBooking() {
  const savedCarsWrap = document.getElementById("saved-cars-wrap");
  const savedCarSelect = document.getElementById("savedCarSelect");
  const vehicleInput = document.getElementById("vehicle");
  const vehicleTypeSelect = document.getElementById("vehicleType");

  if (!savedCarsWrap || !savedCarSelect || !vehicleInput || !vehicleTypeSelect) {
    console.log("Nedostaju booking elementi za spremljena vozila.");
    return;
  }

  try {
    const user = await getCurrentUser();

    if (!user) {
      console.log("Nema prijavljenog korisnika, nema spremljenih vozila.");
      return;
    }

    const { data: vehicles, error } = await supabaseClient
      .from("vehicles")
      .select("id, make, model, year, vehicle_type")
      .eq("user_id", user.id);

    if (error) {
      console.error("Greška pri dohvatu vozila:", error);
      return;
    }

    if (!vehicles || vehicles.length === 0) {
      console.log("Korisnik nema spremljenih vozila.");
      return;
    }

    savedCarsWrap.style.display = "block";
    savedCarSelect.innerHTML = `<option value="">Ručno upiši vozilo</option>`;

    vehicles.forEach((vehicle) => {
      const option = document.createElement("option");
      option.value = vehicle.id;

      const make = vehicle.make || "";
      const model = vehicle.model || "";
      const year = vehicle.year || "";
      const vehicleType = vehicle.vehicle_type || "";

      option.textContent = `${make} ${model} ${year}`.replace(/\s+/g, " ").trim();
      option.dataset.make = make;
      option.dataset.model = model;
      option.dataset.year = year;
      option.dataset.vehicleType = vehicleType;

      savedCarSelect.appendChild(option);
    });

    savedCarSelect.addEventListener("change", function () {
      if (!this.value) {
        vehicleInput.value = "";
        vehicleTypeSelect.value = "";
        vehicleInput.readOnly = false;
        return;
      }

      const selectedOption = this.options[this.selectedIndex];

      const make = selectedOption.dataset.make || "";
      const model = selectedOption.dataset.model || "";
      const year = selectedOption.dataset.year || "";
      const vehicleType = selectedOption.dataset.vehicleType || "";

      vehicleInput.value = `${make} ${model} ${year}`.replace(/\s+/g, " ").trim();
      vehicleTypeSelect.value = mapVehicleTypeToBookingOption(vehicleType);
      vehicleInput.readOnly = true;
    });

    if (vehicles.length === 1) {
      savedCarSelect.value = vehicles[0].id;
      savedCarSelect.dispatchEvent(new Event("change"));
    }
  } catch (err) {
    console.error("Neočekivana greška:", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await autofillBookingForm();
  await loadSavedVehiclesForBooking();
});

// Globalna varijabla koja pamti je li kod uspješno primijenjen
window.appliedPromo = null;

document.getElementById('apply-promo-btn')?.addEventListener('click', async () => {
    const inputField = document.getElementById('promo-code-input');
    const messageDiv = document.getElementById('promo-message');
    
    if (!inputField || !messageDiv) return;

    // .toUpperCase() automatski pretvara gbplus, GbPlus, itd. u GBPLUS
    const code = inputField.value.trim().toUpperCase(); 

    messageDiv.style.display = 'block';

    if (code !== 'GBPLUS') {
        messageDiv.style.color = '#ff1f1f'; // Crvena
        messageDiv.innerText = 'Nevažeći kod.';
        return;
    }

    // 1. Provjera datuma (do 31.5.2026)
    const today = new Date();
    const expiryDate = new Date('2026-05-31T23:59:59');
    if (today > expiryDate) {
        messageDiv.style.color = '#ff1f1f';
        messageDiv.innerText = 'Ovaj kod je istekao.';
        return;
    }

    // 2. Provjera je li korisnik prijavljen
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        messageDiv.style.color = '#ff1f1f';
        messageDiv.innerText = 'Morate biti prijavljeni da biste koristili kod.';
        return;
    }

    const userId = session.user.id;

    // 3. Provjera u bazi (je li korisnik već iskoristio ovaj kod)
    const { data: usedCodes, error } = await supabaseClient
        .from('promo_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('promo_code', 'GBPLUS');

    if (usedCodes && usedCodes.length > 0) {
        messageDiv.style.color = '#ff1f1f';
        messageDiv.innerText = 'Ovaj kod ste već iskoristili.';
        return;
    }

    // 4. Uspjeh! Kod prolazi sve provjere.
    messageDiv.style.color = '#4CAF50'; // Zelena
    messageDiv.innerText = 'Kod uspješno primijenjen! 20% popusta će biti zabilježeno u narudžbi.';
    
    // Pamtimo da je kod aktivan za ovu sesiju
    window.appliedPromo = 'GBPLUS';
});