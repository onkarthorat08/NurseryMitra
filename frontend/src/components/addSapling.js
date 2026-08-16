import './add_edit.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
    FiHome,
    FiPlusCircle,
    FiUploadCloud,
    FiPackage,
    FiLogOut,
    FiBell,
    FiTrendingUp,
    FiUsers,
    FiSun
} from "react-icons/fi";

function AddSapling() {
    const [saplingName, setSaplingName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);
    const nursery_id = sessionStorage.getItem("nursery_id");

    const navigate = useNavigate();

    const formData = new FormData();
    formData.append('sapling_name', saplingName);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('image', image);

    async function sendSapling() {
        try {
            const res = await axios.post(`http://localhost:5000/add-sapling/${nursery_id}`, formData);
            console.log(res.data);
            alert("Sapling added successfully!");
            navigate("/view-saplings");


        } catch (error) {
            console.error('Error adding sapling:', error);
        }
    }

    const role = sessionStorage.getItem("role");
    const user_id = sessionStorage.getItem("user_id");
    const name = sessionStorage.getItem("name");


    async function logout() {

        await sessionStorage.clear();

        console.log(user_id);

        navigate("/");

    }



    function handleNavigation() {

        if (role === "Farmer") {

            navigate("/saplings");

        }
        else if (role === "Nursery") {

            navigate("/view-saplings");

        }

    }



    function moveToOrders() {

        navigate("/my-orders");

    }



    return (

        <div id="dashboard">


            {/* ================= Sidebar ================= */}


            <aside id="sidebar">


                <div>


                    <div id="logo-section">


                        <img
                            src="/NurseryMitra.png"
                            alt="NurseryMitra"
                        />


                        <h2>
                            NurseryMitra
                        </h2>


                        <span>
                            Smart Nursery Management
                        </span>


                    </div>



                    <div id="menu">


                        <button

                            onClick={() => navigate("/home")}
                        >

                            <FiHome />

                            Dashboard

                        </button>



                        {
                            role === "Nursery" &&

                            <>


                                <button
                                    className="active"
                                    onClick={() => navigate("/add-sapling")}
                                >

                                    <FiPlusCircle />

                                    Add Sapling

                                </button>



                                <button
                                    onClick={() => navigate("/bulk-upload")}
                                >

                                    <FiUploadCloud />

                                    Bulk Upload

                                </button>


                            </>

                        }



                        <button onClick={handleNavigation}>

                            <FiSun />

                            View Saplings

                        </button>



                        {
                            role === "Farmer" &&

                            <>


                                <button
                                    onClick={() => navigate("/my-orders")}>

                                    <FiPlusCircle />

                                    Orders

                                </button>
                            </>

                        }


                        <button
                            className="logout-btn"
                            onClick={logout}
                        >


                            <FiLogOut />

                            Logout
                        </button>

                    </div>

                </div>
            </aside>



            <div id="form-box">


                <h2>Add Sapling</h2>

                {/* Row 1 */}

                <div className="row">

                    <div className="input-group">
                        <label>Sapling Name</label>
                        <input
                            type="text"
                            placeholder="Enter sapling name"
                            value={saplingName}
                            onChange={(e) => setSaplingName(e.target.value)}
                        />
                    </div>

                    {/* <div className="input-group">
                    <label>Category</label>
                    <input
                        type="text"
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    
                </div> */}

                    <div className="input-group">

                        <label>Category</label>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >

                            <option value="">
                                Select Category
                            </option>

                            <option value="Flowering Plants">
                                Flowering Plants
                            </option>

                            <option value="Indoor Plants">
                                Indoor Plants
                            </option>

                            <option value="Outdoor Plants">
                                Outdoor Plants
                            </option>

                            <option value="Fruit Plants">
                                Fruit Plants
                            </option>

                            <option value="Medicinal Plants">
                                Medicinal Plants
                            </option>

                            <option value="Vegetable Plants">
                                Vegetable Plants
                            </option>

                        </select>

                    </div>

                </div>

                {/* Row 2 */}

                <div className="row">

                    <div className="input-group">
                        <label>Price</label>
                        <input
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Stock</label>
                        <input
                            type="number"
                            placeholder="Enter stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>

                </div>

                {/* Row 3 */}

                <div className="row">

                    {/* <div className="input-group">
                    <label>Description</label>
                    <input
                        type="text"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div> */}

                    <div className="input-group">

                        <label>Description</label>

                        <textarea
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>

                    </div>

                    <div className="input-group">
                        <label>Image</label>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>

                </div>

                <button onClick={sendSapling}>
                    Add Sapling
                </button>

            </div>
        </div>
    );
}
export default AddSapling;