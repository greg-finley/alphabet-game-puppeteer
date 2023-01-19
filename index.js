const puppeteer = require('puppeteer');
let page;

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  return browser.newPage();
}

exports.screenshot = async (req, res) => {
  console.log(req.query);
  let queryParams = new URLSearchParams(req.query).toString();
  console.log(queryParams);
    console.log('https://www.sportsalphabetgame.com/custom?' + queryParams);
  // const {matching_letters, ...rest} = req.query;
  // queryParams = new URLSearchParams(rest);
  //matching_letters.forEach(l => queryParams.append('matching_letters', l))
   // console.log(queryParams);
  //console.log('https://www.sportsalphabetgame.com/custom?' + queryParams);
  if (!page) {
    page = await getBrowserPage();
  }

  await page.goto('https://www.sportsalphabetgame.com/custom?' + queryParams);
  await page.setViewport({
   width: 800, height: 800,
    deviceScaleFactor: 2,
});
  await timeout(3000);

  const elements = await page.$$('*');

  for (const element of elements) {
      const tagName = await page.evaluate(el => el.className, element);
      if (typeof tagName === 'string' && tagName.includes('MuiCard-root')) {
        console.log(tagName);
        const imageBuffer = await element.screenshot({type: "jpeg", quality: 100});
        res.set('Content-Type', 'image/jpeg');
        res.send(imageBuffer);
        break;
      }
  } 
};