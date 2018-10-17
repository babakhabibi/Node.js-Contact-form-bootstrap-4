const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// Main route
app.get('/', (req, res) => {
    res.render('contact');
});

// Contact route
app.post('/send', (req, res) => {

    // This will sent to your email
    const output = `
    <p>you have a new email from contact form</p>
    <h3>Contact details</h3>
    <ul>
        <li>Name : ${req.body.name}</li>
        <li>Company : ${req.body.company}</li>
        <li>Email : ${req.body.email}</li>
        <li>Phone : ${req.body.phone}</li>
    </ul>
    <h3>Message :</h3>
    <p> ${req.body.message}</p>
    `;


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: '',
        port: 25,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '', // generated ethereal user
            pass: '' // generated ethereal password
        },
        // I have put this tls thing because I am testing it on my localhost, so if you are not, just remove it.
        tls: {
            rejectUnauthorized: false
        }

    });

    // setup email data with unicode symbols
    // I have remove my account information, obviously you should put your credentials
    let mailOptions = {
        from: '"contact form" <contact@test.com>', // sender address
        to: 'test@gmail.com', // list of receivers
        subject: 'Node contact form', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('contact', {
            msg: 'Email has been sent.'
        })
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });


});

app.listen(3000, () => console.log('I am listening...'));