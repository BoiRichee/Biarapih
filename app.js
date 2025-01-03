require("dotenv").config();
// console.log({ env: process.env, secret: process.env.JWT_SECRET_KEY });
const express = require("express")
const app = express()
const port = 3000

const router = require('./routers/index')

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(require("./routers"))


app.listen(port, () => {
      console.log(`Running on port ${port}`)
  })
