const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';

const DATE = moment().subtract(60,'d').format('YYYY-MM-DD HH:mm:ss');

const data = {
  date: DATE
};

jsonfile.writeFile(FILE_PATH, data, ()=>{
// git commit --date=""
simpleGit().add([FILE_PATH]).commit(DATE, {'--date': DATE }).push();
});
