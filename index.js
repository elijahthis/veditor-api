const express = require("express");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { transcodeVideo } = require("./transcode");

const port = process.env.PORT || 3211;

// VERY IMPORTANT: WHEN RUNNING IN NODE, USE THESE FLAGS:--experimental-wasm-threads --experimental-wasm-bulk-memory

const app = express();
app.use(cors());
app.use(express.json());
app.use((_, res, next) => {
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

app.use("/videos", express.static(path.join("__dirname", "./transcoded")));

app.get("/", (req, res) => {
    res.send({ message: "Mind your business" });
});

app.post("/upload", async (req, res) => {
    try {
        if (req.file) {
            console.log(req);
            throw new Error("no file data");
        }
        // await transcodeVideo(req.file.originalname, req.file.path);
        console.log(req.body);
        await transcodeVideo(req.body.filename, req.body.filepath);
        res.status(200).send();
    } catch (e) {}
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
