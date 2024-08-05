require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const authRouter = require("./routes/auth");
const movieRouter = require('./routes/movie');
const theatreRouter = require('./routes/theatre');
const movieScheduleRouter = require('./routes/movieScheduleMapping');
const { authMiddleware } = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(err));

if (!PORT) {
  throw new Error("Port is missing");
}

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware());

app.get('/', (req, res) => {
  res.redirect('/api/v1/movies');
})
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/theatres", theatreRouter);
app.use("/api/v1/movieSchedule", movieScheduleRouter);

app.listen(PORT, () => console.log("Server listening on port", PORT));
