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

// Search function
let membersData = []; // to store fetched user data

r_e("roster").addEventListener("click", async () => {
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.add("is-hidden");
  r_e("joinpage").classList.add("is-hidden");
  r_e("eventspage").classList.add("is-hidden");
  r_e("rosterpage").classList.remove("is-hidden");
  r_e("contactpage").classList.add("is-hidden");

  // Reference to the container div where member info will be inserted
  const rosterContainer = document.querySelector(".member-roster");
  rosterContainer.innerHTML = ""; // Clear existing content

  try {
    const snapshot = await db.collection("Users").get();
    snapshot.forEach((doc) => {
      const data = doc.data();
      membersData.push(data);

      // Create a new div for each user
      const memberDiv = document.createElement("div");
      memberDiv.classList.add("column", "is-one-third");

      memberDiv.innerHTML = `
        <div class="card">
          <div class="card-content">
            <p class="title is-5">${data.first_name} ${data.last_name}</p>
            <p><strong>Year:</strong> ${data.Standing}</p>
            <p><strong>Status:</strong> ${data.membership_status}</p>
          </div>
        </div>
      `;

      rosterContainer.appendChild(memberDiv);
    });
  } catch (error) {
    console.error("Error loading roster:", error);
    rosterContainer.innerHTML = `<p>Failed to load roster data.</p>`;
  }
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

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwbYc0yoW17C5fhIFwJpMH9yOK3hi6lA8",
  authDomain: "infosys424project.firebaseapp.com",
  projectId: "infosys424project",
  storageBucket: "infosys424project.firebasestorage.app",
  messagingSenderId: "410062568113",
  appId: "1:410062568113:web:08f3f71987dd3ab6250090",
  measurementId: "G-RS7X851NXV",
};
firebase.initializeApp(firebaseConfig);
let auth = firebase.auth();
let db = firebase.firestore();

// Add a user
// db.collection("Users")
//   .doc("user1")
//   .set({
//     first_name: "John",
//     last_name: "Doe",
//     email: "john.doe@email.com",
//     phone: "123-456-7890",
//     join_date: "2024-04-01",
//     Standing: "jr",
//     membership_status: "active",
//     events_attended: ["Event1", "Event 2"],
//   });

db.collection("Events")
  .doc("event1")
  .set({
    event_name: "Speaker 1",
    date: "2024-04-15",
    location: {
      building: "ABC Hall",
      room: "101",
    },
    description: "An event to network with professionals.",
    attendees: ["user1", "user2"],
  });

// Add attendance record
db.collection("Attendance").doc("att1").set({
  user_id: "user1",
  event_id: "event1",
});

db.collection("Users")
  .doc("user2")
  .set({
    first_name: "Sally",
    last_name: "Smith",
    email: "sally.smith@email.com",
    phone: "231-456-7890",
    join_date: "2024-04-10",
    Standing: "jr",
    membership_status: "active",
    events_attended: ["Event1", "Event 2"],
  });

// Search function
function renderFilteredRoster(searchTerm) {
  const rosterContainer = document.querySelector(".member-roster");
  rosterContainer.innerHTML = "";

  const filtered = membersData.filter((member) =>
    `${member.first_name} ${member.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  filtered.forEach((member) => {
    const memberDiv = document.createElement("div");
    memberDiv.classList.add("column", "is-one-third");

    memberDiv.innerHTML = `
        <div class="card">
          <div class="card-content">
            <p class="title is-5">${member.first_name} ${member.last_name}</p>
            <p><strong>Year:</strong> ${member.Standing}</p>
            <p><strong>Status:</strong> ${member.membership_status}</p>
          </div>
        </div>
      `;

    rosterContainer.appendChild(memberDiv);
  });
}

// Search Button event listener
document.getElementById("rosterSearchBtn").addEventListener("click", () => {
  const searchValue = document.getElementById("rosterSearch").value;
  renderFilteredRoster(searchValue);
});

// reset button event listener
document.getElementById("rosterResetBtn").addEventListener("click", () => {
  document.getElementById("rosterSearch").value = ""; // Clear input
  renderFilteredRoster(""); // Show full roster
});
