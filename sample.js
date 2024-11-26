
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { executablePath } from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();


async function scrape(url) {
  const format = {
    h1: '###',
    h2: '##'
  };

  const browser = await puppeteer.launch({
    headless: true,
 // userDataDir: null,
   executablePath: executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-server=brd.superproxy.io:33335', '--ignore-certificate-errors'], 
    ignoreHTTPSErrors: true
  });

   const page = await browser.newPage();
  await page.authenticate({
    username: '*****,
    password: '******'
  });

  await page.goto(url, {timeout: 70000});

  const html = await page.content();
  const $ = cheerio.load(html);

  const formattedTexts = [];
  $('h1, h2, p').each((index, element) => {
    const tag = $(element).prop('tagName').toLowerCase();
    const text = $(element).text().replace(/\s+/g, ' ');
    if (text) {
      const prefix = tag === 'h1' ? '###' : tag === 'h2' ? '##' : '';
      formattedTexts.push(`${prefix} ${text}`);
    }
  });

  await browser.close();
  console.log(formattedTexts.join('\n'));
  return formattedTexts.join('\n');
}

scrape('https://serverfault.com/questions/1131661/is-there-way-to-specify-more-resources-for-google-app-engine-during-build-stage');

export default scrape;
