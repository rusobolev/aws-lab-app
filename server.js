const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/metadata', async (req, res) => {
    try {
        const region = await axios.get('http://169.254.169.254/latest/meta-data/placement/region');
        const az = await axios.get('http://169.254.169.254/latest/meta-data/placement/availability-zone');
        
        res.json({
            region: region.data,
            availabilityZone: az.data
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch metadata' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
