// DOM elements
const logout = document.getElementById("logout");
const createGroup = document.getElementById("createRoom");
const buyPrime = document.getElementById("buyPrime");
const chatMessagesContainer = document.getElementById("chatMessages");

// Connect to the server using Socket.IO
const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("connected");
});

// Function to retrieve and display messages for the current chat room
async function getMessage() {
  try {
    // Retrieve the room ID from local storage
    const roomId = localStorage.getItem("roomId");

    // Fetch messages for the current room from the server
    const messages = await axios.get(
      `http://localhost:3000/api/getMessage/${roomId}`
    );

    // Clear the chat messages container
    chatMessagesContainer.innerHTML = "";

    // Display each message in the chat messages container
    messages.data.messages.forEach((message) => {
      displayMessage(message.message);
    });
  } catch (err) {
    console.log(err);
  }
}

// Function to display  message in the chat
function displayMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.textContent = message;
  chatMessagesContainer.appendChild(messageElement);
}

// Socket.IO event listener for incoming messages
socket.on("message", (message) => {
  console.log(message);
  displayMessage(message);
});

// Function to add a new message to the current chat room
async function addMessage(message, roomId) {
  try {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");

    // Send a request to the server to add the message to the database
    const response = await axios.post(
      "http://localhost:3000/api/addMessage",
      { message, roomId },
      { headers: { Authorization: token } }
    );
  } catch (err) {
    console.log(err);
  }
}

// Function to send a message to the current chat room
function sendMessage(message, roomId) {
  // Add the message to the database
  addMessage(message, roomId);

  // Emit the message to other users in the room via Socket.IO
  socket.emit("message", message);

  // Display the message locally in the chat window
  displayMessage(message);
}

// Event listener for the send button
document.getElementById("sendButton").addEventListener("click", (event) => {
  event.preventDefault();

  // Retrieve the message and room ID from the input fields
  const message = document.getElementById("messageInput").value;
  const roomId = localStorage.getItem("roomId");

  // Send the message to the server and display it locally
  sendMessage(message, roomId);

  // Clear the message input field
  document.getElementById("messageInput").value = "";
});

// Function to check if the user is a member of a specific chat room
async function checkRoomMembership(roomId) {
  try {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");

    // Send a request to the server to check membership status
    const res = await axios.get(
      `http://localhost:3000/api/checkRoomMembership/${roomId}`,
      { headers: { Authorization: token } }
    );

    // Return the membership status
    return res.data.ismember;
  } catch (err) {
    console.log(err);
  }
}

// Function to check if a chat room is full based on the number of members
async function roomIsFull(roomId) {
  try {
    // Send a request to the server to get the count of room members
    const response = await axios.get(
      `http://localhost:3000/api/countRoomMembers/${roomId}`
    );

    // Return whether the room is full or not
    return response.data.isFull;
  } catch (err) {
    console.log(err);
  }
}

// Function to retrieve the count of non-prime members in a room
async function nonPrimeRoomCount() {
  try {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");

    // Send a request to the server to get the count of non-prime room members
    const response = await axios.get(
      "http://localhost:3000/api/countNonPrimeRoomMember",
      { headers: { Authorization: token } }
    );

    // Return the count of non-prime room members
    return response.data.count;
  } catch (err) {
    console.log(err);
  }
}

