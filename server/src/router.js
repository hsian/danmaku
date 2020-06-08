const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ 
  	response: "Server is up and running."
  }).status(200);
});

router.post("/valid-identity/", (req, res) => {
	const {token} = req.body;

	if(!token){
		res.status(403).json({message: "token is undefined"});
	}

	// request third party api, recive user infomation object!
	const mockUser = {
		username: "tony",
		age: 18,
		avatar: "",
		gender: 1
	}

	res.send(mockUser);
})

module.exports = router;