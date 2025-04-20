const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');
const fs = require('fs');

const FILE_PATH = './contribution_data.json';
const TARGET_DATES = ['2025-01-25', '2025-02-23'];
const COMMITS_PER_DATE = 12;

async function createDistinctCommits() {
    const git = simpleGit();
    
    for (const dateStr of TARGET_DATES) {
        const baseDate = moment(dateStr);
        
        for (let i = 1; i <= COMMITS_PER_DATE; i++) {
            // Create unique content for each commit
            const uniqueData = {
                commitNumber: i,
                timestamp: moment().format('X'),
                message: `Contribution ${i} for ${dateStr}`,
                changes: `Updated file ${i}`
            };
            
            // Write to different files to ensure uniqueness
            const uniqueFilePath = `./changes/commit_${dateStr}_${i}.json`;
            await jsonfile.writeFile(uniqueFilePath, uniqueData);
            
            // Stage and commit with exact timestamps
            const commitDate = baseDate.clone()
                              .add(i, 'hours')  // Space commits throughout the day
                              .format('YYYY-MM-DD HH:mm:ss');
            
            await git.add([uniqueFilePath]);
            await git.commit(`Contribution ${i} for ${dateStr}`, {
                '--date': commitDate
            });
            
            console.log(`Created commit ${i} for ${dateStr} at ${commitDate}`);
        }
    }
    
    // Push all commits at once
    await git.push();
    console.log('All commits pushed successfully');
}

// Initialize changes directory
if (!fs.existsSync('./changes')) {
    fs.mkdirSync('./changes');
}

createDistinctCommits().catch(console.error);