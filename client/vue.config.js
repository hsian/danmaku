module.exports = {
	pluginOptions:{
		liveURL: [
			"http://192.168.208.128",
			"http://49.234.206.77",
		][ ["development", "production"].indexOf(process.env.NODE_ENV) ],
		localURL: [
			"http://127.0.0.1",
			"http://49.234.206.77",
		][ ["development", "production"].indexOf(process.env.NODE_ENV) ],
	}
}