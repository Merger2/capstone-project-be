const express = require("express");
const dbConnect = require("./src/CONFIG/dbConnect");
const { notFound, handleError } = require("./src/middlewares/errorHandler");
const userRouter = require("./src/routes/userRoutes");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const googleRouter = require("./src/routes/googleRoutes");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const passportSetup = require("./src/utils/passport");
const tutCatRouter = require("./src/routes/tutCatRoutes");
const tutorialRouter = require("./src/routes/tutorialRoutes");
const newsLetterRouter = require("./src/routes/newsLetterRoutes");
const reviewRouter = require("./src/routes/reviewsRouter");
const videoRouter = require("./src/routes/videoRoutes");
const blogCatRouter = require("./src/routes/blogCatRoutes");
const blogRouter = require("./src/routes/blogRoutes");
const quizRouter = require("./src/routes/quizRoutes");
const cors = require("cors");
const multer = require("multer");
const fs = require('fs');
const path = require('path');

// Membuat folder images jika belum ada
const dir = path.join(__dirname, 'images');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // Folder tempat gambar disimpan, sesuaikan dengan nama folder Anda
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nama file unik
  }
});

// Filter untuk tipe file gambar yang diizinkan
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Hanya menerima file gambar JPEG atau PNG
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG are allowed'), false);
  }
};


app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Jika Anda menggunakan cookies atau session
  })
);

app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin); // Cek apakah origin sesuai
  next();
});

dbConnect();
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 12 * 60 * 60,
    }),
  })
);


app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send(
    `<a href="https://api-lms-green.vercel.app/google">Login With Google</a>`
  );
});

app.use("/api/user", userRouter);
app.use("/", googleRouter);
app.use("/api/tutorial/category", tutCatRouter);
app.use("/api/tutorial", tutorialRouter);
app.use("/api/newsletter", newsLetterRouter);
app.use("/api/review", reviewRouter);
app.use("/api/video", videoRouter);
app.use("/api/blog/category", blogCatRouter);
app.use("/api/blog", blogRouter);
app.use("/api/quiz", quizRouter);

app.use(notFound);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is Running at http://localhost:${PORT}`);
});
