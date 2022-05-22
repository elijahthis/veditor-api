const fs = require("fs");
const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");

const ffmpeg = createFFmpeg({ log: true });

const transcodeVideo = async (filename, filepath) => {
    await ffmpeg.load();
    ffmpeg.FS(
        "writeFile",
        "test.mp4",
        await fetchFile("http://localhost:3000/assets/video/Real 4K HDR .mp4")
    );
    await ffmpeg.run(
        "-i",
        "test.mp4",
        "-t",
        "2.5",
        "-ss",
        "2.5",
        "-f",
        "gif",
        "out.gif"
    );
    await fs.promises.writeFile("./out.gif", ffmpeg.FS("readFile", "out.gif"));
    process.exit(0);
};

module.exports.transcodeVideo = transcodeVideo;
