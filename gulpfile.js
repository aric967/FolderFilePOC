const { series } = require('gulp');
const fs = require("fs"); // Or `import fs from "fs";` with ESM


function insertServerFile(cb) {
	console.log('inside');
	if (fs.existsSync("./dist")) {
     console.log('dist folder exists');
	 fs.createReadStream('./server.js').pipe(fs.createWriteStream('./dist/server.js'));
	}
	console.log(cb);
	cb();
}

exports.insert = series(insertServerFile);
