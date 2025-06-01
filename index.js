const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/track', async (req, res) => {
  const barcode = req.query.barcode;
  if (!barcode) return res.status(400).send('Barcode is required');

  const url = `https://egyptpost.gov.eg/ar-eg/TrackTrace/GetShipmentDetails?barcode=${barcode}`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    await page.goto(url, { waitUntil: 'networkidle2' });
    const content = await page.content();

    await browser.close();
    res.send(content);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).send('Error: ' + error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});