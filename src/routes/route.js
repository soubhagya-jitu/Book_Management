const express = require('express');
const router = express.Router();

const userController=require("../controllers/userController")
const bookController=require("../controllers/bookController")


router.post("/register",userController.createUser);
router.post("/userLogin", userController.userLogin)
router.post("/books",bookController.createbook)
router.get("/books",bookController.getBooks)



module.exports = router;