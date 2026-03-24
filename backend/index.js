const express = require('express')
const env = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const userRoutes = require('./routes/user.route')
const doctorRoutes = require('./routes/doctor.route')
const appointmentRoutes = require('./routes/appointment.route')

env.config()
const app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

userRoutes(app);
doctorRoutes(app);
appointmentRoutes(app);


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(process.env.PORT, async () => {
  console.log(`Example app listening on port ${process.env.PORT}`)

  try {
        await mongoose.connect(process.env.DB_URL);
        console.log('successfully connected to mongo db')
    } catch (error) {
        console.log('not able to connect to mongodb',error)
    }
})
