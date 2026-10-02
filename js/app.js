// Default profile data (matches your screenshot)
const DEFAULT_PROFILE = {
  userId: "USR001",
  name: "Admin User",
  email: "admin@rehan-school.com",
  phone: "03001234501",
  role: "Admin"
};

// Load profile from localStorage or use default
function loadProfile() {
  const saved = localStorage.getItem("userProfile");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return { ...DEFAULT_PROFILE };
    }
  }
  return { ...DEFAULT_PROFILE };
}

// Save profile to localStorage
function saveToStorage(profile) {
  localStorage.setItem("userProfile", JSON.stringify(profile));
}

// Get initials from name
function getInitials(name) {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Update all UI elements with current profile
function renderProfile(profile) {
  const initials = getInitials(profile.name);

  // Header avatar + name
  document.getElementById("profileAvatar").textContent = initials;
  document.getElementById("displayName").textContent = profile.name;
  document.getElementById("displayRole").textContent = profile.role;

  // Details
  document.getElementById("displayUserId").textContent = profile.userId;
  document.getElementById("displayEmail").textContent = profile.email;
  document.getElementById("displayPhone").textContent = profile.phone;
  document.getElementById("displayRole2").textContent = profile.role;

  // Navbar
  document.getElementById("navAvatar").textContent = initials;
  document.getElementById("navName").textContent = profile.name;
  document.getElementById("navRole").textContent = profile.role;
}

// Open edit modal and fill form
function openEditModal() {
  const profile = loadProfile();

  document.getElementById("inputName").value = profile.name;
  document.getElementById("inputEmail").value = profile.email;
  document.getElementById("inputPhone").value = profile.phone;
  document.getElementById("inputRole").value = profile.role;
  document.getElementById("inputUserId").value = profile.userId;

  document.getElementById("editModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close modal
function closeEditModal() {
  document.getElementById("editModal").classList.remove("active");
  document.body.style.overflow = "";
}

// Save profile from form
function saveProfile(event) {
  event.preventDefault();

  const updated = {
    userId: document.getElementById("inputUserId").value,
    name: document.getElementById("inputName").value.trim(),
    email: document.getElementById("inputEmail").value.trim(),
    phone: document.getElementById("inputPhone").value.trim(),
    role: document.getElementById("inputRole").value
  };

  // Basic validation
  if (!updated.name || updated.name.length < 2) {
    showToast("Name must be at least 2 characters", false);
    return;
  }

  if (!updated.email.includes("@")) {
    showToast("Please enter a valid email", false);
    return;
  }

  saveToStorage(updated);
  renderProfile(updated);
  closeEditModal();
  showToast("Profile updated successfully!", true);
}

// Toast notification
function showToast(message, success = true) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show" + (success ? " success" : "");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// Close modal on overlay click
document.getElementById("editModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeEditModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeEditModal();
  }
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  const profile = loadProfile();
  renderProfile(profile);
});
