const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;
const prefix = "https://www.youtube.com/watch?v=";
const allowed_types = ['mp4', 'webm', 'ogg'];

app.get('/:id/:type', (req, res) => {
    const id = req.params.id;
    const url = prefix + id
    if (!allowed_types.includes(req.params.type)) {
        // Reset headers
        res.set({
            'Content-Type': 'text/html',
            'Content-Disposition': ''
        });
        
        return res.send('Invalid format, allowed: ' + allowed_types.join(', '));
    }
    console.log(`Downloading ${id}.${req.params.type}...`);

    // get video name
    ytdl.getInfo(url).then(info => {
        const title = info.videoDetails.title;
        res.header('Content-Disposition', `attachment; filename=${title}.${req.params.type}`);
        ytdl(url, {
            format: req.params.type,
            filter: 'audioandvideo',
            quality: 'highestvideo',
            format: 'hd1080'
        }).pipe(res);
    });



});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});