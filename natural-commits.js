const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');
const { randomInt } = require('crypto');

const FILE_PATH = './data.json';
const START_DATE = '2025-02-01'; // Customize this
const MAX_COMMITS_PER_DAY = 12;  // Maximum possible commits in a day

// Realistic commit messages for different types of work
const COMMIT_MESSAGES = [
  "Fix typo in documentation",
  "Update README.md",
  "Refactor module exports",
  "Add error handling",
  "Optimize database query",
  "Fix edge case in validation",
  "Update dependencies",
  "Improve test coverage",
  "Resolve merge conflict",
  "Implement feedback from PR",
  "Clean up console logs",
  "Adjust CSS styling",
  "Add null check",
  "Update config settings"
];

async function createNaturalCommits() {
  const git = simpleGit();
  const today = moment();
  let currentDate = moment(START_DATE);

  while (currentDate.isSameOrBefore(today)) {
    // Skip 30% of weekends completely (more realistic activity pattern)
    const isWeekend = currentDate.day() === 0 || currentDate.day() === 6;
    if (isWeekend && Math.random() < 0.3) {
      currentDate.add(1, 'day');
      continue;
    }

    // Generate random commit count (weighted toward lower numbers)
    let commitCount;
    const rand = Math.random();
    if (rand < 0.6) commitCount = randomInt(0, 3);       // 60% chance: 0-2 commits
    else if (rand < 0.9) commitCount = randomInt(3, 6);  // 30% chance: 3-5 commits
    else commitCount = randomInt(6, MAX_COMMITS_PER_DAY); // 10% chance: 6+ commits

    // Create commits at random times throughout the day
    for (let i = 0; i < commitCount; i++) {
      // Random time between 9AM and 11PM (with 70% probability during work hours)
      const workHours = Math.random() < 0.7;
      const hour = workHours 
        ? randomInt(9, 18) 
        : randomInt(18, 23);
      const minute = randomInt(0, 60);
      const second = randomInt(0, 60);

      const commitDate = currentDate.clone()
        .hour(hour)
        .minute(minute)
        .second(second)
        .format('YYYY-MM-DD HH:mm:ss');

      const data = {
        timestamp: commitDate,
        workType: i === 0 ? "feature" : i % 3 === 0 ? "bugfix" : "chore"
      };

      const message = COMMIT_MESSAGES[randomInt(0, COMMIT_MESSAGES.length)];

      await jsonfile.writeFile(FILE_PATH, data);
      await git.add([FILE_PATH]);
      await git.commit(message, { '--date': commitDate });
      console.log(`Created commit at ${commitDate}: "${message}"`);
    }

    // Random gap between 0-3 days (20% chance)
    if (Math.random() < 0.2) {
      const gapDays = randomInt(1, 4);
      currentDate.add(gapDays, 'day');
    } else {
      currentDate.add(1, 'day');
    }
  }

  await git.push();
  console.log('All natural-looking commits pushed to remote');
}

createNaturalCommits().catch(console.error);