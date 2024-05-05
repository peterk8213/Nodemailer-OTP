const express = require('express');
const app = express();
const cors = require('cors');
const{ emailVerification }= require('./controllers/index');
const connectDB = require('./db/connect');
const port = process.env.PORT|| 8000



require('dotenv').config()


app.use(express.json());
app.use(express.urlencoded({ extended:  false }));

app.use(cors());


app.use(express.static('./frontend'))
app.get('/', (req, res) => {
  res.send('Simple otp verification');
});


// express rate limiter
const rateLimiter = require('express-rate-limit');


const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
      msg: 'Too many requests from this IP, please try again after 15 minutes'
    }
  });


app.set('trust proxy', 1)
// post route

app.post('/api/users/request-otp',apiLimiter,emailVerification)

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}....`);
        });
    } catch (error) {
        console.log(error);
        
    }
}

start();
