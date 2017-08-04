var express = require('express');
var router = express.Router();
var os = require('os');
router.get("/serverusage",function(req,res){
	let memUsage = (os.totalmem()-os.freemem())/os.totalmem()*100;//百分制
	memUsage = memUsage.toFixed(2);

	let cpuUsage = os.loadavg();

	let result = {
		"errcode":1,
		"message":"成功",
		"data":{
			"cpu":cpuUsage[0],
			"memory":memUsage,
			"time":new Date().toLocaleString(),
			"cpucore":os.cpus()[0].model
		}
	}
	res.json(result);
})


module.exports = router;