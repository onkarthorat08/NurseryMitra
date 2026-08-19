import "./buySapling.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


function BuySapling() {

    const { sapling_id } = useParams();

    const navigate = useNavigate();


    const [sapling, setSapling] = useState(null);

    const [quantity, setQuantity] = useState(1);

    // const farmer_id = sessionStorage.getItem("user_id");

    useEffect(() => {

        async function getSapling() {

            try {

                const res = await axios.get(
                    `http://localhost:5000/sapling/${sapling_id}`
                );

                setSapling(res.data);

            }
            catch (error) {

                console.log(error);

            }

        }


        getSapling();


    }, [sapling_id]);

    async function placeOrder() {


        const farmer_id =
            sessionStorage.getItem("user_id");


        await axios.post(
            "https://nurserymitra.onrender.com/create-order",
            {

                farmer_id: farmer_id,

                nursery_id: sapling.nursery_id,

                sapling_id: sapling.sapling_id,

                quantity: quantity,

                price: sapling.price

            }
        );


        alert("Order placed successfully");

        navigate("/my-orders");

    }



    if (!sapling) {

        return <h2>Loading...</h2>;

    }



    return (

        <div className="buy-container">


            <div className="plant-card">


                <img

                    // src={
                    //     `http://localhost:5000/uploads/${sapling.image_url}`
                    // }
                    src={sapling.image_url}

                    alt="plant"

                />


                <div className="plant-details">


                    <h1>
                        {sapling.sapling_name}
                    </h1>


                    <h3>
                        Category:
                        {sapling.category}
                    </h3>


                    <p>
                        {sapling.description}
                    </p>



                    <h2>
                        ₹ {sapling.price}
                    </h2>



                    <label>
                        Quantity
                    </label>


                    <input

                        type="number"

                        min="1"

                        value={quantity}

                        onChange={
                            (e) => setQuantity(e.target.value)
                        }

                    />



                    <h3>
                        Total Amount:
                        ₹ {quantity * sapling.price}
                    </h3>



                    <button
                        onClick={placeOrder}
                    >

                        Place Order

                    </button>


                </div>


            </div>


        </div>

    );

}


export default BuySapling;