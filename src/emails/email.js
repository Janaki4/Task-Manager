const nodeMailer = require('nodemailer')



// function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodeMailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'janakiraman781@gmail.com', // generated ethereal user
            pass: '41254125', // generated ethereal password
        },
    })

let mailFunc = function () { 
 transporter.sendMail({
        from: 'janakiraman',
        to: "janakiraman4125@gmail.com",
        subject: 'Welcome',
        text:'Hello, Keep grinding'
    })
}
mailFunc()

// module.exports=emailTemplate
