const http = require('http');
process.on('uncaughtException',console.log)
http.get('http://192.168.1.70:3000/git/pull',message=>{
	message.on('data',chunk=>{
		console.log('sss')
		console.log(chunk.toString())
	})
	message.on('error',(err)=>{
		// console.log(err)
	})
})
