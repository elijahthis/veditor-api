const fs = require("fs");
const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");

const ffmpeg = createFFmpeg({ log: true });

const transcodeVideo = async (filename, filepath, filetype, res) => {
    try {
        if (!ffmpeg.isLoaded()) await ffmpeg.load();

        ffmpeg.FS(
            "writeFile",
            `test.${filename.slice(-3)}`,
            await fetchFile(filepath)
        );

        if (["wav", "m4a", "mp3"].includes(filetype))
            await ffmpeg.run(
                "-i",
                `test.${filename.slice(-3)}`,
                "-vn",
                "-acodec",
                "copy",
                `out.${filetype}`
            );
        else {
            await ffmpeg.run(
                "-i",
                `test.${filename.slice(-3)}`,
                `out.${filetype}`
            );
        }
        const newPath = `./transcoded/${Date.now()}-Transcoded----${filename}.${filetype}`;
        await fs.promises.writeFile(
            newPath,
            ffmpeg.FS("readFile", `out.${filetype}`)
        );
        await res.download(newPath);
    } catch (err) {
        console.log("Error:", err);
        throw err;
    }
};

const trimVideo = async (filename, filepath, start, end, res) => {
    try {
        if (!ffmpeg.isLoaded()) await ffmpeg.load();

        ffmpeg.FS(
            "writeFile",
            `test.${filename.slice(-3)}`,
            await fetchFile(filepath)
        );

        await ffmpeg.run(
            "-i",
            `test.${filename.slice(-3)}`,
            "-ss",
            `${start}`,
            "-to",
            `${end}`,
            "-c:v",
            "copy",
            "-c:a",
            "copy",
            `out.${filename.slice(-3)}`
        );

        const newPath = `./transcoded/${Date.now()}-Trimmed----${filename}.${filename.slice(
            -3
        )}`;
        await fs.promises.writeFile(
            newPath,
            ffmpeg.FS("readFile", `out.${filename.slice(-3)}`)
        );
        await res.download(newPath);
    } catch (err) {
        console.log("Error:", err);
        throw err;
    }
};

module.exports.transcodeVideo = transcodeVideo;
module.exports.trimVideo = trimVideo;
