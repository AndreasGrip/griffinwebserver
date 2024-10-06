This is just a basic webserver that will serve any fill inside your projects www folder.
with no requirements at all = no node_modules folder needed.

Note that this also means that as long as I don't want to add any new functionality there is no reason to update any files, unless node create some breaking changes.
The project is not orphaned there is just no reason for security updates etc.

Reason for creating this was that I ended up needing a server like this for most of my project and got tired of rewrite/copy it all the time.

Usage:
Once you added the webserver.js to your project. Create a www folder and it's content will be served. If nothing in the folder it will try to serve index.html

node ./example.js
Show how to do it.
The file contains the following line.

const webserver = require('./webserver').create({port: 8080});
