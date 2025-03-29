document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();  // Prevent form reload

    // Collect form data
    const formData = {
        username: document.getElementById("regUsername").value,
        email: document.getElementById("regEmail").value,
        phone: document.getElementById("regPhone").value,
        course: document.getElementById("regCourse").value,
        password: document.getElementById("regPassword").value
    };

    try {
        // Send data to backend
        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        document.getElementById("registerMessage").textContent = result.message;
        document.getElementById("registerMessage").style.color = "green";
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("registerMessage").textContent = "Error registering student";
        document.getElementById("registerMessage").style.color = "red";
    }
});
