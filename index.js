const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully 🚀"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const errorHandler = require("./middlewares/errorhandler");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("🚀 Welcome to the Secure Auth Lab");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT} 🚀`);
});
