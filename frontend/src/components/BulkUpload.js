import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./home.css";
import "./bulkupload.css";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FiHome,
    FiSun,
    FiPackage,
    FiLogOut,
    FiPlusCircle,
    FiUploadCloud,
    FiBell
} from "react-icons/fi";


function BulkUpload() {

    const [data, setData] = useState([]);
    const nursery_id = sessionStorage.getItem("nursery_id");
    console.log(nursery_id);

    const navigate = useNavigate();
    const location = useLocation();

    const role = sessionStorage.getItem("role");
    const name = sessionStorage.getItem("name");


    // Read Excel File
    const handleFile = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {

            const workbook = XLSX.read(event.target.result, {
                type: "binary",
            });

            const sheetName = workbook.SheetNames[0];

            const sheet = workbook.Sheets[sheetName];

            const excelData = XLSX.utils.sheet_to_json(sheet);

            console.log(excelData);

            setData(excelData);

        };

        reader.readAsBinaryString(file);

    };


    // Upload Data
    const uploadData = async () => {

        try {
            console.log("Uploading...");

            const res = await axios.post(
                `http://localhost:5000/bulk-upload/${nursery_id}`,
                {
                    saplings: data,
                }
            );
            console.log(res.data.message);
            alert(res.data.message);

        } catch (err) {

            console.log(err.message);

        }

    };


    async function logout() {

        await sessionStorage.clear();
        navigate("/");

    }


    function moveToOrders() {

        navigate("/my-orders");

    }


    function isActive(path) {

        return location.pathname === path ? "active" : "";

    }


    // Table headers, taken from the excel file itself
    const columns = data.length > 0 ? Object.keys(data[0]) : [];


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
                            className={isActive("/home")}
                            onClick={() => navigate("/home")}
                        >

                            <FiHome />

                            Dashboard

                        </button>


                        <button
                            className={isActive("/add-sapling")}
                            onClick={() => navigate("/add-sapling")}
                        >

                            <FiPlusCircle />

                            Add Sapling

                        </button>


                        <button
                            className={isActive("/bulk-upload")}
                            onClick={() => navigate("/bulk-upload")}
                        >

                            <FiUploadCloud />

                            Bulk Upload

                        </button>


                        <button
                            className={isActive("/view-saplings")}
                            onClick={() => navigate("/view-saplings")}
                        >

                            <FiSun />

                            View Saplings

                        </button>


                        {
                            role === "Farmer" &&

                            <>
                                <button
                                    className={isActive("/my-orders")}
                                    onClick={moveToOrders}
                                ></button>


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


            </aside >




        {/* ================= Main Content ================= */ }


        < main id = "content" >


                <header id="topbar">

                    <div>

                        <h1>
                            Bulk Upload
                        </h1>

                        <p>
                            Upload multiple saplings at once using an Excel file.
                        </p>

                    </div>


                    <div id="profile">

                        <div id="notification">

                            <FiBell />

                        </div>

                        <div id="profile-box">

                            <div id="profile-img">

                                {
                                    name
                                        ? name.charAt(0).toUpperCase()
                                        : "N"
                                }

                            </div>

                            <div>

                                <h3>
                                    {name}
                                </h3>

                                <span>
                                    {role}
                                </span>

                            </div>

                        </div>

                    </div>

                </header>


                <section className="upload-section">

                    <div className="upload-box">

                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFile}
                        />

                        <button
                            className="upload-btn"
                            onClick={uploadData}
                        >

                            <FiUploadCloud />

                            Upload

                        </button>

                    </div>


                    {
                        data.length > 0 &&

                        <div className="table-wrap">

                            <table>

                                <thead>

                                    <tr>

                                        {
                                            columns.map((col) => (

                                                <th key={col}>
                                                    {col}
                                                </th>

                                            ))
                                        }

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        data.map((item, index) => (

                                            <tr key={index}>

                                                {
                                                    columns.map((col) => (

                                                        <td key={col}>
                                                            {item[col]}
                                                        </td>

                                                    ))
                                                }

                                            </tr>

                                        ))
                                    }

                                </tbody>

                            </table>

                        </div>

                    }

                </section>


            </main >


        </div >

    );
}

export default BulkUpload;