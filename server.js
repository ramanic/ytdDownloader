const express = require('express');
var YoutubeMp3Downloader = require('youtube-mp3-downloader');
const fs = require('fs');
const app = express();
var url = require('url');
const ytdl = require('ytdl-core');
const port = process.env.port || 8000;
request = require('request');
var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
app.use('/song', express.static(__dirname + '/song'));
app.get('/convert', async (req, res) => {
  try {
    const videoID = ytdl.getURLVideoID(req.query.link);
    let info = await ytdl.getInfo(videoID);
    let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    res.json({
      success: true,
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      thumbnail:
        info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 2]
          .url,
      audio: audioFormats[1].url,
    });
  } catch (err) {
    console.error(err);
    res.json({ err: err });
  }
});

app.listen(port, () => {
  console.log(` Server Listning on ${port}`);
});
