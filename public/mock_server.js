// node.js server

const http = require('http');
const fs   = require('fs');
const url  = require('url');

const hostname = 'localhost';
const port = 3000;

var positionData = '';

const server = http.createServer((request, response) => {
	// parse request
	var id = url.parse(request.url).pathname;
    if ( id.charAt(0) === '/' ) id = id.slice(1);
    if ( id.charAt(id.length-1) === '/' ) id = id.slice(0, id.length-1);

	if (id.includes('setdata')) {
		// fetch and process incoming data
		request.addListener('data', function (chunk) {});
		request.addListener('end', function () {
			try {
				// store data string
				let data = url.parse(request.url).query.replace('data=','');
				if (data !== '') {
					positionData = data;
				}

				// if all is well, return a positive response
				response.statusCode = 200;
				response.setHeader('Content-Type', 'text/plain');
				response.end('OK\n');
			} catch (e) {
				console.log('setdata error: ', e);
				response.writeHead(400, {'Content-Type': 'text/plain'});
				response.end('Error 400: '+e);
				return;
			}
		});
	} else if (id.includes('getdata')) {
		// return the latest data as a JSON response
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.end(JSON.stringify({
		    data: positionData
		}));
	} else {
		let outcome = 200;

		// return a static file
		let filename = (id.length !== 0) ? id : 'index.html';

		fs.readFile(filename, function(error, data) {
			if (error) {
				outcome = 404;
				response.writeHead(404, {'Content-Type': 'text/plain'});
				response.write('Error 404 - File not found\n');
				response.write('More info: ' + JSON.stringify(error));
				response.end('\n');
			} else {
				response.writeHead(200, {
					'Content-Type': getContentType(filename),
					'Content-Length': data.length
				});
				response.end(data);
			}
		});
		console.log(request.method, outcome, id);
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

var getContentType = function (inName) {
	let extension = inName.replace(/^.+\.(.+)$/, '$1'),
		ctype = '';

	switch (extension) {
		case 'js':
			ctype = 'text/javascript'; break;
		case 'html':
			ctype = 'text/html'; break;
		case 'css':
			ctype = 'text/css'; break;
		case 'png':
			ctype = 'image/png'; break;
		case 'jpg':
			ctype = 'image/jpeg'; break;
		case 'webm':
			ctype = 'video/webm'; break;
		case 'mp4':
			ctype = 'video/mp4'; break;
		case 'ogv':
			ctype = 'video/ogg'; break;
		case 'mp3':
			ctype = 'audio/mp3'; break;
		case 'ogg':
			ctype = 'audio/ogg'; break;
		case 'wav':
			ctype = 'audio/wav'; break;
		default:
			ctype = 'text/plain'; break;
	}
	return ctype;
};
