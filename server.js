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
			req.ip || req._remoteAddress || req.connection && req.connection.remoteAddress
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
		decorateRequest: function(req){
			req.headers["Host"] = "yoyodyne.net"
		},
		intercept: function(rsp, data, req, res, next){
			if(rsp.statusCode >= 200 && rsp.statusCode < 400){
				next(null, data)
			}else{
				next("Content not found")
			}
		}
	  })
	app.use(logger("PROX"))
	app.use(p)
	app.use(function(err, req, res, next){
		if(req.url === "/fallback"){
			res.statusCode = 200;
			res.end("here's your fallback data!")
			next()
		}
		next(err)
	})
	app.listen(8080)
}

if(require.main === module){
	fileServer()
	proxyServer()
}
