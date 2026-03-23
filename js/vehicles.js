function openVehiclePopup(id) {
  document.getElementById(id)?.classList.add("active");
}

function closeVehiclePopup(id) {
  document.getElementById(id)?.classList.remove("active");
}

function updateSelectedType(type = "", subtype = "") {
  const selectedType = document.getElementById("selected-type");
  const typeInput = document.getElementById("vehicle-type");
  const subtypeInput = document.getElementById("vehicle-subtype");

  let text = "Nije odabrano vozilo";

  if (type && subtype) {
    text = `${type} - ${subtype}`;
  } else if (type) {
    text = type;
  }

  if (selectedType) selectedType.textContent = text;
  if (typeInput) typeInput.value = type;
  if (subtypeInput) subtypeInput.value = subtype;
}

function getVehicleImage(type) {
  if (!type) return "imag-vehicle/hatchback.png";

  const normalized = type.toLowerCase().trim();

  if (normalized.includes("kombi")) return "imag-vehicle/kombi.png";
  if (normalized.includes("suv")) return "imag-vehicle/suv.png";
  if (normalized.includes("hatchback")) return "imag-vehicle/hatchback.png";
  if (normalized.includes("sedan")) return "imag-vehicle/sedan.png";
  if (normalized.includes("karavan")) return "imag-vehicle/karavan.png";
  if (normalized.includes("coupe")) return "imag-vehicle/coupe.png";
  if (normalized.includes("motor")) return "imag-vehicle/motor.png";
  if (normalized.includes("kvad")) return "imag-vehicle/kvad.png";

  return "imag-vehicle/hatchback.png";
}

function resetVehicleModal() {
  document.getElementById("vehicle-make").value = "";
  document.getElementById("vehicle-model").value = "";
  document.getElementById("vehicle-year").value = "";
  updateSelectedType("", "");

  document.getElementById("vehicle-modal").dataset.editId = "";
  document.getElementById("save-vehicle").textContent = "Spremi vozilo";
}

