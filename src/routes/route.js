const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookcontroller")

const userController=require("../controllers/userController")
const bookController=require("../controllers/bookController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/books",bookController.getBooks)
router.post("/userLogin", userController.userLogin)

router.post("/register",userController.createUser);

// ===========================================================

router.post("/books",bookController.createbook)
module.exports = router;