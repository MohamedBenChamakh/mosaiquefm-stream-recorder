const axios = require('axios');
const moment = require('moment');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const { spawn } = require('child_process');





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
    const outputPath = path.join(__dirname, '../public', `record_${Date.now()}.mp4`);
    ffmpeg(inputUrl)
        .duration(req.query.duration)
        .videoCodec("libx264")
        .audioCodec("aac")
        .on('start', function () {
            res.status(200).json({ success: true, message: `Recording started for ${req.query.duration} secondes.` });
        })
        .on('end', () => {
            console.log('Recording finished.');
        })
        .on('error', (err) => {
            console.error('Error:', err);
        })
        .on('stderr', function (stderrLine) {
            console.log('Stderr output: ' + stderrLine);
        })
        .save(outputPath);
}





module.exports = { getEPG, record };