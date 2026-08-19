import axios from 'axios';
import { useState } from "react";
import './login_reg.css';
import { useNavigate, Link } from "react-router-dom";

function Register() {
    // const [user, setUser] = useState({
    //     name: "",
    //     email: "",
    //     phone: "",
    //     password: "",
    //     role: ""
    // });

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const [errors, setErrors] = useState({});
    const [registerError, setRegisterError] = useState("");

    const navigate = useNavigate();


    function checkValidation() {
        const newErrors = {};
        if (name === "") {
            newErrors.name = "Name is required";
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Invalid email";
        }
        if (phone === "") {
            newErrors.phone = "Phone number is required";
        }
        else if (phone.length !== 10) {
            newErrors.phone = "Phone number must be 10 digits";
        }

        if (password === "") {
            newErrors.password = "Password is required";
        }
        else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (role === "") {
            newErrors.role = "Role is required";
        }
        else if (role !== "Farmer" && role !== "Nursery") {
            newErrors.role = "Invalid role. Please enter 'Farmer' or 'Nursery'.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    async function registerUser() {
        if (!checkValidation()) {
            return;
        }

        try {

            const response = await axios.post("https://nurserymitra.onrender.com/register", {
                name,
                email,
                phone,
                password,
                role
            });
            console.log("User registered successfully:", response.data);
            //stores the user id & role
            sessionStorage.setItem("user_id", response.data.user_id);
            sessionStorage.setItem("role", response.data.role);
            sessionStorage.setItem("name", response.data.name);

            if (response.data.role === "Nursery") {
                navigate("/create_nursery");
            }
            else {
                navigate("/");
            }

            alert(`${response.data.name} registered successfully!`);
        } catch (error) {
            console.error("Error registering user:", error);
            setRegisterError(error.response.data.message || "Error during Registration.");
        }
    }

    return (
        <>

            <div id="form-box">
                <h2>Register</h2><br></br>
                <p className="subtitle">
                    Join NurseryMitra today
                </p>
                <br></br>
                {registerError ? <p className="error">{registerError}</p> : ""}
                <br></br>

                <label>Name: </label><br></br>
                <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                />
                {errors.name ? <p className="error">{errors.name}</p> : ""}
                <br></br>

                <label>Email: </label><br></br>
                <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                {errors.email ? <p className="error">{errors.email}</p> : ""}
                <br></br>

                <label>Phone Number: </label><br></br>
                <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value) }}
                />
                {errors.phone ? <p className="error">{errors.phone}</p> : ""}
                <br></br>
                <label>Password: </label><br></br>
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                {errors.password ? <p className="error">{errors.password}</p> : ""}
                <br></br>
                <label>Role(Farmer/Nursery): </label><br></br>
                <input
                    type="text"
                    placeholder="Enter Role(Farmer,Nursery)"
                    value={role}
                    onChange={(e) => { setRole(e.target.value) }}
                />
                {errors.role ? <p className="error">{errors.role}</p> : ""}
                <br></br>
                <button onClick={registerUser}>Register</button>
                <br></br>

                <p>Already have an account? <Link to="/">Login here</Link></p>
            </div>

        </>
    );
}

export default Register;