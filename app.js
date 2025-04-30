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

let membersData = []; // Global storage
let currentUserIsAdmin = false; // Admin status

// Roster page click handler
r_e("roster").addEventListener("click", async () => {
  // Hide other pages
  ["homepage", "aboutpage", "joinpage", "eventspage", "calendarpage"].forEach(
    (id) => r_e(id).classList.add("is-hidden")
  );
  r_e("rosterpage").classList.remove("is-hidden");

  const rosterContainer = document.querySelector(".member-roster");
  rosterContainer.innerHTML = "";

  try {
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const currentUserDoc = await db
        .collection("Users")
        .doc(currentUser.uid)
        .get();

      const currentUserData = currentUserDoc.data();
      currentUserIsAdmin = currentUserData?.role === "admin";
    }

    const snapshot = await db
      .collection("Users")
      .orderBy("timestamp", "desc")
      .get();

    membersData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id,
    }));

    renderFilteredRoster("", currentUserIsAdmin);
  } catch (error) {
    console.error("Error loading roster:", error);
    rosterContainer.innerHTML = `<p>Failed to load roster data.</p>`;
  }
});

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

    let cardHTML = `
      <div class="card">
        <div class="card-content">
          <p class="title is-5">${member.first_name} ${member.last_name}</p>
          <p><strong>Year:</strong> ${member.year}</p>
          <p><strong>Major:</strong> ${member.major}</p>
    `;

    if (currentUserIsAdmin) {
      cardHTML += `
        <button class="button is-danger is-small delete-member-button" style="margin-top: 10px;">Delete</button>
      `;
    }

    cardHTML += `
        </div>
      </div>
    `;

    memberDiv.innerHTML = cardHTML;
    rosterContainer.appendChild(memberDiv);

    if (currentUserIsAdmin) {
      const deleteButton = memberDiv.querySelector(".delete-member-button");
      deleteButton.addEventListener("click", async () => {
        if (
          confirm(
            `Are you sure you want to delete ${member.first_name} ${member.last_name}?`
          )
        ) {
          try {
            await db.collection("Users").doc(member.uid).delete();
            membersData = membersData.filter((m) => m.uid !== member.uid);
            memberDiv.remove();
            console.log(`${member.first_name} ${member.last_name} deleted.`);
          } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
          }
        }
      });
    }
  });
}

// Leadership button toggle
const leadershipSignedIn =
  localStorage.getItem("leadershipSignedIn") === "true";
const leadershipSignInButton = document.getElementById(
  "leadershipSignInButton"
);
const leadershipSignOutButton = document.getElementById(
  "leadershipSignOutButton"
);

if (leadershipSignedIn) {
  leadershipSignInButton.classList.add("is-hidden");
  leadershipSignOutButton.classList.remove("is-hidden");
} else {
  leadershipSignInButton.classList.remove("is-hidden");
  leadershipSignOutButton.classList.add("is-hidden");
}

// Updated button logic
document.getElementById("rosterSearchBtn").addEventListener("click", () => {
  const searchValue = document.getElementById("rosterSearch").value;
  renderFilteredRoster(searchValue);
});

document.getElementById("rosterResetBtn").addEventListener("click", () => {
  document.getElementById("rosterSearch").value = "";
  renderFilteredRoster("");
});

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

// --------------------------------------------------------- joining
function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get values from form
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const countryCode = document.getElementById("countryCode").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const fullPhoneNumber = `${countryCode}${phoneNumber}`;

  const email = document.getElementById("joinEmail").value;
  const password = document.getElementById("joinPassword").value;
  const year = document.getElementById("yearSelect").value;
  const major = document.getElementById("majorInput").value;

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
          role: "member",
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

// function submitAttendance() {
//   const enteredCode = document.getElementById("EventCode").value;

//   if (!enteredCode) {
//     alert("Please enter an event code.");
//     return;
//   }

//   // Reference to the Events collection in Firestore
//   const eventsRef = db.collection("Events");
//   eventsRef
//     .where("code", "==", enteredCode)
//     .get()
//     .then((querySnapshot) => {
//       if (querySnapshot.empty) {
//         // If no matching event is found
//         alert("No event found with that code.");
//         return;
//       }

//       // If matching event(s) are found
//       querySnapshot.forEach((doc) => {
//         const eventData = doc.data();
//         const eventId = doc.id;

//         // Assuming user is already signed in and their UID is available
//         const userId = firebase.auth().currentUser.uid;

//         // Reference to the Attendance collection
//         const attendanceRef = db.collection("Attendance");

//         // Check if the user has already attended this event
//         attendanceRef
//           .where("user_id", "==", userId)
//           .where("event_id", "==", eventId)
//           .get()
//           .then((attendanceSnapshot) => {
//             if (!attendanceSnapshot.empty) {
//               // If the user has already attended this event
//               alert("You have already attended this event.");
//             } else {
//               // If the user has not attended, add their attendance
//               attendanceRef
//                 .add({
//                   user_id: userId,
//                   event_id: eventId,
//                   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//                 })
//                 .then(() => {
//                   // Update the user's document to add the eventId to their eventsAttended array
//                   const userRef = db.collection("Users").doc(userId);

