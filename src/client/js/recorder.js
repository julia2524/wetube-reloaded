import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");
const timer = document.getElementById("previewControls__time");

let stream;
let recorder;
let videoFile;
let time = 0;
let timerId;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const changeTime = () => {
  time += 1;
  timer.innerText = formatTime(Math.floor(time));
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Trasncoding...";
  actionBtn.disabled = true;
  const ffmpeg = new FFmpeg();
  ffmpeg.on("log", ({ message }) => {
    console.log(message);
  });
  await ffmpeg.load();

  await ffmpeg.writeFile(files.input, await fetchFile(videoFile));
  await ffmpeg.exec(["-i", files.input, "-r", "60", files.output]);
  await ffmpeg.exec([
    "-i",
    files.input,
    "-ss",
    "00:00:00.1",
    "-frames:v",
    "1",
    files.thumb,
  ]);

  const mp4File = await ffmpeg.readFile(files.output);
  const thumbFile = await ffmpeg.readFile(files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  //   const okWebm = await ffmpeg.deleteFile("files.input");
  //   const okMp4 = await ffmpeg.deleteFile("files.output");
  //   const okJpg = await ffmpeg.deleteFile("files.thumb");

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";

  init();
  actionBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);
  time = 0;
  clearInterval(timerId);
  recorder.stop();
};

const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.disabled = true;
  setTimeout(() => {
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleStop);
  }, 1000);
  actionBtn.addEventListener("click", handleStop);
  timerId = setInterval(changeTime, 1000);

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};

init();
actionBtn.addEventListener("click", handleStart);
