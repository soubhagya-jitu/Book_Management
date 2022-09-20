const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookcontroller")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/books",bookController.getBooks)


module.exports = router;