// Function to allow non-prime users to join a room
async function nonPrimeJoinRoom() {
  try {
    // Retrieve the room ID from local storage
    const roomId = localStorage.getItem("roomId");

    // Check if the room is full
    const isFull = await roomIsFull(roomId);

    if (!isFull) {
      // Check if the user is already a member of the room
      const ismember = await checkRoomMembership(roomId);

      if (ismember) {
        // If the user is already a member, show a message and display the chat
        alert("You are a member, JOIN NOW!!");
        getMessage();
        const chatModal = new bootstrap.Modal(
          document.getElementById("chatModal")
        );
        chatModal.show();
        return;
      }

      // If the user is not a member, prompt for the room password
      const password = prompt("Enter Room Password");

      if (password) {
        // Retrieve user token from local storage
        const token = localStorage.getItem("token");

        // Send a request to the server to join the room with the provided password
        const response = await axios.post(
          `http://localhost:3000/api/joinroom/${roomId}`,
          { password },
          { headers: { Authorization: token } }
        );

        // Display appropriate alert based on the server response
        if (response.data.success) {
          alert(`${response.data.msg}`);
          getMessage();
          const chatModal = new bootstrap.Modal(
            document.getElementById("chatModal")
          );
          chatModal.show();
        } else {
          alert(response.data.msg);
        }
      }
    } else {
      // Alert if the room is full
      alert("Room is Full");
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to deduct coins from the user's account
async function deductCoins(coins) {
  try {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");

    // Send a request to the server to deduct coins
    const response = await axios.post(
      "http://localhost:3000/api/deductCoins",
      { coins },
      {
        headers: { Authorization: token },
      }
    );

    // Return the success status of the coin deduction
    return response.data.success;
  } catch (err) {
    console.log(err);
  }
}

// Function to join a room
async function joinRoom(roomId) {
  try {
    // Check if the user is a prime user
    const isPrime = await checkPrimeUser();

    // Check if the user is already a member of the room
    const ismember = await checkRoomMembership(roomId);

    if (isPrime || ismember) {
      // If the user is a prime user or already a member, check room availability
      const isFull = await roomIsFull(roomId);

      if (!isFull) {
        // If the room is not full, proceed to join the room
        localStorage.setItem("roomId", roomId);
        const token = localStorage.getItem("token");

        if (ismember) {
          // If the user is already a member, show a message and display the chat
          alert("You are already a member. JOINED ROOM!!!");
          getMessage();
          const chatModal = new bootstrap.Modal(
            document.getElementById("chatModal")
          );
          chatModal.show();
          return;
        }

        // Prompt for the room password
        const password = prompt("Enter room password:");

        if (password) {
          // Send a request to the server to join the room with the provided password
          const response = await axios.post(
            `http://localhost:3000/api/joinroom/${roomId}`,
            { password },
            { headers: { Authorization: token } }
          );

          // Display appropriate alert based on the server response
          console.log(response.data.success);

          if (response.data.success) {
            alert(`${response.data.msg}`);
            getMessage();
            const chatModal = new bootstrap.Modal(
              document.getElementById("chatModal")
            );
            chatModal.show();
          } else {
            alert(response.data.msg);
          }
        }
      } else {
        // Alert if the room is full
        alert("Room is Full");
      }
    } else {
      // If the user is not a prime user, check the count of non-prime room memberships
      const count = await nonPrimeRoomCount();

      if (count >= 1) {
        // If the user has already joined a free room, prompt to buy prime or spend coins
        const choice = confirm(
          "You have already joined 1 free room. Buy Prime or spend 150 coins to join more rooms."
        );

        if (choice) {
          // If the user chooses to spend coins, deduct 1 coin and attempt to join the room again
          localStorage.setItem("roomId", roomId);
          const paymentSuccess = await deductCoins(150);
          if (paymentSuccess) {
            nonPrimeJoinRoom();
          } else {
            alert("Payment failed");
          }
        }
      } else {
        // If the user has not joined any free rooms, attempt to join a non-prime room
        nonPrimeJoinRoom();
      }
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to view the profile of a user
async function viewProfile(userId) {
  try {
    // Send a request to the server to fetch user profile information
    const response = await axios.get(
      `http://localhost:3000/api/profile/${userId}`
    );
    const user = response.data.userProfile;

    // Populate the modal with user information
    const modalUserName = document.getElementById("modalUserName");
    const modalUserCoins = document.getElementById("modalUserCoins");
    const modalUserMembership = document.getElementById("modalUserMembership");

    if (modalUserName && modalUserCoins) {
      modalUserName.innerText = user.name;
      modalUserCoins.innerText = user.coins;

      // Set membership status based on whether the user is a prime member
      if (user.isPrime) {
        modalUserMembership.innerText = "Prime Member";
      } else {
        modalUserMembership.innerText = "Non-Prime Member";
      }
    }

    // Show the modal
    const userProfileModal = new bootstrap.Modal(
      document.getElementById("userProfileModal")
    );
    userProfileModal.show();
  } catch (err) {
    console.log(err);
  }
}

// Function to display user information on the navbar
async function displayUserInfo() {
  try {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");

    // Send a request to the server to fetch user information
    const response = await axios.get("http://localhost:3000/api/getUser", {
      headers: { Authorization: token },
    });

    // Extract user details from the response
    const userId = response.data.user.id;
    localStorage.setItem("userId", userId);
    const userName = response.data.user.name;
    const userCoins = response.data.user.coins;

    // Display user name and coins on the navbar
    const userNameElement = document.getElementById("userName");
    const userCoinsElement = document.getElementById("userCoins");

    if (userNameElement && userCoinsElement) {
      userNameElement.innerText = `Welcome, ${userName}`;
      userCoinsElement.innerText = `Coins: ${userCoins}`;
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to display the list of friends
async function displayFriends() {
  try {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");

    // Send a request to the server to fetch the user's friends
    const response = await axios.get("http://localhost:3000/api/getFriends", {
      headers: { Authorization: token },
    });

    // Extract friends from the response and display them in a list
    const friends = response.data.friends;
    const friendsList = document.getElementById("friendsList");
    friendsList.innerHTML = "";

    friends.forEach((friend) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = friend.name;
      friendsList.appendChild(listItem);
    });
  } catch (err) {
    console.log(err);
  }
}

// Function to send a friend request to another user
async function addFriend(receiverId) {
  try {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");

    // Send a request to the server to add the specified user as a friend
    const response = await axios.post(
      "http://localhost:3000/api/addFriend",
      { receiverId },
      { headers: { Authorization: token } }
    );

    // Display a success message if the friend request is successful
    if (response.data.success) {
      alert("You are now friends");
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to display a list of users with options to view profiles and add friends
async function displayUsers(users) {
  const userList = document.getElementById("userList");

  // Clear previous user list
  userList.innerHTML = "";

  users.forEach((user) => {
    if (user.id == localStorage.getItem("userId")) {
      return;
    }
    const listItem = document.createElement("li");
    listItem.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    listItem.innerHTML = `<span>${user.name}</span>
                             <button class="btn btn-primary mx-2" onclick="viewProfile('${user.id}')">View Profile</button>
                             <button class="btn btn-success" onclick="addFriend('${user.id}')">Add Friend</button>`;
    userList.appendChild(listItem);
  });
}

// Function to fetch and display all users
async function getAllUsers() {
  try {
    // Send a request to the server to get a list of all users
    const response = await axios.get("http://localhost:3000/api/getAllUsers");
    const users = response.data.allUsers;
    displayUsers(users);
  } catch (err) {
    console.log(err);
  }
}

// Function to display a list of chat rooms with options to join
async function displayRooms() {
  try {
    // Send a request to the server to get a list of all chat rooms
    const response = await axios.get("http://localhost:3000/api/getchatrooms");
    const rooms = response.data.allRooms;

    // Get the room list element
    const roomList = document.getElementById("roomList");

    // Clear previous room list
    roomList.innerHTML = "";

    // Check if there are rooms to display
    if (rooms.length === 0) {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = "No rooms available.";
      roomList.appendChild(listItem);
    } else {
      // Iterate through rooms and create list items
      rooms.forEach((room) => {
        const listItem = document.createElement("li");
        listItem.classList.add(
          "list-group-item",
          "d-flex",
          "justify-content-between",
          "align-items-center"
        );

        listItem.innerHTML = `<span>${room.name}</span>
                             
                             <button class="btn btn-success" onclick="joinRoom(${room.id})">Join</button>`;
        roomList.appendChild(listItem);
      });
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to create a new chat room
async function createRoom() {
  try {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");

    // Prompt user for room details
    const roomName = prompt("Enter room name:");
    const roomId = prompt("Enter room ID:");
    const password = prompt("Enter password:");

    // If user provides valid details, send a request to create the room
    if (roomName && roomId && password) {
      const response = await axios.post(
        "http://localhost:3000/api/chatrooms",
        {
          roomName,
          roomId,
          password,
        },
        { headers: { Authorization: token } }
      );
      displayRooms();
      console.log(response);
      alert("Room created ");
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to check if the current user is a prime member
async function checkPrimeUser() {
  try {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");

    // Send a request to the server to check if the user is a prime member
    const response = await axios.get("http://localhost:3000/api/getUser", {
      headers: { Authorization: token },
    });

    // Extract the user's prime status from the response
    const isPrime = response.data.user.isPrime;
    return isPrime;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Event listener for the "Create Room" button, allowing only prime members to create rooms
createGroup.addEventListener("click", async (event) => {
  event.preventDefault();
  if (await checkPrimeUser()) {
    const flag = confirm("You want to Create a Room?");
    if (flag) {
      createRoom();
    }
  } else {
    alert("You have to be a prime member to create a room");
  }
});

// Event listener for the "Logout" button
logout.addEventListener("click", (event) => {
  event.preventDefault();
  const isConfirmed = confirm("Are you sure you want to logout?");
  if (isConfirmed) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "login.html";
  }
});

// Function to update UI for premium users
function updateUIForPremiumUser() {
  const buyPrime = document.getElementById("buyPrime");
  if (buyPrime) {
    buyPrime.innerText = "Prime User";
    buyPrime.style.color = "yellow";
  }
}

// Function to handle the process of buying premium membership
async function buyPremium() {
  try {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");
    console.log(token);
    console.log("before req");

    // Send a request to the server to purchase premium membership
    const response = await axios.post(
      "http://localhost:3000/api/buyPrime",
      {},
      { headers: { Authorization: token } }
    );

    console.log("request sent");

    // Display a success message if the user is now a prime member
    if (await checkPrimeUser()) {
      updateUIForPremiumUser();
      alert("You are a prime member");
    }
  } catch (err) {
    console.log(err);
  }
}

// Event listener for the "Buy Prime" button
buyPrime.addEventListener("click", (event) => {
  event.preventDefault();
  const isConfirmed = confirm("Are you sure you want to buy prime?");
  if (isConfirmed) {
    buyPremium();
  }
});

// Event listener triggered when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Update UI for premium users
  if (await checkPrimeUser()) {
    updateUIForPremiumUser();
  }

  // Display available chat rooms, user information, and friends
  displayRooms();
  getAllUsers();
  displayUserInfo();
  displayFriends();
});
