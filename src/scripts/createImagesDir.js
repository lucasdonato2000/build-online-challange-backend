const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "../../images");

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
  console.log('Directory "images" created successfully.');
} else {
  console.log('Directory "images" already exists.');
}
