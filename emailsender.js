import nodemailer from "nodemailer";

// transporter object
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secureConnection: true, // use SSL

    // credential 
    auth: {
        user: "siddharthsingh88505@gmail.com",
        pass: "aryplvhgkfzdnnlb" //google app-specific password
    }

});

export { transporter };
