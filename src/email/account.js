const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS
    }
});

/**
 * Sends welcome mail to user.
 * @param {string} email - email of user
 * @param {string} name - name of user
 */

exports.sendWelcomeEmail = async(email, name) => {
    try {
        const info = await transporter.sendMail({
            from: "From 'Niket'",
            to: email,
            subject: "Welcome",
            text: `Welcome to the app ${name}. Let me know how you get along with the app`,
        })
        console.log('Welcome Email sended : %s', info.messageId);
        
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Sends unsubsribe mail to user
 * @param {*} email email of user
 * @param {string} name name of user
 */
exports.sendCancellationEmail = async(email, name) => {
    try {
        const info = await transporter.sendMail({
            from: "From 'Niket'",
            to: email,
            subject: "GoodBye",
            html: `GoodBye <b>${name}</b>. We hope to see you back soon.`,
        })
        console.log('Goodbye Email sended : %s', info.messageId);
        
    } catch (error) {
        console.log(error.message);
    }
}