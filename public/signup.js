// Get the signup form element by its ID
const signupform = document.getElementById("signupForm");

// Async function to handle user signup
async function signup(name, userId, deviceId, phone, password, coins) {
  try {
    // Create a user object with provided data
    let user = {
      name,
      userId,
      deviceId,
      phone,
      password,
      coins,
    };

    // Send a POST request to the signup API endpoint using axios
    const response = await axios.post("http://localhost:3000/api/signup", user);

    // Log the response data and show a success alert
    console.log(response.data);
    alert("Signup successful");

    // Redirect the user to the login page after successful signup
    window.location.href = "login.html";
  } catch (err) {
    // Show an alert if the user is already registered and redirect to the login page
    alert("User already registered. PLEASE LOGIN");
    window.location.href = "login.html";
  }
}

// Event listener for the form submission
signupform.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Retrieve user input values from the form
  let name = document.getElementById("name").value;
  let userId = document.getElementById("userId").value;
  let deviceId = document.getElementById("deviceId").value;
  let phone = document.getElementById("phone").value;
  let password = document.getElementById("password").value;
  let coins = document.getElementById("coins").value;

  // Call the signup function with the user input values
  signup(name, userId, deviceId, phone, password, coins);

  // Clear the form inputs after submission
  document.getElementById("name").value = "";
  document.getElementById("userId").value = "";
  document.getElementById("deviceId").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("password").value = "";
  document.getElementById("coins").value = "";
});
