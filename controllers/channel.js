const axios = require('axios');
const moment = require('moment');

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



module.exports = { getEPG };