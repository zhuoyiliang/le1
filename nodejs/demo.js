const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const inputPath = path.resolve(__dirname, "tcmHealth.html");
const html = fs.readFileSync(inputPath, 'utf8');
const $ = cheerio.load(html);
console.log("All tags:", $('*').length);

$('input').each((i, el) => {
  console.log('下拉框:', $(el).attr());
});
