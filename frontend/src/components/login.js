import axios from 'axios'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login_reg.css';

function Login() {

    const [email, setEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();

    function validateUser() {
        const newErrors = {};
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Invalid email";
        }
        if (enteredPassword === "") {
            newErrors.enteredPassword = "Password is required";
        }
        else if (enteredPassword.length < 6) {
            newErrors.enteredPassword = "Password must be at least 6 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function loginUser() {
        if (!validateUser()) {
            return;
        }
        try {
            console.log("sending to backend...");
            const res = await axios.post('https://nurserymitra.onrender.com/login', {
                email, enteredPassword
            });
            console.log(res.data);
            alert("Login Successful ! Welcome " + res.data.name);


            sessionStorage.setItem("user_id", res.data.user_id);
            sessionStorage.setItem("role", res.data.role);
            sessionStorage.setItem("name", res.data.name);
            if (res.data.role === "Nursery") {
                sessionStorage.setItem("nursery_id", res.data.nursery_id);
            }

            console.log("nursery id : ",res.data.nursery_id);

            navigate("/home");

        }
        catch (err) {
            // alert("Login Err: " + err.message);
            setLoginError(err.response.data.message || "An error occurred during login.");
        }
    }
    return (
        <>
            <div id="form-box">
                <img src="/NurseryMitra.png" alt="logo" />

                <h2>Login</h2>

                <p className="subtitle">
                    Welcome back to NurseryMitra
                </p>
                <br></br>
                {loginError ? <p className="error">{loginError}</p> : ""} <br></br>

                <label>Email: </label><br></br>
                <input
                    type="email"
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }} />
                <br></br>
                {errors.email ? <p className="error">{errors.email}</p> : ""} <br></br>

                <label>Password: </label><br></br>
                <input
                    type="password"
                    placeholder='Enter your password'
                    value={enteredPassword}
                    onChange={(e) => {
                        setEnteredPassword(e.target.value)
                    }} />
                <br></br>
                {errors.enteredPassword ? <p className="error">{errors.enteredPassword}</p> : ""} <br></br>

                <button onClick={loginUser}>Login</button>
                <br></br>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </>
    );

}

export default Login;