fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: "maheshdate08@gmail.com",
        enteredPassword: "mahesh@1234"
    })
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));

