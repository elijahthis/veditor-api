const express = require("express");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { transcodeVideo, trimVideo } = require("./transcode");

const port = process.env.PORT || 3211;

// VERY IMPORTANT: WHEN RUNNING IN NODE, USE THESE FLAGS:--experimental-wasm-threads --experimental-wasm-bulk-memory

const app = express();

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./storage");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    },
});

const uploads = multer({ storage: fileStorageEngine });

app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
    );
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
app.use(express.json());
// app.use((_, res, next) => {
//     res.header("Cross-Origin-Opener-Policy", "same-origin");
//     res.header("Cross-Origin-Embedder-Policy", "require-corp");
//     next();
// });

app.use("/videos", express.static(path.join("__dirname", "./transcoded")));

app.get("/", (req, res) => {
    res.send({ message: "Mind your business" });
});

app.post("/upload", uploads.single("newVideo"), async (req, res) => {
    try {
        console.log(req.file);
        res.send({ filename: req.file.filename, filepath: req.file.path });
    } catch (e) {
        console.log(e);
        throw e;
    }
});

app.post("/transcode", async (req, res) => {
    // res.send({ endpoint: "trim endpoint" });
    try {
        if (!req.body.filename) {
            console.log(req);
            throw new Error("no file data");
        }

        console.log(req.body, "line 56");
        transcodeVideo(
            req.body.filename,
            req.body.filepath,
            req.body.filetype,
            res
        );
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
});

app.post("/trim", async (req, res) => {
    try {
        if (!req.body.filename) {
            console.log(req);
            throw new Error("no file data");
        }

        console.log(req.body, "line 56");
        trimVideo(
            req.body.filename,
            req.body.filepath,
            req.body.start,
            req.body.end,
            res
        );
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
});

app.listen(port, () => {
    console.log(`Veditor app listening on port ${port}`);
});

process.on("uncaughtException", function (err) {
    console.log("UNCAUGHT EXCEPTION - keeping process alive:", err); // err.message is "foobar"
});
