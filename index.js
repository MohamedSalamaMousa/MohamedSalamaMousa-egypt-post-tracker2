const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const app = express();

// تفعيل الوضع المخفي لتجاوز الحماية مثل Cloudflare
puppeteer.use(StealthPlugin());

app.get('/track', async (req, res) => {
  const barcode = req.query.barcode;
  if (!barcode) return res.status(400).send('Barcode is required');

  const url = `https://egyptpost.gov.eg/ar-eg/TrackTrace/GetShipmentDetails?barcode=${barcode}`;

  try {
    const browser = await puppeteer.launch({
      headless: "new", // ✅ استخدام الوضع الجديد
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // تعيين user-agent حقيقي
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );

    // تعيين headers إضافية لتبدو كأنها زيارة حقيقية من متصفح
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    // التوجه للرابط والانتظار حتى تنتهي التحميلات
    await page.goto(url, { waitUntil: 'networkidle2' });

    const content = await page.content(); // أخذ محتوى الصفحة
    await browser.close(); // إغلاق المتصفح

    res.send(content); // إرسال المحتوى للعميل
  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).send('Error: ' + error.message);
  }
});

// تشغيل الخادم على البورت المحدد
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
