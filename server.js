const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

async function getMetadata(path) {
    try {
        const tokenResponse = await axios.put(
            'http://169.254.169.254/latest/api/token',
            null,
            { headers: { 'X-aws-ec2-metadata-token-ttl-seconds': '21600' } }
        );

        const token = tokenResponse.data;

        const response = await axios.get(`http://169.254.169.254/latest/meta-data/${path}`, {
            headers: { 'X-aws-ec2-metadata-token': token }
        });

        return response.data;
    } catch (error) {
        console.error('Metadata fetch error:', error.message);
        return null;
    }
}

app.get('/metadata', async (req, res) => {
    const region = await getMetadata('placement/region');
    const az = await getMetadata('placement/availability-zone');

    if (region && az) {
        res.json({ region, availabilityZone: az });
    } else {
        res.status(500).json({ error: 'Unable to fetch metadata' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
