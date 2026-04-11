const express = require('express')
const env = require('dotenv')

env.config()

const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/auth.route')
const doctorRoutes = require('./routes/doctor.route')
const appointmentRoutes = require('./routes/appointment.route')
const paymentRoutes = require('./routes/payment.route')   

const app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

authRoutes(app);
doctorRoutes(app);
appointmentRoutes(app);
paymentRoutes(app);   // ADDED: register payment routes

app.listen(process.env.PORT, async () => {
  console.log(`Example app listening on port ${process.env.PORT}`)

  try {
        await mongoose.connect(process.env.DB_URL);
        console.log('successfully connected to mongo db')
    } catch (error) {
        console.log('not able to connect to mongodb',error)
    }
})