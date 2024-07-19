const puppeteer = require("puppeteer");

async function getUserData(userName) {
  console.log("Fetching");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.goto(`https://www.geeksforgeeks.org/user/${userName}/`);
 
  // Wait for the required elements to load
  const selector = ".profilePicSection_head_userRankContainer_rank__abngM";
  try {
    await page.waitForSelector(selector, { timeout: 3000 }); // Adjust timeout as needed
  } catch (error) {
    // console.error(`User ${userName} not found`);
    await browser.close();
    return {
      "Status":`User ${userName} not found`,
      "Shinkhal ":"Password is wrong , Try again!"
    }; 
  }

 
  const userData = await page.evaluate(() => {
    const rank = document
      .querySelector(".profilePicSection_head_userRankContainer_rank__abngM")
      .getElementsByTagName("b")[0].innerText;
    const streak = document.querySelector(
      ".circularProgressBar_head_mid_streakCnt__MFOF1"
    ).childNodes[0].textContent;
    const overallScore = document.querySelector(".scoreCards_head__G_uNQ")
      .childNodes[0].childNodes[0].childNodes[0].childNodes[1].innerText;
    const totalSolved = document.querySelector(".scoreCards_head__G_uNQ")
      .childNodes[1].childNodes[0].childNodes[0].childNodes[1].innerText;
    const monthlyScore = document.querySelector(".scoreCards_head__G_uNQ")
      .childNodes[2].childNodes[0].childNodes[0].childNodes[1].innerText;
    const instituteName = document.querySelector(
      ".educationDetails_head_left--text__tgi9I"
    ).innerText;
    const languages = document.querySelector(
      ".educationDetails_head_right--text__lLOHI"
    ).innerText;
    const problems = document.querySelector(".problemListSection_head__JAiP6");
    return {
      instituteName,
      languages,
      rank,
      streak,
      overallScore,
      monthlyScore,
      totalSolved,
    };
  });

  // console.log(userData);
  await browser.close();
  console.log("Fetched");
  return userData;
}
module.exports = getUserData;
