const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';

const DATE = moment().subtract(6,'d').format('YYYY-MM-DD HH:mm:ss');

const data = {
  date: DATE
};

jsonfile.writeFile(FILE_PATH, data, ()=>{
// git commit --date=""
simpleGit().add([FILE_PATH]).commit(DATE, {'--date': DATE }).push();
});


//ssdsdsdsdsdsdsdsd
// git commit --date=""
// git push origin master
// git push origin master --force
// git push origin master --force --no-verify
// git push origin master --force --no-verify --quiet
// git push origin master --force --no-verify --quiet --progress
// git push origin master --force --no-verify --quiet --progress --verbose
// git push origin master --force --no-verify --quiet --progress --verbose --dry-run
// git push origin master --force --no-verify --quiet --progress --verbose --dry-run --tags
// git push origin master --force --no-verify --quiet --progress --verbose --dry-run --tags --all
// git push origin master --force --no-verify --quiet --progress --verbose --dry-run --tags --all --prune
