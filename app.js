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
  r_e("calendarpage").classList.add("is-hidden");
});

r_e("about").addEventListener("click", () => {
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.remove("is-hidden");
  r_e("joinpage").classList.add("is-hidden");
  r_e("eventspage").classList.add("is-hidden");
  r_e("rosterpage").classList.add("is-hidden");
  r_e("calendarpage").classList.add("is-hidden");
});

r_e("join").addEventListener("click", () => {
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.add("is-hidden");
  r_e("joinpage").classList.remove("is-hidden");
  r_e("eventspage").classList.add("is-hidden");
  r_e("rosterpage").classList.add("is-hidden");
  r_e("calendarpage").classList.add("is-hidden");
});

r_e("events").addEventListener("click", () => {
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.add("is-hidden");
  r_e("joinpage").classList.add("is-hidden");
  r_e("eventspage").classList.remove("is-hidden");
  r_e("rosterpage").classList.add("is-hidden");
  r_e("calendarpage").classList.add("is-hidden");
});

// Add event listener for the Calendar link in the navbar
r_e("calendar").addEventListener("click", () => {
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.add("is-hidden");
  r_e("joinpage").classList.add("is-hidden");
  r_e("eventspage").classList.add("is-hidden");
  r_e("rosterpage").classList.add("is-hidden");
  r_e("calendarpage").classList.remove("is-hidden");
});

r_e("calendar").addEventListener("click", () => {
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.add("is-hidden");
  r_e("joinpage").classList.add("is-hidden");
  r_e("eventspage").classList.add("is-hidden");
  r_e("rosterpage").classList.add("is-hidden");
  r_e("calendarpage").classList.remove("is-hidden");

  loadCalendarEvents(); // Make sure this line is called
});

// Search function
let membersData = [];

r_e("roster").addEventListener("click", async () => {
  // Hide all other pages, show roster page
  r_e("homepage").classList.add("is-hidden");
  r_e("aboutpage").classList.add("is-hidden");
  r_e("joinpage").classList.add("is-hidden");
  r_e("eventspage").classList.add("is-hidden");
  r_e("calendarpage").classList.add("is-hidden");
  r_e("rosterpage").classList.remove("is-hidden");

  // Clear out any previous roster display
  const rosterContainer = document.querySelector(".member-roster");
  rosterContainer.innerHTML = "";

  try {
    // Fetch all users from Firestore
    const snapshot = await db.collection("Users").get();
    membersData = []; // Clear previous data

    snapshot.forEach((doc) => {
      const data = doc.data();
      membersData.push({ id: doc.id, ...data }); // Save ID too for deletion

      const memberDiv = document.createElement("div");
      memberDiv.classList.add("column", "is-one-third");

      // Create the card content with a delete button
      memberDiv.innerHTML = `
        <div class="card">
          <div class="card-content">
            <p class="title is-5">${data.name}</p>
            <p><strong>Year:</strong> ${data.year}</p>
            <p><strong>Major:</strong> ${data.major}</p>
            <button class="button is-danger is-small delete-member-button" style="margin-top: 10px;">Delete</button>
          </div>
        </div>
      `;

      // Add the card to the page
      rosterContainer.appendChild(memberDiv);

      // Add event listener for delete button
      const deleteButton = memberDiv.querySelector(".delete-member-button");
      deleteButton.addEventListener("click", async () => {
        if (confirm(`Are you sure you want to delete ${data.name}?`)) {
          try {
            await db.collection("Users").doc(doc.id).delete();
            memberDiv.remove(); // Remove the card from the DOM
            console.log(`${data.name} deleted successfully.`);
          } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
          }
        }
      });
    });
  } catch (error) {
    console.error("Error loading roster:", error);
    rosterContainer.innerHTML = `<p>Failed to load roster data.</p>`;
  }
});

// Utility function (assuming you have it elsewhere)
function r_e(id) {
  return document.getElementById(id);
}

//---------------------------------------------Sign In
function signIn() {
  document.getElementById("signinBtn").classList.add("is-hidden");
  document.getElementById("signoutBtn").classList.remove("is-hidden");
  document.getElementById("event-inputs").classList.remove("is-hidden");

  localStorage.setItem("signedIn", "true");
}

function openSignInModal() {
  r_e("signinModal").classList.add("is-active");
}
function closeModal() {
  document.getElementById("signinModal").classList.remove("is-active");
}

function isUserSignedIn() {
  return localStorage.getItem("signedIn") === "true";
}

window.onload = function () {
  if (isUserSignedIn()) {
    document.getElementById("signinBtn").classList.add("is-hidden"); // Hide the Sign In button
    document.getElementById("signoutBtn").classList.remove("is-hidden"); // Show the Sign Out button
  } else {
    document.getElementById("signinBtn").classList.remove("is-hidden"); // Show the Sign In button
    document.getElementById("signoutBtn").classList.add("is-hidden"); // Hide the Sign Out button
  }
};
function signOut() {
  auth
    .signOut()
    .then(() => {
      r_e("signinBtn").classList.remove("is-hidden");
      r_e("signoutBtn").classList.add("is-hidden");
      r_e("event-inputs").classList.add("is-hidden");
      localStorage.setItem("signedIn", "false");
    })
    .catch((error) => {
      alert("Sign out failed: " + error.message);
    });
}

