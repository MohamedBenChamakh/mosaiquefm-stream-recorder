const axios = require('axios');
const moment = require('moment');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');




async function getEPG(req, res) {
    const apiUrl = "https://api.mosaiquefm.net/api/fr/programme";
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        res.render('program', { success: true, data: data, moment: moment });
    } catch (error) {
        console.error('Error making API request:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}


function record(req, res) {
    if (!req.query || !req.query.duration) {
        res.status(400).message({ message: "please provide the duration" })
    }
    const inputUrl = 'https://webcam.mosaiquefm.net:1936/mosatv/studio/playlist.m3u8';
    const videoFileName = `record_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '../public/videos/', videoFileName);
    ffmpeg(inputUrl)
        .duration(req.query.duration)
        .videoCodec("libx264")
        .audioCodec("aac")
        .on('start', function () {
            res.status(200).json({ success: true, message: `Recording started for ${req.query.duration} secondes.` });
        })
        .on('end', () => {
            console.log('Recording finished.');
            generateThumbnail(outputPath, videoFileName);
        })
        .on('error', (err) => {
            console.error('Error:', err);
            res.status(500);

        })
        .on('stderr', function (stderrLine) {
            console.log('Stderr output: ' + stderrLine);
        })
        .save(outputPath);

}

function getReplay(req, res) {
    const imagesFolderPath = path.join(__dirname, '../public/thumbnails');

    fs.readdir(imagesFolderPath, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png|gif)$/i.test(path.extname(file))
        );

        const imageUrls = imageFiles.map(file =>
            `${req.protocol}://${req.get('host')}/thumbnails/${file}`
        );
        res.json({ images: imageUrls });
    });
}


function generateThumbnail(src, filename) {
    ffmpeg(src).screenshots({
        count: 1,
        folder: path.join(__dirname, '../public/thumbnails'),
        filename: `${filename.replace('.mp4', '')}_thumbnail.jpg`,
        size: '320x240',
    })
}




module.exports = { getEPG, record, getReplay };