const puppeteer = require('puppeteer');

async function getUserData(userName) {
  console.log('Fetching');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.goto(`https://www.geeksforgeeks.org/user/${userName}/`);

  // Define selectors based on the provided HTML structure
  const selectors = {
    institutionName: '.educationDetails_head_left--text__tgi9I',
    languages: '.educationDetails_head_right--text__lLOHI',
    rank: '.educationDetails_head_left_userRankContainer--text__wt81s b',
    codingScore: '.scoreCard_head_left--text__KZ2S1:nth-of-type(1) + .scoreCard_head_left--score__oSi_x',
    problemsSolved: '.scoreCard_head_left--text__KZ2S1:nth-of-type(2) + .scoreCard_head_left--score__oSi_x',
    contestRating: '.scoreCard_head_left--text__KZ2S1:nth-of-type(3) + .scoreCard_head_left--score__oSi_x',
    solvedProblemsSelector: '.problemNavbar_head_nav--text__UaGCx' // Updated selector for solved problems
  };

  try {
    await page.waitForSelector(selectors.institutionName, { timeout: 5000 });

    const userData = await page.evaluate((selectors) => {
      const getTextContent = (selector) => document.querySelector(selector)?.textContent?.trim() || 'N/A';

      // Extract the total number of solved problems
      const problemCategories = document.querySelectorAll(selectors.solvedProblemsSelector);
      let totalSolved = 0;
      problemCategories.forEach(category => {
        const count = parseInt(category.textContent.match(/\d+/)?.[0] || '0');
        totalSolved += count;
      });

      return {
        institutionName: getTextContent(selectors.institutionName),
        languages: getTextContent(selectors.languages),
        rank: getTextContent(selectors.rank),
        codingScore: getTextContent(selectors.codingScore),
        totalSolvedProblems: totalSolved // Added total solved problems
      };
    }, selectors);

    console.log('Fetched');
    return userData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      Status: `User ${userName} not found`,
      Error: 'Failed to fetch data'
    };
  } finally {
    await browser.close();
  }
}

module.exports = getUserData;
