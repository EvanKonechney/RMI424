// a function to return elements by their IDs
function r_e(id) {
  return document.querySelector(`#${id}`);
}

// page changes ------------------------------------------------------------

r_e("home").addEventListener("click", () => {
  r_e("homepage").classList.remove("is-hidden");
  r_e("aboutpage").classList.add("is-hidden");
  r_e("joinpage").classList.add("is-hidden");
  r_e("eventspage").classList.add("is-hidden");
  r_e("rosterpage").classList.add("is-hidden");
  r_e("contactpage").classList.add("is-hidden");
});

r_e("about").addEventListener("click", () => {
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.remove("is-hidden");
  r_e("joinpage").classList.add("is-hidden");
  r_e("eventspage").classList.add("is-hidden");
  r_e("rosterpage").classList.add("is-hidden");
  r_e("contactpage").classList.add("is-hidden");
});

r_e("join").addEventListener("click", () => {
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.add("is-hidden");
  r_e("joinpage").classList.remove("is-hidden");
  r_e("eventspage").classList.add("is-hidden");
  r_e("rosterpage").classList.add("is-hidden");
  r_e("contactpage").classList.add("is-hidden");
});

r_e("events").addEventListener("click", () => {
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.add("is-hidden");
  r_e("joinpage").classList.add("is-hidden");
  r_e("eventspage").classList.remove("is-hidden");
  r_e("rosterpage").classList.add("is-hidden");
  r_e("contactpage").classList.add("is-hidden");
});

r_e("roster").addEventListener("click", () => {
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.add("is-hidden");
  r_e("joinpage").classList.add("is-hidden");
  r_e("eventspage").classList.add("is-hidden");
  r_e("rosterpage").classList.remove("is-hidden");
  r_e("contactpage").classList.add("is-hidden");
});

r_e("contact").addEventListener("click", function () {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
});

// Function to sign in the user
function signIn() {
  document.getElementById("signinBtn").classList.add("is-hidden"); // Hide the Sign In button
  document.getElementById("signoutBtn").classList.remove("is-hidden"); // Show the Sign Out button

  // Update the user status to "signed in"
  localStorage.setItem("signedIn", "true");
  alert("You are now signed in.");
}

// Function to sign out the user
function signOut() {
  document.getElementById("signinBtn").classList.remove("is-hidden"); // Show the Sign In button
  document.getElementById("signoutBtn").classList.add("is-hidden"); // Hide the Sign Out button

  // Update the user status to "signed out"
  localStorage.setItem("signedIn", "false");
  alert("You are now signed out.");
}

// Function to check if the user is signed in
function isUserSignedIn() {
  return localStorage.getItem("signedIn") === "true"; // Check if the user is signed in from localStorage
}

// Initialize the sign-in state on page load
window.onload = function () {
  if (isUserSignedIn()) {
    document.getElementById("signinBtn").classList.add("is-hidden"); // Hide the Sign In button
    document.getElementById("signoutBtn").classList.remove("is-hidden"); // Show the Sign Out button
  } else {
    document.getElementById("signinBtn").classList.remove("is-hidden"); // Show the Sign In button
    document.getElementById("signoutBtn").classList.add("is-hidden"); // Hide the Sign Out button
  }
};

// Show the modal
function signIn() {
  document.getElementById("signinModal").classList.add("is-active");
}

// Close the modal
function closeModal() {
  document.getElementById("signinModal").classList.remove("is-active");
}

// Handle form submission
function submitSignIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    // Mock sign-in logic
    console.log(`Signed in with Email: ${email}, Password: ${password}`);
    closeModal();
    document.getElementById("signinBtn").classList.add("is-hidden");
    document.getElementById("signoutBtn").classList.remove("is-hidden");
  } else {
    alert("Please fill in both fields.");
  }
}
