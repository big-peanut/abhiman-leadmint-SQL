// Get the login form element by its ID
const loginform = document.getElementById("loginForm");

// Async function to handle user login
async function login(name, userId, password) {
  try {
    // Create a user object with provided login data
    const user = {
      name,
      userId,
      password,
    };

    // Send a POST request to the login API endpoint using axios
    const response = await axios.post("http://localhost:3000/api/login", user);

    // Check if the response contains a message
    if (response.data.message) {
      // Show a success alert for successful login
      alert("Login Successful");

      // Store the authentication token in local storage
      localStorage.setItem("token", response.data.token);

      // Redirect the user to the chat page after successful login
      window.location.href = "chat.html";
    } else {
      // Show an alert for failed login with incorrect credentials
      alert("Login Failed, Incorrect credentials");
    }
  } catch (err) {
    // Log any errors to the console and show a general login failure alert
    console.log(err);
    alert("Login Failed");
  }
}

// Event listener for the form submission
loginform.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Retrieve user input values from the form
  let name = document.getElementById("name").value;
  let userId = document.getElementById("userId").value;
  let password = document.getElementById("password").value;

  // Call the login function with the user input values
  login(name, userId, password);

  // Clear the form inputs after submission
  document.getElementById("name").value = "";
  document.getElementById("userId").value = "";
  document.getElementById("password").value = "";
});
