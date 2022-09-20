const express = require('express');
const router = express.Router();
const bookcontroller = require('../controllers/bookController')


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
// ===========================================================

router.post("/books",bookcontroller.createbook)
module.exports = router;