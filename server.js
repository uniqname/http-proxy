var
  express = require("express"),
  proxy = require("express-http-proxy"),
  serveStatic = require("serve-static"),
  url = require("url")

function logger(prefix){
	return function(req, res, next){
		console.log(
			prefix, 
			req.method,
			req.headers.host,
			req.url,
			req.ip|| req._remoteAddress || req.connection && req.connection.remoteAddress
		)
		next()
	}
}

function fileServer(){
	var
	  app = express(),
	  dir = process.cwd(),
	  ss = serveStatic(process.cwd())
	app.use(logger("FILE"))
	app.use(ss)
	app.listen(8081)
}

function proxyServer(){
	var
	  app = express(),
	  p = proxy("localhost:8081", {
		forwardPath: function(req, res){
			return url.parse(req.url).path
		},
		decorateRequest: function(req){
			req.headers["Host"] = "yoyodyne.net"
		}
	  })
	app.use(logger("PROX"))
	app.use(p)
	app.listen(8080)
}

if(require.main === module){
	fileServer()
	proxyServer()
}