async function loadVehicles() {
  const user = await getCurrentUser();
  if (!user) return;

  const { data, error } = await supabaseClient
    .from("vehicles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Greška kod učitavanja vozila:", error);
    return;
  }

  const container = document.getElementById("vehicles-list");
  if (!container) return;

  container.innerHTML = "";

  if (data && data.length) {
    data.forEach((v) => {
      const card = document.createElement("div");
      card.className = "vehicle-card-ui";

      const typeText =
        v.vehicle_type === "Kombi" && v.vehicle_subtype
          ? `${v.vehicle_type} - ${v.vehicle_subtype}`
          : v.vehicle_type || "-";

      card.innerHTML = `
        <img src="${getVehicleImage(v.vehicle_type)}" class="vehicle-card-img" alt="${typeText}">

        <h3>${v.make || "-"} ${v.model || ""} ${v.year ? "(" + v.year + ")" : ""}</h3>

        <div class="vehicle-info">
          Vrsta vozila: ${typeText}
        </div>

        <div class="vehicle-tag">${typeText}</div>

        <div class="vehicle-actions">
          <button type="button" class="auth-btn edit-vehicle-btn" data-id="${v.id}">
            Uredi
          </button>

          <button type="button" class="auth-btn delete-vehicle-btn" data-id="${v.id}">
            Obriši
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  const addCard = document.createElement("div");
  addCard.className = "add-vehicle-card";
  addCard.id = "add-vehicle-btn";
  addCard.innerHTML = `
    <div class="add-vehicle-icon">+</div>
    <div class="add-vehicle-title">Dodaj vozilo</div>
    <div class="add-vehicle-subtitle">Spremi novo vozilo u svoj profil</div>
  `;

  container.appendChild(addCard);

  addCard.addEventListener("click", () => {
    resetVehicleModal();
    openVehiclePopup("vehicle-modal");
  });

  document.querySelectorAll(".edit-vehicle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const vehicleId = btn.dataset.id;
      const vehicle = data.find((v) => v.id === vehicleId);

      if (!vehicle) return;

      document.getElementById("vehicle-make").value = vehicle.make || "";
      document.getElementById("vehicle-model").value = vehicle.model || "";
      document.getElementById("vehicle-year").value = vehicle.year || "";

      updateSelectedType(vehicle.vehicle_type || "", vehicle.vehicle_subtype || "");

      document.getElementById("vehicle-modal").dataset.editId = vehicle.id;
      document.getElementById("save-vehicle").textContent = "Spremi izmjene";

      openVehiclePopup("vehicle-modal");
    });
  });

  document.querySelectorAll(".delete-vehicle-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const vehicleId = btn.dataset.id;

      const { error } = await supabaseClient
        .from("vehicles")
        .delete()
        .eq("id", vehicleId);

      if (error) {
        console.error("Greška kod brisanja vozila:", error);
        return;
      }

      loadVehicles();
    });
  });
}

async function saveVehicle() {
  const user = await getCurrentUser();
  if (!user) return;

  const make = document.getElementById("vehicle-make")?.value.trim() || "";
  const model = document.getElementById("vehicle-model")?.value.trim() || "";
  const yearValue = document.getElementById("vehicle-year")?.value;
  const year = yearValue ? parseInt(yearValue, 10) : null;
  const vehicleType = document.getElementById("vehicle-type")?.value || "";
  const vehicleSubtype = document.getElementById("vehicle-subtype")?.value || "";
  const editId = document.getElementById("vehicle-modal")?.dataset.editId || "";

  console.log("EDIT ID:", editId);
  console.log("SAVE DATA:", {
    make,
    model,
    year,
    vehicleType,
    vehicleSubtype
  });

  if (!make || !model || !vehicleType) {
    alert("Unesi marku, model i odaberi vrstu vozila.");
    return;
  }

  let res;

  if (editId) {
    res = await supabaseClient
      .from("vehicles")
      .update({
        make,
        model,
        year,
        vehicle_type: vehicleType,
        vehicle_subtype: vehicleSubtype
      })
      .eq("id", editId)
      .eq("user_id", user.id)
      .select();

    console.log("UPDATE RESPONSE:", res);
  } else {
    res = await supabaseClient
      .from("vehicles")
      .insert({
        user_id: user.id,
        make,
        model,
        year,
        vehicle_type: vehicleType,
        vehicle_subtype: vehicleSubtype
      })
      .select();

    console.log("INSERT RESPONSE:", res);
  }

  if (res.error) {
    console.error("Greška kod spremanja vozila:", res.error);
    alert("Greška: " + res.error.message);
    return;
  }

  document.getElementById("vehicle-make").value = "";
  document.getElementById("vehicle-model").value = "";
  document.getElementById("vehicle-year").value = "";
  updateSelectedType("", "");

  document.getElementById("vehicle-modal").dataset.editId = "";
  document.getElementById("save-vehicle").textContent = "Spremi vozilo";

  closeVehiclePopup("vehicle-modal");
  loadVehicles();
}


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-vehicle-modal")?.addEventListener("click", () => {
    closeVehiclePopup("vehicle-modal");
  });

  document.getElementById("vehicle-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "vehicle-modal") {
      closeVehiclePopup("vehicle-modal");
    }
  });

  document.getElementById("choose-type")?.addEventListener("click", () => {
    openVehiclePopup("vehicle-type-popup");
  });

  document.querySelectorAll("[data-close-popup]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeVehiclePopup(btn.dataset.closePopup);
    });
  });

  document.getElementById("vehicle-type-popup")?.addEventListener("click", (e) => {
    if (e.target.id === "vehicle-type-popup") {
      closeVehiclePopup("vehicle-type-popup");
    }
  });

  document.getElementById("kombi-subtype-popup")?.addEventListener("click", (e) => {
    if (e.target.id === "kombi-subtype-popup") {
      closeVehiclePopup("kombi-subtype-popup");
    }
  });

  document.querySelectorAll(".vehicle-card[data-type]").forEach((card) => {
    card.addEventListener("click", () => {
      const type = card.dataset.type;

      if (type === "Kombi") {
        closeVehiclePopup("vehicle-type-popup");
        openVehiclePopup("kombi-subtype-popup");
        return;
      }

      updateSelectedType(type, "");
      closeVehiclePopup("vehicle-type-popup");
    });
  });

  document.querySelectorAll(".kombi-subtype-card").forEach((card) => {
    card.addEventListener("click", () => {
      const subtype = card.dataset.subtype;
      updateSelectedType("Kombi", subtype);
      closeVehiclePopup("kombi-subtype-popup");
    });
  });

  document.getElementById("save-vehicle")?.addEventListener("click", saveVehicle);

  loadVehicles();
});
