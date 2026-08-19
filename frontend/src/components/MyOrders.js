import "./myOrders.css";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    FiHome,
    FiSun,
    FiPackage,
    FiLogOut
} from "react-icons/fi";


function MyOrders() {


    const [orders, setOrders] = useState([]);

    const farmer_id = sessionStorage.getItem("user_id");

    const name = sessionStorage.getItem("name");
    const role = sessionStorage.getItem("role");

    const navigate = useNavigate();



    useEffect(() => {


        async function getOrders() {


            try {


                const res = await axios.get(

                    `http://localhost:5000/farmer-orders/${farmer_id}`

                );


                setOrders(res.data);



            }
            catch (error) {

                console.log(error);

            }


        }


        getOrders();


    }, [farmer_id]);




    async function logout() {

        await sessionStorage.clear();

        navigate("/");

    }




    return (

        <div id="dashboard">



            {/* SIDEBAR */}

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



                        <button
                            onClick={() => navigate("/saplings")}
                        >

                            <FiSun />

                            View Saplings

                        </button>




                        <button
                            className="active"
                            onClick={() => navigate("/my-orders")}
                        >

                            <FiPackage />

                            Orders

                        </button>

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







            {/* CONTENT */}


            <main id="content">



                <header id="topbar">


                    <div>

                        <h1>
                            My Orders
                        </h1>


                        <p>
                            Track your purchased saplings.
                        </p>


                    </div>




                    <div id="profile-box">


                        <div id="profile-img">

                            {
                                name ?
                                    name.charAt(0).toUpperCase()
                                    :
                                    "F"
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



                </header>







                <div className="orders-container">





                    {

                        orders.length === 0 ?

                            (

                                <h3>
                                    No orders placed yet
                                </h3>

                            )

                            :

                            (


                                <div className="orders-grid">



                                    {

                                        orders.map((order) => (


                                            <div
                                                className="order-card"
                                                key={order.order_id}
                                            >



                                                <img

                                                    // src={
                                                    //     `http://localhost:5000/uploads/${order.image_url}`
                                                    // }
                                                    src={order.image_url}

                                                    alt="sapling"

                                                />




                                                <div className="order-details">


                                                    <h2>

                                                        {order.sapling_name}

                                                    </h2>




                                                    <p>

                                                        <b>Nursery:</b>

                                                        {order.nursery_name}

                                                    </p>




                                                    <p>

                                                        <b>Quantity:</b>

                                                        {order.quantity}

                                                    </p>




                                                    <p>

                                                        <b>Price:</b>

                                                        ₹ {order.price}

                                                    </p>



                                                    <h3>

                                                        Total: ₹ {order.total_amount}

                                                    </h3>





                                                    <span

                                                        className={

                                                            order.status === "Accepted"

                                                                ?

                                                                "accepted"

                                                                :

                                                                order.status === "Rejected"

                                                                    ?

                                                                    "rejected"

                                                                    :

                                                                    order.status === "Delivered"

                                                                        ?

                                                                        "delivered"

                                                                        :

                                                                        "pending"

                                                        }

                                                    >

                                                        {order.status}

                                                    </span>




                                                    <p className="date">

                                                        {
                                                            new Date(
                                                                order.order_date
                                                            ).toLocaleDateString()
                                                        }

                                                    </p>




                                                </div>




                                            </div>


                                        ))


                                    }


                                </div>


                            )


                    }



                </div>



            </main>


        </div>

    );


}


export default MyOrders;