//                   userRef
//                     .update({
//                       eventsAttended:
//                         firebase.firestore.FieldValue.arrayUnion(eventId),
//                     })
//                     .then(() => {
//                       alert(
//                         "Attendance submitted and event added to your attended list."
//                       );
//                     })
//                     .catch((error) => {
//                       alert("Error updating user data: " + error.message);
//                     });
//                 })
//                 .catch((error) => {
//                   alert("Error submitting attendance: " + error.message);
//                 });
//             }
//           })
//           .catch((error) => {
//             alert("Error checking attendance: " + error.message);
//           });
//       });
//     })
//     .catch((error) => {
//       alert("Error fetching events: " + error.message);
//     });
//   document.getElementById("EventCode").value = "";
//   document.getElementById("EventName").value = "";
// }

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

//
function openLeadershipModal() {
  r_e("leadershipSigninModal").classList.add("is-active");
}

function closeLeadershipModal() {
  r_e("leadershipSigninModal").classList.remove("is-active");
}

function isLeadershipSignedIn() {
  return localStorage.getItem("leadershipSignedIn") === "true";
}

function submitLeadershipSignIn() {
  const email = r_e("leadershipEmail").value;
  const password = r_e("leadershipPassword").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      try {
        const doc = await db.collection("Users").doc(user.uid).get();

        if (doc.exists && doc.data().role === "admin") {
          currentUserIsAdmin = true; // ✅ Make sure this global flag is updated
          localStorage.setItem("leadershipSignedIn", "true");

          closeLeadershipModal();
          leadershipSignInButton.classList.add("is-hidden");
          leadershipSignOutButton.classList.remove("is-hidden");

          alert("Leadership sign-in successful!");
        } else {
          await firebase.auth().signOut(); // Log them out if not admin
          alert("You are not authorized.");
        }
      } catch (err) {
        alert("Failed to check admin status: " + err.message);
      }
    })
    .catch((err) => {
      alert("Leadership sign-in failed: " + err.message);
    });

  // Clear form fields
  document.getElementById("leadershipEmail").value = "";
  document.getElementById("leadershipPassword").value = "";
}

// Leadership sign-out
function leadershipSignOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      localStorage.setItem("leadershipSignedIn", "false");
      alert("Signed out from leadership.");
      leadershipSignInButton.classList.remove("is-hidden");
      leadershipSignOutButton.classList.add("is-hidden");
      location.reload();
    });
}

// Track attendance
async function handleSubmitAttendance(event) {
  event.preventDefault();
  const eventCodeInput = document.getElementById("eventCode").value.trim();
  const user = auth.currentUser;
  if (!user || !eventCodeInput) return;

  const userRef = db.collection("Users").doc(user.uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data();
  const fullName = `${userData.first_name} ${userData.last_name}`;

  // 1. Find the event document by matching the code
  const eventQuery = await db
    .collection("Events")
    .where("code", "==", eventCodeInput)
    .get();
  if (eventQuery.empty) {
    alert("Invalid event code.");
    return;
  }

  const eventDoc = eventQuery.docs[0];
  const eventRef = eventDoc.ref;
  const eventName = eventDoc.data().event_name;

  // 2. Add user full name to the event's attendees array
  await eventRef.update({
    attendees: firebase.firestore.FieldValue.arrayUnion(fullName),
  });

  // 3. Add event name to the user's events_attended array
  await userRef.update({
    events_attended: firebase.firestore.FieldValue.arrayUnion(eventName),
  });

  alert("Attendance recorded successfully.");
  document.getElementById("eventCode").value = "";
}

//puppeteer
const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50, // Optional: slows down interactions for debugging
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Navigate to the page
  await page.goto("http://127.0.0.1:5501/index.html#");
  await page.waitForSelector("#joinpage", { visible: true });

  // Log the page content for debugging
  const content = await page.content();
  console.log(content);

  // Fill out the form
  await page.type("#firstName", "John");
  await page.type("#lastName", "Doe");
  await page.type("#joinEmail", "johndoe@example.com");
  await page.type("#phoneNumber", "1234567890");
  await page.type("#joinPassword", "password123");
  await page.select("#yearSelect", "Sophomore");
  await page.type("#majorInput", "Computer Science");

  // Submit the form
  await page.click("#join-form button[type='submit']");

  // Wait for "Thank You" message
  await page.waitForSelector("#thank-you", { visible: true });

  console.log("Form submitted successfully!");

  // Close the browser after a few seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await browser.close();
}

go();

async function testRosterSearch() {
  const browser = await puppeteer.launch({ headless: false }); // headless: false so you can see it
  const page = await browser.newPage();

  // Open your local server
  await page.goto("http://127.0.0.1:5501/index.html", {
    waitUntil: "networkidle0",
  });

  // Wait for the search input and button to load
  await page.waitForSelector("#rosterSearch");
  await page.waitForSelector("#rosterSearchBtn");

  // Type into the search input
  await page.type("#rosterSearch", "RMIS");
  //delay
  await new Promise((r) => setTimeout(r, 1000));

  // Click the search button
  await page.click("#rosterSearchBtn");

  // Wait for the DOM to update (may need to adjust this depending on how fast your filter runs)
  await page.waitForTimeout(1000);

  // Optional: Take a screenshot of the result
  await page.screenshot({ path: "filtered_roster.png" });

  await browser.close();
}

testRosterSearch();
