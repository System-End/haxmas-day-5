// Elements
const loginScreen = document.getElementById("loginScreen");
const mainApp = document.getElementById("mainApp");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const giftForm = document.getElementById("giftForm");
const giftsContainer = document.getElementById("gifts");
const logoutBtn = document.getElementById("logoutBtn");

// Stats elements
const totalGiftsEl = document.getElementById("totalGifts");
const purchasedGiftsEl = document.getElementById("purchasedGifts");
const deliveredGiftsEl = document.getElementById("deliveredGifts");

let currentPassword = "";

// Login handling
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = loginForm.elements.password.value;

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (response.ok) {
    currentPassword = password;
    loginScreen.classList.add("hidden");
    mainApp.classList.remove("hidden");
    loginError.textContent = "";
    loadGifts();
  } else {
    loginError.textContent = "❌ Wrong password! Try again.";
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  currentPassword = "";
  mainApp.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  loginForm.reset();
});

// Load gifts from server
async function loadGifts() {
  const response = await fetch("/gifts", {
    headers: { "X-Password": currentPassword },
  });
  const gifts = await response.json();

  giftsContainer.innerHTML = "";
  let purchased = 0,
    delivered = 0;

  gifts.forEach((gift) => {
    if (gift.status === "purchased") purchased++;
    if (gift.status === "delivered") delivered++;

    const item = document.createElement("div");
    item.className = `gift-item ${gift.status}`;
    item.innerHTML = `
            <div class="gift-info">
                <strong>${gift.category}</strong> for <strong>${gift.name}</strong><br>
                🎁 ${gift.gift}
                ${gift.status !== "pending" ? `<br><em>(${gift.status})</em>` : ""}
            </div>
            <div class="gift-buttons">
                ${gift.status === "pending" ? `<button class="btn-purchase" onclick="updateStatus(${gift.id}, 'purchased')">✓ Bought</button>` : ""}
                ${gift.status === "purchased" ? `<button class="btn-deliver" onclick="updateStatus(${gift.id}, 'delivered')">🚚 Delivered</button>` : ""}
                <button class="btn-delete" onclick="deleteGift(${gift.id})">🗑️</button>
            </div>
        `;
    giftsContainer.appendChild(item);
  });

  totalGiftsEl.textContent = `${gifts.length} gifts`;
  purchasedGiftsEl.textContent = `${purchased} purchased`;
  deliveredGiftsEl.textContent = `${delivered} delivered`;
}

giftForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = giftForm.elements.name.value;
  const gift = giftForm.elements.gift.value;
  const category = giftForm.elements.category.value;

  await fetch("/gifts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Password": currentPassword,
    },
    body: JSON.stringify({ name, gift, category }),
  });

  giftForm.reset();
  await loadGifts();
});

async function updateStatus(id, status) {
  await fetch(`/gifts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Password": currentPassword,
    },
    body: JSON.stringify({ status }),
  });
  await loadGifts();
}

async function deleteGift(id) {
  if (confirm("Are you sure you want to delete this gift?")) {
    await fetch(`/gifts/${id}`, {
      method: "DELETE",
      headers: { "X-Password": currentPassword },
    });
    await loadGifts();
  }
}
