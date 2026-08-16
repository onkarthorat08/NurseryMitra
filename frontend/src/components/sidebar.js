import { useNavigate } from "react-router-dom";
import './sidebar.css';

function Sidebar() {

    const navigate = useNavigate();
    const role = sessionStorage.getItem("role");

    function logout() {
        sessionStorage.clear();
        navigate("/");
    }

    return (
        <aside id="sidebar">

            <div id="logo-section">

                <img
                    src="/NurseryMitra.png"
                    alt="logo"
                />

                <h2>NurseryMitra</h2>

                <p>{role} Dashboard</p>

            </div>

            <div id="menu">

                <button onClick={() => navigate("/home")}>
                    Dashboard
                </button>

                {role === "Nursery" && (
                    <>
                        <button onClick={() => navigate("/add-sapling")}>
                            Add Saplings
                        </button>

                        <button onClick={() => navigate("/bulk-upload")}>
                            Bulk Upload
                        </button>

                        <button onClick={() => navigate("/view-saplings")}>
                            View Saplings
                        </button>
                    </>
                )}

                {role === "Farmer" && (
                    <>
                        <button onClick={() => navigate("/saplings")}>
                            View Products
                        </button>

                        <button onClick={() => navigate("/nurseries")}>
                            View Nurseries
                        </button>
                    </>
                )}

                <button onClick={() => navigate("/orders")}>
                    Orders
                </button>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;