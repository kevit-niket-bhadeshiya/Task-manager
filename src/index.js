const express = require('express')
const connectDB = require('./db/mongoose');

// Paths of routes
const userRouter = require('./components/user/routers/user');
const taskRouter = require('./components/task/routers/task')


const app = express();
const port = process.env.PORT || 3000

// connect to database
connectDB();

app.use(express.json())  // it automatically parse incoming object to a json.

// set middleware for routes
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log("Server is up on port", port);
})

