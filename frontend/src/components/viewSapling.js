import { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";
import "./viewSaplings.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FiHome,
    FiSun,
    FiPackage,
    FiLogOut,
    FiPlusCircle,
    FiUploadCloud,
    FiBell,
    FiMapPin,
    FiTag,
    FiEdit2,
    FiTrash2,
    FiBox
} from "react-icons/fi";


function ViewSaplings() {

    const [saplings, setSaplings] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const [page, setPage] = useState(1);
    const limit = 5;
    const [totalPages, setTotalPages] = useState(1);

    const role = sessionStorage.getItem("role");
    const name = sessionStorage.getItem("name");


    useEffect(() => {

        const nursery_id = sessionStorage.getItem("nursery_id");
        setLoading(true);

        axios.get(
            `http://localhost:5000/view-saplings/${nursery_id}?page=${page}&limit=${limit}`
        )
            .then((res) => {

                setSaplings(res.data.data);
                setTotalPages(res.data.totalPages);
                setLoading(false);

            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });

    }, [page]);


    async function logout() {

        await sessionStorage.clear();
        navigate("/");

    }


    function moveToOrders() {

        navigate("/my-orders");

    }


    async function handleDelete(sapling_id) {

        const confirmDelete = window.confirm("Delete this sapling?");

        if (!confirmDelete) return;

        try {

            await axios.delete(`http://localhost:5000/delete-sapling/${sapling_id}`);

            alert("Sapling deleted successfully");

            window.location.reload();

        } catch (err) {

            console.log(err);

        }

    }


    function isActive(path) {

        return location.pathname === path ? "active" : "";

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
                            className={isActive("/home")}
                            onClick={() => navigate("/home")}
                        >

                            <FiHome />

                            Dashboard

                        </button>


                        {
                            role === "Nursery" &&

                            <>

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

                            </>

                        }


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


            </aside>




            {/* ================= Main Content ================= */}


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


                    <div id="profile">

                        <div id="notification">

                            <FiBell />

                        </div>

                        <div id="profile-box">

                            <div id="profile-img">

                                {
                                    name
                                        ? name.charAt(0).toUpperCase()
                                        : "F"
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


                <section className="sapling-section">


                    <div className="section-title">

                        <h2>
                            Explore Plants
                        </h2>

                        <p>
                            Fresh saplings from trusted nurseries
                        </p>

                    </div>


                    {
                        loading &&

                        <div className="state-box">

                            <div className="spinner"></div>

                            <p>Loading saplings...</p>

                        </div>

                    }


                    {
                        !loading && saplings.length === 0 &&

                        <div className="state-box">

                            <FiBox className="state-icon" />

                            <p>No saplings found.</p>

                            <span>Check back later or try a different page.</span>

                        </div>

                    }


                    {
                        !loading && saplings.length > 0 &&

                        <div className="product-container">

                            {

                                saplings.map((item) => (

                                    <div
                                        className="product-card"
                                        key={item.sapling_id}
                                    >

                                        <div className="product-img-wrap">

                                            <img
                                                src={
                                                    `http://localhost:5000/uploads/`
                                                    + item.image_url
                                                }
                                                alt={item.sapling_name}
                                            />

                                        </div>


                                        <div className="sapling-info">

                                            <div className="sapling-title-row">

                                                <h3>
                                                    {item.sapling_name}
                                                </h3>

                                                <span className="price-tag">
                                                    ₹{item.price}
                                                </span>

                                            </div>

                                            <p className="sapling-desc">
                                                {item.description}
                                            </p>

                                            <div className="sapling-meta">

                                                <span>
                                                    <FiTag />
                                                    {item.category}
                                                </span>

                                                <span>
                                                    <FiHome />
                                                    {item.nursery_name}
                                                </span>

                                                <span>
                                                    <FiMapPin />
                                                    {item.address}
                                                </span>

                                                <span>
                                                    <FiBox />
                                                    Stock: {item.stock}
                                                </span>

                                            </div>

                                        </div>


                                        <div className="card-actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() => navigate(`/edit-sapling/${item.sapling_id}`)}
                                            >

                                                <FiEdit2 />

                                                Edit

                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(item.sapling_id)}
                                            >

                                                <FiTrash2 />

                                                Delete

                                            </button>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    }


                </section>


                {
                    !loading && saplings.length > 0 &&

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

                }


            </main>


        </div>

    );
}

export default ViewSaplings;