const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",    
    port: 465,
    secure: true,
    auth: {
        user: "thoratonkar06@gmail.com",  //Gmail id
        pass: "zscjuofovkypmklr"     //App Password 
    }
});

module.exports = transporter;
