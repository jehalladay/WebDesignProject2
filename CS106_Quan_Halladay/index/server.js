const port  = "1414", landing = 'index.html';
const path  = require('path');
const http  = require('http');
const fs    = require('fs');


function getContentType(url){
    const mimeTypes = {
        '.html'	: 'text/html'				,	'.js'	: 'text/javascript'				 	,
        '.css'	: 'text/css'				,	'.json'	: 'application/json'			 	,
        '.png'	: 'image/png'				,	'.jpg'	: 'image/jpg'					 	,
        '.gif'	: 'image/gif'				,	'.svg'	: 'image/svg+xml'				 	,
        '.wav'	: 'audio/wav'				,	'.mp4'	: 'video/mp4'					 	,
        '.woff'	: 'application/font-woff'	,	'.ttf'	: 'application/font-ttf'		 	,
        '.otf'	: 'application/font-otf'	,	'.eot'	: 'application/vnd.ms-fontobject'	,
        '.wasm'	: 'application/wasm'		
    };

    return mimeTypes[path.extname(url).toLowerCase()] || 'application/octet-stream';
}


function serverController(hostname) {
    const server = http.createServer(serverProcessor);

    server.listen(port, hostname, () => {
        console.log(`Server running at ${hostname}:${port}`);
        console.log('Node.JS static file server is listening');
    });
}


function serverProcessor(request, response){
	console.log(`Request came: ${request.url}`);
	if(request.url === '/') {
		sendFile(landing, 'text/html', response);
	} else {
		sendFile(request.url, getContentType(request.url), response);
	};
};

function sendFile(url, contentType, response){
	let file = path.join(__dirname, url);
	
	fs.readFile(file, (error, content) => {
		if(error) {
			response.writeHead(404)
					.write(`File '${file}' Not Found!`);
			
			response.end();
			console.log(`Response: 404 ${file}, err`);
		} else {
			response.writeHead(200, {'Content-Type': contentType})
					.write(content);
					
			response.end();
			console.log(`Response: 200 ${file}`);
		};
	});
};


(function launch() {
    if (require.main == module) {
        if (process.argv.length > 2) {
            var hostname = process.argv[2];
		} else {
			var hostname = "127.0.0.1";
		};
		serverController(hostname);
    };
})();