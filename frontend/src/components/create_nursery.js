import { useState } from "react";
import axios from "axios";
import './login_reg.css';
import { useNavigate } from "react-router-dom";         


function CreateNursery() {
    //taking stored user id
    const user_id = sessionStorage.getItem("user_id");

    const navigate = useNavigate();
    const [nursery_name, setNursery_name] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState({});

    function validateNursery() {
        const newErrors = {};
        if (nursery_name === "") {
            newErrors.nursery_name = "Nursery name is required";
        }
        if (address === "") {
            newErrors.address = "Address is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    async function createNursery() {
        if (!validateNursery()) {
            return;
        }

        try{
            const response = await axios.post(`https://nurserymitra.onrender.com/create-nursery/${user_id}`, {
                nursery_name, address
            });
            sessionStorage.setItem("nursery_id", response.data.nursery_id);
            console.log("Nursery created successfully:", response.data);
            alert("Nursery created successfully!");


            navigate("/home");
        } catch (error) {
            console.error("Error creating nursery:", error);
        }
    }

    return (
        <>
            <div id="form-box">
                <h2>Create Nursery</h2>
                <label>Nursery Name: </label><br></br>
                <input
                    type="text"
                    placeholder="Enter nursery name"
                    value={nursery_name}
                    onChange={(e)=>{setNursery_name(e.target.value)}}
                />
                <br></br>
                {errors.nursery_name ? <p className="error">{errors.nursery_name}</p> : ""} <br></br>
                <label>Address: </label><br></br>
                <input
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e)=>{setAddress(e.target.value)}}
                />
                <br></br>
                {errors.address ? <p className="error">{errors.address}</p> : ""} <br></br>
                <button onClick={createNursery}>Create Nursery</button>
            </div>
        </>
    );
}

export default CreateNursery;
