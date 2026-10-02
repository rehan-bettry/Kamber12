// Default profile data (matches your latest screenshot)
const DEFAULT_PROFILE = {
  userId: "USR001",
  name: "Rehan Ali",
  email: "admin@rehan-school.com",
  phone: "03322131388",
  role: "Admin",
  photo: null   // base64 string or null
};

// Temporary photo while editing (before save)
let tempPhoto = null;

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

// Set avatar element (supports photo or initials)
function setAvatar(element, profile) {
  if (profile.photo) {
    element.style.backgroundImage = `url(${profile.photo})`;
    element.classList.add("has-image");
    element.textContent = "";
  } else {
    element.style.backgroundImage = "";
    element.classList.remove("has-image");
    element.textContent = getInitials(profile.name);
  }
}

// Update all UI elements with current profile
function renderProfile(profile) {
  // Header avatar + name
  setAvatar(document.getElementById("profileAvatar"), profile);
  document.getElementById("displayName").textContent = profile.name;
  document.getElementById("displayRole").textContent = profile.role;

  // Details
  document.getElementById("displayUserId").textContent = profile.userId;
  document.getElementById("displayEmail").textContent = profile.email;
  document.getElementById("displayPhone").textContent = profile.phone;
  document.getElementById("displayRole2").textContent = profile.role;

  // Navbar
  setAvatar(document.getElementById("navAvatar"), profile);
  document.getElementById("navName").textContent = profile.name;
  document.getElementById("navRole").textContent = profile.role;
}

// Update photo preview in modal
function updatePhotoPreview(photo, name) {
  const preview = document.getElementById("photoPreview");
  const removeBtn = document.getElementById("removePhotoBtn");

  if (photo) {
    preview.style.backgroundImage = `url(${photo})`;
    preview.classList.add("has-image");
    preview.textContent = "";
    removeBtn.style.display = "inline-block";
  } else {
    preview.style.backgroundImage = "";
    preview.classList.remove("has-image");
    preview.textContent = getInitials(name || "User");
    removeBtn.style.display = "none";
  }
}

// Handle file select
function handlePhotoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate type
  if (!file.type.startsWith("image/")) {
    showToast("Please select an image file (JPG, PNG, GIF)", false);
    return;
  }

  // Validate size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showToast("Image size must be less than 2MB", false);
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    tempPhoto = e.target.result; // base64
    updatePhotoPreview(tempPhoto, document.getElementById("inputName").value);
  };
  reader.readAsDataURL(file);
}

// Remove photo
function removePhoto() {
  tempPhoto = null;
  document.getElementById("photoInput").value = "";
  updatePhotoPreview(null, document.getElementById("inputName").value);
}

// Open edit modal and fill form
function openEditModal() {
  const profile = loadProfile();

  document.getElementById("inputName").value = profile.name;
  document.getElementById("inputEmail").value = profile.email;
  document.getElementById("inputPhone").value = profile.phone;
  document.getElementById("inputRole").value = profile.role;
  document.getElementById("inputUserId").value = profile.userId;

  // Set temp photo from saved
  tempPhoto = profile.photo || null;
  updatePhotoPreview(tempPhoto, profile.name);

  // Reset file input
  document.getElementById("photoInput").value = "";

  document.getElementById("editModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close modal
function closeEditModal() {
  document.getElementById("editModal").classList.remove("active");
  document.body.style.overflow = "";
  tempPhoto = null;
}

// Save profile from form
function saveProfile(event) {
  event.preventDefault();

  const updated = {
    userId: document.getElementById("inputUserId").value,
    name: document.getElementById("inputName").value.trim(),
    email: document.getElementById("inputEmail").value.trim(),
    phone: document.getElementById("inputPhone").value.trim(),
    role: document.getElementById("inputRole").value,
    photo: tempPhoto   // can be base64 or null
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
