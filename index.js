const express = require('express');

const puppeteer = require('puppeteer');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const browserless_host = 'ws://' + process.env.BROWSERLESS_HOST;


const app = express();
console.log("is_production: " + IS_PRODUCTION);
console.log("BROWSERLESS_HOST: " + browserless_host);

const getBrowser = () => IS_PRODUCTION ?

  // Connect to browserless so we don't run Chrome on the same hardware in production
  puppeteer.connect({ browserWSEndpoint: browserless_host }) :

  // Run the browser locally while in development
  puppeteer.launch();


app.get('/fetch', async (req, res) => {
  let browser = null;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.goto(req.query.url);
    const resp = await page.content();
    // console.log(resp);

    res.end(resp);
  } catch (error) {
    console.log(error)
    if (!res.headersSent) {
      res.status(400).send(error.message);
    }
  } finally {
    if (browser) {
      browser.close();
    }
  }
});

app.listen(8080, () => console.log('Listening on PORT: http://localhost:8080'));