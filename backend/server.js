const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
require("dotenv").config();
const app = express();


const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

app.use(cors());
app.use(express.json());

let db;
async function startServer() {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log("database connected successfully");
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });

    }
    catch (err) {
        console.log("database connection failed: ", err.message);
    }
}

startServer();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "nurserymitra",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
});

const upload = multer({
    storage: storage
});

//=====register=====//
app.post("/register", async (req, res) => {
    try {

        const { name, email, phone, password, role } = req.body;

        const checkUser = "SELECT * FROM users WHERE email=? OR phone=?";
        const [result] = await db.query(checkUser, [email, phone]);

        if (result.length > 0) {
            return res.status(401).json({
                message: "Email or Phone exists already"
            });
        }

        const hashedPass = await bcrypt.hash(password, 16);

        const insertUser = "INSERT INTO users(name,email,phone,password,role) VALUES(?,?,?,?,?)";
        const [userResult] = await db.query(insertUser, [name, email, phone, hashedPass, role]);

        return res.json({
            user_id: userResult.insertId,
            name,
            email,
            phone,
            hashedPass,
            role
        });

    }
    catch (err) {
        return res.status(404).json({
            message: err.message
        });
    }
});


//================= Login =================//
app.post("/login", async (req, res) => {
    try {
        const { email, enteredPassword } = req.body;
        const chechUser = "SELECT * FROM users WHERE email = ?";
        const [result] = await db.query(chechUser, [email]);


        if (result.length === 0) {
            return res.status(404).json({
                message: "Email is Incorrect or User does not exists !"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(enteredPassword, user.password);

        console.log(isMatch);

        if (isMatch == true) {
            if (user.role === "Nursery") {
                const getNurseryId = "SELECT nursery_id FROM nurseries WHERE user_id = ?";
                const [nurseryResult] = await db.query(getNurseryId, [user.user_id]);
                if (nurseryResult.length > 0) {
                    const nursery_id = nurseryResult[0].nursery_id;
                    return res.json({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                        user_id: user.user_id,
                        nursery_id: nursery_id
                    });
                }
            }

            return res.json({
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                user_id: user.user_id
            });
        }

        return res.status(401).json({
            message: "Password is incorrect ! "
        });

    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
})


// ================= Get All Users =================//
app.get("/register", async (req, res) => {
    const [users] = await db.query("SELECT * FROM users");

    res.json(users);

});


//================Register Nursery=================//
app.post("/create-nursery/:user_id", async (req, res) => {

    try {
        const { nursery_name, address } = req.body;
        const user_id = req.params.user_id;
        const insertNursery = "INSERT INTO nurseries(user_id, nursery_name, address) VALUES(?,?,?)";
        const [result] = await db.query(insertNursery, [user_id, nursery_name, address]);

        res.json({ message: "Nursery created successfully!", nursery_id: result.insertId });

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//============Add Saplings=================//
app.post("/add-sapling/:nursery_id", upload.single("image"), async (req, res) => {
    try {
        const { sapling_name, category, description, price, stock } = req.body;
        const nursery_id = req.params.nursery_id;
        const image = req.file ? req.file.path : null;

        const insertSapling = "INSERT INTO saplings(nursery_id, sapling_name, category, description, price, stock, image_url) VALUES(?,?,?,?,?,?,?)";

        const [result] = await db.query(insertSapling, [nursery_id, sapling_name, category, description, price, stock, image]);
        console.log(result);
        res.json({ message: "Sapling added successfully!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//====================view saplings================//
app.get("/view-saplings/:nursery_id", async (req, res) => {
    try {

        const nursery_id = req.params.nursery_id;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const offset = (page - 1) * limit;

        const countQuery =
            "SELECT COUNT(*) AS total FROM saplings WHERE nursery_id=?";

        const [countResult] = await db.query(countQuery, [nursery_id]);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        const sql = `
            SELECT
                saplings.sapling_id,
                saplings.sapling_name,
                saplings.category,
                saplings.description,
                saplings.price,
                saplings.stock,
                saplings.image_url,
                saplings.nursery_id,
                nurseries.nursery_name,
                nurseries.address
            FROM saplings
            JOIN nurseries ON saplings.nursery_id = nurseries.nursery_id
            WHERE saplings.nursery_id = ?
            LIMIT ? OFFSET ?
        `;

        const [saplings] = await db.query(sql, [
            nursery_id,
            limit,
            offset
        ]);

        res.json({
            data: saplings,
            total,
            page,
            limit,
            totalPages
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

//============== edit sapling ================//
app.put("/edit-sapling/:sapling_id", upload.single("image"), async (req, res) => {
    try {
        const { nursery_id, sapling_name, category, description, price, stock } = req.body;
        const sapling_id = req.params.sapling_id;

        const image = req.file ? req.file.path : null;

        // Only overwrite image_url if a new image was actually uploaded,
        // otherwise keep the existing Cloudinary URL as-is.
        const updateSapling = image
            ? "UPDATE saplings SET sapling_name = ?, category = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE nursery_id = ? AND sapling_id = ?"
            : "UPDATE saplings SET sapling_name = ?, category = ?, description = ?, price = ?, stock = ? WHERE nursery_id = ? AND sapling_id = ?";

        const params = image
            ? [sapling_name, category, description, price, stock, image, nursery_id, sapling_id]
            : [sapling_name, category, description, price, stock, nursery_id, sapling_id];

        const [result] = await db.query(updateSapling, params);

        console.log(result);

        res.status(200).json({
            success: true,
            message: "Sapling updated successfully",
            result
        });


    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
});


// ================= Show Saplings Search + Category + Pagination =================

app.get("/saplings", async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;
        const offset = (page - 1) * limit;

        let search = req.query.search || "";
        let category = req.query.category || "";

        search = `%${search}%`;
        category = category ? category : "%";

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM saplings s
            WHERE s.stock > 0
            AND s.sapling_name LIKE ?
            AND s.category LIKE ?
        `;

        const [countResult] = await db.query(countQuery, [search, category]);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        const sql = `
            SELECT
                s.sapling_id,
                s.sapling_name,
                s.category,
                s.description,
                s.price,
                s.stock,
                s.image_url,
                n.nursery_name,
                n.address
            FROM saplings s
            JOIN nurseries n
            ON s.nursery_id = n.nursery_id
            WHERE s.stock > 0
            AND s.sapling_name LIKE ?
            AND s.category LIKE ?
            ORDER BY s.sapling_id DESC
            LIMIT ? OFFSET ?
        `;

        const [result] = await db.query(sql, [
            search,
            category,
            limit,
            offset
        ]);

        res.json({
            data: result,
            total,
            page,
            limit,
            totalPages
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});



// ================= Bulk Upload =================
app.post("/bulk-upload/:nursery_id", (req, res) => {
    const saplings = req.body.saplings;
    const nursery_id = req.params.nursery_id;
    const values = saplings.map(sapling => [
        nursery_id,
        sapling.sapling_name,
        sapling.category,
        sapling.description,
        sapling.price,
        sapling.stock,
        sapling.image_url
    ]);
    const sql = `
        INSERT INTO saplings(nursery_id, sapling_name, category,description, price, stock, image_url)
        VALUES ? 
    `;
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }



        return res.json({
            message: "Data Uploaded Successfully",
            nursery_id: nursery_id
        });

    });

});

// Get Single Sapling Details

app.get("/sapling/:sapling_id", async (req, res) => {

    try {

        const { sapling_id } = req.params;


        const sql = `
            SELECT 
                s.*,
                n.nursery_name

            FROM saplings s

            JOIN nurseries n
            ON s.nursery_id = n.nursery_id

            WHERE s.sapling_id = ?
        `;


        const [result] = await db.query(
            sql,
            [sapling_id]
        );


        if (result.length === 0) {

            return res.status(404).json({

                message: "Sapling not found"

            });

        }


        res.json(result[0]);


    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server error",
            error: error.message

        });

    }

});



///=====================order====//
// Create Order

app.post("/create-order", async (req, res) => {

    try {

        const {
            farmer_id,
            nursery_id,
            sapling_id,
            quantity,
            price
        } = req.body;


        // Calculate total amount

        const total_amount = quantity * price;


        const sql = `
            INSERT INTO orders
            (
                farmer_id,
                nursery_id,
                sapling_id,
                quantity,
                price,
                total_amount,
                status
            )

            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;


        const [result] = await db.query(
            sql,
            [
                farmer_id,
                nursery_id,
                sapling_id,
                quantity,
                price,
                total_amount,
                "Pending"
            ]
        );


        res.status(201).json({

            message: "Order created successfully",

            order_id: result.insertId,

            total_amount: total_amount

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server error",
            error: error.message

        });

    }

});



// Get Farmer Orders

app.get("/farmer-orders/:farmer_id", async (req, res) => {

    try {

        const { farmer_id } = req.params;


        const sql = `

        SELECT

        o.order_id,
        o.quantity,
        o.price,
        o.total_amount,
        o.status,
        o.order_date,

        s.sapling_name,
        s.image_url,

        n.nursery_name


        FROM orders o


        JOIN saplings s

        ON o.sapling_id = s.sapling_id


        JOIN nurseries n

        ON o.nursery_id = n.nursery_id


        WHERE o.farmer_id = ?


        ORDER BY o.order_date DESC

        `;



        const [result] = await db.query(
            sql,
            [farmer_id]
        );



        res.json(result);



    }
    catch (error) {


        console.log(error);


        res.status(500).json({

            message: "Server error",
            error: error.message

        });


    }

});




//====================delete sapling================//

app.delete("/delete-sapling/:sapling_id", async (req, res) => {
    try {

        const { sapling_id } = req.params;

        // get the sapling first, so we know which Cloudinary image to remove
        const [rows] = await db.query(
            "SELECT image_url FROM saplings WHERE sapling_id = ?",
            [sapling_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Sapling not found"
            });
        }

        const image_url = rows[0].image_url;

        await db.query(
            "DELETE FROM saplings WHERE sapling_id = ?",
            [sapling_id]
        );

        // remove the image from Cloudinary, if it exists
        if (image_url) {
            try {
                // Cloudinary URLs look like:
                // https://res.cloudinary.com/<cloud_name>/image/upload/v12345/nurserymitra/abc123.jpg
                // public_id is "nurserymitra/abc123" (folder + filename, no extension, no version)
                const afterUpload = image_url.split("/upload/")[1]; // "v12345/nurserymitra/abc123.jpg"
                const withoutVersion = afterUpload.split("/").slice(1).join("/"); // "nurserymitra/abc123.jpg"
                const publicId = withoutVersion.replace(/\.[^/.]+$/, ""); // "nurserymitra/abc123"

                await cloudinary.uploader.destroy(publicId);
            } catch (cloudErr) {
                console.log("Cloudinary image delete failed:", cloudErr.message);
            }
        }

        res.json({
            message: "Sapling deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});