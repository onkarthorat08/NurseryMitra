import { useEffect, useState } from "react";
import axios from "axios";
import "./FarmingViewSaplings.css";
import { useNavigate } from "react-router-dom";

import {
    FiHome,
    FiSun,
    FiPackage,
    FiLogOut,
    FiShoppingCart,
    FiSearch
} from "react-icons/fi";


function FarmerViewSaplings() {


    const [products, setProducts] = useState([]);

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);


    // Search values

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");



    // Input values before search button click

    const [searchValue, setSearchValue] = useState("");

    const [categoryValue, setCategoryValue] = useState("");



    const navigate = useNavigate();



    const role = sessionStorage.getItem("role");

    const name = sessionStorage.getItem("name");





    useEffect(() => {


        async function getProducts() {


            try {
                console.log(
                    `https://nurserymitra.onrender.com/saplings?page=${page}&search=${search}&category=${category}`
                );

                const res = await axios.get(

                    `https://nurserymitra.onrender.com/saplings?page=${page}&search=${search}&category=${category}`

                );

                console.log(res.data);


                setProducts(res.data.data);

                console.log(res.data.data);


                setTotalPages(res.data.totalPages);



            }
            catch (err) {

                console.log(err);

            }


        }



        getProducts();



    }, [page, search, category]);







    function handleSearch() {


        setSearch(searchValue);


        setCategory(categoryValue);


        setPage(1);


    }






    async function logout() {


        await sessionStorage.clear();


        navigate("/");


    }






    function moveToOrders() {


        navigate("/my-orders");


    }







    return (

        <div id="dashboard">





            {/* ================= SIDEBAR ================= */}



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
                            className="active"
                            onClick={() => navigate("/saplings")}
                        >

                            <FiSun />

                            View Saplings

                        </button>





                        <button
                            onClick={moveToOrders}
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


            </aside>









            {/* ================= CONTENT ================= */}



            <main id="content">






                <header id="topbar">



                    <div>


                        <h1>

                            Available Saplings

                        </h1>



                        <p>

                            Choose healthy plants from nearby nurseries.

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









                <section className="sapling-section">





                    <div className="section-title">


                        <h2>

                            Explore Plants

                        </h2>


                        <p>

                            Fresh saplings from trusted nurseries

                        </p>


                    </div>









                    {/* SEARCH FILTER */}



                    <div className="filter-box">



                        <input

                            type="text"

                            placeholder="Search sapling name..."

                            value={searchValue}

                            onChange={(e) => setSearchValue(e.target.value)}

                        />







                        <select

                            value={categoryValue}

                            onChange={(e) => setCategoryValue(e.target.value)}

                        >

                            <option value="">
                                All Categories
                            </option>


                            <option value="Flowering Plants">
                                Flowering Plants
                            </option>


                            <option value="Flowers">
                                Flowers
                            </option>


                            <option value="Trees">
                              Trees
                            </option>


                            <option value="Fruit Trees">
                                Fruit Trees
                            </option>


                            <option value="Herbs">
                               Herbs
                            </option>


                            <option value="Vegetable Plants">
                                Vegetable Plants
                            </option>


                        </select>




                        <button

                            onClick={handleSearch}

                        >


                            <FiSearch />

                            Search


                        </button>




                    </div>









                    <div className="product-container">





                        {

                            products.map((item) => (



                                <div

                                    className="product-card"

                                    key={item.sapling_id}

                                >





                                    <img

                                        src={
                                            `https://nurserymitra.onrender.com/uploads/`
                                            +
                                            item.image_url
                                        }

                                        alt={item.sapling_name}

                                    />







                                    <div className="sapling-info">



                                        <p>

                                            <b>

                                                {item.sapling_name}

                                            </b>

                                        </p>




                                        <p>

                                            <b>Category:</b>

                                            {item.category}

                                        </p>




                                        <p>

                                            <b>Price:</b>

                                            ₹{item.price}

                                        </p>




                                        <p>

                                            <b>Stock:</b>

                                            {item.stock}

                                        </p>




                                        <p>

                                            <b>Nursery:</b>

                                            {item.nursery_name}

                                        </p>




                                        <p>

                                            <b>Address:</b>

                                            {item.address}

                                        </p>




                                        <p>

                                            <b>Description:</b>

                                            {item.description}

                                        </p>



                                    </div>








                                    <button

                                        onClick={() => navigate(`/buy-sapling/${item.sapling_id}`)}

                                    >


                                        <FiShoppingCart />

                                        Buy Now


                                    </button>





                                </div>



                            ))


                        }




                    </div>





                </section>









                <div className="pagination">



                    <button

                        disabled={page === 1}

                        onClick={() => setPage(page - 1)}

                    >

                        Previous

                    </button>





                    <span>

                        Page {page} of {totalPages}

                    </span>






                    <button

                        disabled={page === totalPages}

                        onClick={() => setPage(page + 1)}

                    >

                        Next

                    </button>



                </div>








            </main>



        </div>


    );


}


export default FarmerViewSaplings;