function submitSignIn() {
  // Get the email and password entered by the user
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Firebase sign-in logic
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Hide the sign-in modal
      closeModal();

      // Show the event inputs form (attendance form)
      document.getElementById("event-inputs").classList.remove("is-hidden");

      // Optionally show a message to the user that they are signed in
      document.getElementById("signinBtn").classList.add("is-hidden"); // Hide Sign In button
      document.getElementById("signoutBtn").classList.remove("is-hidden"); // Show Sign Out button
    })
    .catch((error) => {
      alert("Error signing in!");
      // Optionally show an error message to the user
    });
}

// -------------------------------------------------------Search function
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

// --------------------------------------------------------- joining
function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get values from form
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const countryCode = document.getElementById("countryCode").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;
  const year = document.querySelector("select").value;
  const major = document.querySelector(
    'input[placeholder="e.g. Risk Management"]'
  ).value;
  const fullPhoneNumber = `${countryCode}${phoneNumber}`;

  // Validate input values
  if (
    !firstName ||
    !lastName ||
    !fullPhoneNumber ||
    !email ||
    !password ||
    !year ||
    !major
  ) {
    alert("Please fill in all fields.");
    return;
  }

  // Create a new user with Firebase Authentication
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User registered successfully
      const user = userCredential.user;

      // Add additional user data to Firestore
      db.collection("Users")
        .doc(user.uid)
        .set({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: fullPhoneNumber,
          year: year,
          major: major,
          uid: user.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          // Successfully added to Firestore, show thank you message
          document.getElementById("join-form").reset(); // Reset the form
          document.getElementById("thank-you").classList.remove("is-hidden");
          setTimeout(() => {
            document.getElementById("thank-you").classList.add("is-hidden");
          }, 5000); // Hide the "Thank You" message after 5 seconds
        })
        .catch((error) => {
          console.error("Error adding user to Firestore: ", error);
        });
    })
    .catch((error) => {
      console.error("Error creating user: ", error);
      alert("Error creating user: " + error.message);
    });
}

function submitAttendance() {
  const enteredCode = document.getElementById("EventCode").value;

  if (!enteredCode) {
    alert("Please enter an event code.");
    return;
  }

  // Reference to the Events collection in Firestore
  const eventsRef = db.collection("Events");

  // Query the Events collection to find an event with the matching code
  eventsRef
    .where("code", "==", enteredCode) // Assuming 'code' is the field you're matching
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        // If no matching event is found
        alert("No event found with that code.");
        return;
      }

      // If matching event(s) are found
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        const eventId = doc.id;

        // Assuming user is already signed in and their UID is available
        const userId = firebase.auth().currentUser.uid;

        // Reference to the Attendance collection
        const attendanceRef = db.collection("Attendance");

        // Check if the user has already attended this event
        attendanceRef
          .where("user_id", "==", userId)
          .where("event_id", "==", eventId)
          .get()
          .then((attendanceSnapshot) => {
            if (!attendanceSnapshot.empty) {
              // If the user has already attended this event
              alert("You have already attended this event.");
            } else {
              // If the user has not attended, add their attendance
              attendanceRef
                .add({
                  user_id: userId,
                  event_id: eventId,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                  // Update the user's document to add the eventId to their eventsAttended array
                  const userRef = db.collection("Users").doc(userId);

                  userRef
                    .update({
                      eventsAttended:
                        firebase.firestore.FieldValue.arrayUnion(eventId),
                    })
                    .then(() => {
                      alert(
                        "Attendance submitted and event added to your attended list."
                      );
                    })
                    .catch((error) => {
                      alert("Error updating user data: " + error.message);
                    });
                })
                .catch((error) => {
                  alert("Error submitting attendance: " + error.message);
                });
            }
          })
          .catch((error) => {
            alert("Error checking attendance: " + error.message);
          });
      });
    })
    .catch((error) => {
      alert("Error fetching events: " + error.message);
    });
  document.getElementById("EventCode").value = "";
  document.getElementById("EventName").value = "";
}

async function loadCalendarEvents() {
  const eventList = document.getElementById("event-list");
  eventList.innerHTML = ""; // Clear previous content

  try {
    const snapshot = await db.collection("Events").get();

    let events = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      events.push({ id: doc.id, ...data });
    });

    // Sort by date descending
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    events.forEach((event) => {
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("box");

      eventDiv.innerHTML = `
        <h2 class="title is-4">${event.event_name}</h2>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.location.building} Room ${event.location.room}</p>
        <p>${event.description}</p>
      `;

      eventList.appendChild(eventDiv);
    });
  } catch (error) {
    console.error("Error loading calendar events:", error);
    eventList.innerHTML = "<p>Failed to load events.</p>";
  }
}

// Your web app's Firebase configuration
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

//Add a user
//db.collection("Users")
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

// db.collection("Events")
//   .doc("event1")
//   .set({
//     event_name: "Speaker 1",
//     date: "2024-04-15",
//     location: {
//       building: "ABC Hall",
//       room: "101",
//     },
//     description: "An event to network with professionals.",
//     code: CODE1,
//     attendees: ["user1", "user2"],
//   });
