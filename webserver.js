/* jshint esversion: 6 */

const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const webfolder = "www";
const webserver = new http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url);
	let pathName = "./" + webfolder + parsedUrl.pathname;
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
	fs.exists(pathName, exist => {
		if (!exist) {
			// if the file is not found, return 404
			res.statusCode = 404;
			res.end("Error 404;<br>There is nothing at " + pathName);
			return;
		}
		// if is a directory, then look for index.html
		// AGR this is corrupt, the what if it's a folder with no index.html?
		// if is a directory, then look for index.html

		if (fs.statSync(pathName).isDirectory()) {
			pathName += "/index.html";
		}
		// read file from file system
		fs.readFile(pathName, (err, data) => {
			if (err) {
				res.statusCode = 500;
				res.end(`Error getting the file: ${err}.`);
			} else {
				// based on the URL path, extract the file extention. e.g. .js, .doc, ...
				const ext = path.parse(pathName).ext;
				// if the file is found, set Content-type and send data
				res.setHeader("Content-type", mimeType[ext] || "text/plain");
				res.end(data);
				console.log("served file " + pathName);
			}
		});
	});
});
webserver.on("error", err => {
	console.log("Error: " + err);
});
//webserver.listen(8080);

exports.create = settings => {
	if (settings === undefined) {
		settings = {};
	}
	if (settings.port === undefined) {
		console.log('Webserver port not defined, using default 80');
		settings.port = 80;
	} else {
		webserver.listen(settings.port);
		return webserver;
	}
};
