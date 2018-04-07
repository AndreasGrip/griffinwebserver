/* jshint esversion: 6 */

const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const webserver = new http.createServer((req, res) => {
	console.log(`${req.method} ${req.url}`);
	const parsedUrl = url.parse(req.url);
	let pathname = 'www' + parsedUrl.pathname;
	const mimeType = {
		".ico": "image/x-icon",
		".html": "text/html",
		".js": "text/javascript",
		".json": "application/json",
		".css": "text/css",
		".png": "image/png",
		".jpg": "image/jpeg",
		".wav": "audio/wav",
		".mp3": "audio/mpeg",
		".svg": "image/svg+xml",
		".pdf": "application/pdf",
		".doc": "application/msword",
		".eot": "appliaction/vnd.ms-fontobject",
		".ttf": "aplication/font-sfnt"
	};
	fs.exists(pathname, function(exist) {
		if (!exist) {
			// if the file is not found, return 404
			res.statusCode = 404;
			res.end(`File ${pathname} not found!`);
			return;
		}
		// if is a directory, then look for index.html
		if (fs.statSync(pathname).isDirectory()) {
			pathname += "/index.html";
		}
		// read file from file system
		fs.readFile(pathname, function(err, data) {
			if (err) {
				res.statusCode = 500;
				res.end(`Error getting the file: ${err}.`);
			} else {
				// based on the URL path, extract the file extention. e.g. .js, .doc, ...
				const ext = path.parse(pathname).ext;
				// if the file is found, set Content-type and send data
				res.setHeader("Content-type", mimeType[ext] || "text/plain");
				res.end(data);
			}
		});
	});
});
webserver.on("error", err => {
	console.log("Error: " + err);
});
//webserver.listen(8080);

exports.create = (settings) => {
	let settingsObj = JSON.parse(settings);
	if(settingsObj.port === undefined) {
		return -1;
	} else {
		webserver.listen(settingsObj.port);
		return webserver;
	}
};
