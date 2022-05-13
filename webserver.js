/* jshint esversion: 6 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const webfolder = 'www';
const webserver = new http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathName = './' + webfolder + parsedUrl.pathname;
  const mimeType = {
    '.7z': 'application/x-7z-compressed',
    '.acc': 'audio/aac',
    '.avi': 'video/x-msvideo',
    '.bz': 'application/x-bzip',
    '.bz2': 'application/x-bzip2',
    '.csv': 'text/csv',
    '.css': 'text/css',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.epub': 'application/epub+zip',
    '.gif': 'image/gif',
    '.gz': 'application/gzip',
    '.htm': 'text/html',
    '.html': 'text/html',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.mjs': 'text/javascript',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.mpeg': 'video/mpeg',
    '.odt': 'application/vnd.oasis.opendocument.text',
    '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
    '.ogg': 'audio/ogg',
    '.ogv': 'video/ogg',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.rar': 'application/x-rar-compressed',
    '.sh': 'application/x-sh',
    '.svg': 'image/svg+xml',
    '.tar': 'application/x-tar',
    '.tgz': 'application/x-compressed',
    '.ttf': 'aplication/font-sfnt',
    '.txt': 'text/plain',
    '.wav': 'audio/wav',
    '.weba': 'audio/webm',
    '.webm': 'video/webm',
    '.webp': 'image/webp',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xml': 'text/xml',
    '.zip': 'application/zip',
  };
  fs.exists(pathName, (exist) => {
    if (!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end('Error 404;<br>There is nothing at ' + pathName);
      return;
    }
    // if is a directory, then look for index.html
    // AGR this is corrupt, the what if it's a folder with no index.html?
    // if is a directory, then look for index.html

    if (fs.statSync(pathName).isDirectory()) {
      pathName += '/index.html';
    }
    // read file from file system
    fs.readFile(pathName, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // based on the URL path, extract the file extension. e.g. .js, .doc, ...
        const ext = path.parse(pathName).ext;
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
        res.end(data);
        console.log('served file ' + pathName);
      }
    });
  });
});
webserver.on('error', (err) => {
  console.log('Error: ' + err);
});

exports.create = (settings = {}) => {
  if (settings.port === undefined) {
    console.log('Webserver port not defined, using default 80');
    settings.port = 80;
  }
  webserver.listen(settings.port);
  return webserver;
};
