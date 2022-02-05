import cheerio from 'cheerio';
import fetch from 'node-fetch';

const APS_URL = 'https://www3.aps.anl.gov/aod/blops/status/srStatus.html';
const FREQ = 30;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function sendSlackNotif(text) {
  console.log('Sending slack notification');
  const resp = await fetch(SLACK_WEBHOOK_URL, {
    method: 'post',
    headers : { 'Content-type' : 'application/json' },
    body: JSON.stringify({ text }),
  });
  console.log(await resp.text());
}

async function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

async function downloadAPSHTML() {
  const resp = await fetch(APS_URL, {
    method: 'get',
  });
  return resp.text();
}

async function getCurrentStatusFromAPS() {
  console.log('Fetching APS beam status...');
  const html = await downloadAPSHTML();
  const $ = cheerio.load(html);
  const status = $('table').first().find('tr:nth-child(2) td:nth-child(3)').text().trim();
  console.log(`Beam status is now: ${status}`);
  return status;
}

async function run() {
  let status = await getCurrentStatusFromAPS();
  await sendSlackNotif(`Current beam status is ${status}. Will check every ${FREQ} seconds and notify you if it changes.`);
  console.log(`Checking every ${FREQ} seconds, will notify on change...`);
  while (true) {
    await sleep(FREQ * 1000);
    const newStatus = await getCurrentStatusFromAPS();
    if (status !== newStatus) {
      console.log(`Status changed from "${status}" to ${newStatus}. Notifying...`);
      await sendSlackNotif(`Beam status has changed from "${status}" to "${newStatus}"`);
      status = newStatus;
    }
  }
}

run()
  .then(() => {
    console.log('Exiting');
  })
  .catch((error) => {
    console.error(error);
  })
