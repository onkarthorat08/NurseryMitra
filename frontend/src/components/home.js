import "./home.css";
import { useNavigate } from "react-router-dom";

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


function Home() {

    const navigate = useNavigate();

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
                            className="active"
                            onClick={() => navigate("/home")}
                        >

                            <FiHome />

                            Dashboard

                        </button>



                        {
                            role === "Nursery" &&

                            <>


                                <button
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




                <div id="sidebar-bottom">






                </div>



            </aside>




            {/* ================= Main Content ================= */}



            <main id="content">



                <header id="topbar">



                    <div>


                        <h1>

                            Hello, {name}

                        </h1>


                        <p>

                            Welcome back to your NurseryMitra dashboard.
                            Manage your nursery efficiently.

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
                                        ?
                                        name.charAt(0).toUpperCase()
                                        :
                                        "N"
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





                {/* ================= HERO ================= */}



                <section id="hero-card">



                    <div id="hero-left">



                        <span className="tag">

                            <FiTrendingUp />

                            Nursery Management

                        </span>




                        <h1>

                            Grow Smarter,
                            <br />

                            Sell Better.

                        </h1>



                        <p>

                            Manage saplings, maintain inventory,
                            upload products and monitor your nursery
                            from one powerful dashboard.

                        </p>




                        <div className="hero-buttons">


                            {
                                role === "Nursery" &&

                                <button
                                    className="primary-btn"
                                    onClick={() => navigate("/add-sapling")}
                                >

                                    Add Sapling

                                </button>

                            }



                            <button
                                className="secondary-btn"
                                onClick={handleNavigation}
                            >

                                View Saplings

                            </button>


                        </div>



                    </div>




                    <div id="hero-right">


                        <img
                            src="/NurseryMitra.png"
                            alt="NurseryMitra"
                        />


                    </div>



                </section>







                {/* ================= STATISTICS ================= */}



                <section id="cards">



                    <div className="dashboard-card">


                        <div className="icon green">

                            <FiSun />

                        </div>


                        <div>

                            <h4>
                                Total Saplings
                            </h4>


                            <h2>
                                120
                            </h2>


                            <span>
                                Available Stock
                            </span>


                        </div>


                    </div>





                    <div className="dashboard-card">


                        <div className="icon blue">

                            <FiPackage />

                        </div>



                        <div>

                            <h4>
                                Orders
                            </h4>


                            <h2>
                                35
                            </h2>


                            <span>
                                Pending Orders
                            </span>


                        </div>


                    </div>







                    <div className="dashboard-card">


                        <div className="icon orange">

                            <FiSun />

                        </div>



                        <div>

                            <h4>
                                Categories
                            </h4>


                            <h2>
                                15
                            </h2>


                            <span>
                                Plant Types
                            </span>


                        </div>


                    </div>







                    <div className="dashboard-card">


                        <div className="icon purple">

                            <FiUsers />

                        </div>



                        <div>

                            <h4>
                                Customers
                            </h4>


                            <h2>
                                240
                            </h2>


                            <span>
                                Registered Farmers
                            </span>


                        </div>


                    </div>




                </section>









                {/* ================= QUICK ACTIONS ================= */}



                <section id="quick-actions">



                    <div className="section-title">


                        <h2>
                            Quick Actions
                        </h2>


                        <p>
                            Frequently used shortcuts
                        </p>


                    </div>





                    <div id="action-grid">





                        {
                            role === "Nursery" &&


                            <div
                                className="action-card"
                                onClick={() => navigate("/add-sapling")}
                            >


                                <div className="action-icon">

                                    <FiPlusCircle />

                                </div>


                                <h3>
                                    Add Sapling
                                </h3>


                                <p>
                                    Create a new sapling listing.
                                </p>


                            </div>


                        }








                        {
                            role === "Nursery" &&


                            <div
                                className="action-card"
                                onClick={() => navigate("/bulk-upload")}
                            >


                                <div className="action-icon">

                                    <FiUploadCloud />

                                </div>


                                <h3>
                                    Bulk Upload
                                </h3>


                                <p>
                                    Upload multiple saplings.
                                </p>


                            </div>


                        }







                        <div
                            className="action-card"
                            onClick={handleNavigation}
                        >


                            <div className="action-icon">

                                <FiSun />

                            </div>


                            <h3>
                                View Saplings
                            </h3>


                            <p>
                                Browse all available saplings.
                            </p>


                        </div>









                        <div
                            className="action-card"
                            onClick={moveToOrders}
                        >


                            <div className="action-icon">

                                <FiPackage />

                            </div>


                            <h3>
                                Orders
                            </h3>


                            <p>
                                Manage customer orders.
                            </p>


                        </div>





                    </div>



                </section>




            </main>



        </div>

    );

}


export default Home;