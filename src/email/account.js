const nodemailer = require('nodemailer')
// tjjl tbdv bgcx cobs

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'kevit.niket.bhadeshiya@gmail.com',
        pass: 'tjjl tbdv bgcx cobs'
    }
});

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