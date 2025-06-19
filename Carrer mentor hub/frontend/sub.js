function toggleForm() {
  document.getElementById("subscribeForm").style.display = "block";
  document.getElementById("successMessage").style.display = "none";
  document.getElementById("alreadyExistsMessage").style.display = "none";
  clearErrors();
}

function clearErrors() {
  document.getElementById("nameError").style.display = "none";
  document.getElementById("mobileError").style.display = "none";
  document.getElementById("emailError").style.display = "none";
}

function handleSubmit(event) {
  event.preventDefault(); // Prevent default form submission
  clearErrors();

  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();

  let isValid = true;

  if (!/^[A-Za-z\s]+$/.test(name)) {
    document.getElementById("nameError").style.display = "block";
    isValid = false;
  }

  if (!/^\d{10}$/.test(mobile)) {
    document.getElementById("mobileError").style.display = "block";
    isValid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById("emailError").style.display = "block";
    isValid = false;
  }

  if (isValid) {
    document.getElementById("subscribeForm").style.display = "none";

    const mobilen = parseInt(mobile, 10);
    if (uploadData(name, mobilen, email) == 0)
      document.getElementById("successMessage").style.display = "block";
    else
      document.getElementById("alreadyExistsMessage").style.display = "block";

    // Optional: Reset form fields
    document.getElementById("subscribeForm").reset();
  }

  return false; // Still return false to block actual submission
}

async function uploadData(name, mobile, email) {
  const data = {
    username: name,
    mobileno: mobile,
    emailid: email,
  };

  const response = await fetch("http://localhost:3000/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  console.log("sent");
  const result = await response.json();
  if (result.message == 400) {
    return 1;
  }
  return 0;
}
