const express = require('express');
const router = express.Router();

const userController=require("../controllers/userController")
const bookController=require("../controllers/bookController")


router.post("/register",userController.createUser);
router.post("/login", userController.userLogin)
router.post("/books",bookController.createbook)
router.get("/books",bookController.getBooks)
router.get("/books/:bookId",bookController.getBooksDetail)
router.put("/books/:bookId",bookController.putBooks)
router.delete("/books/:bookId",bookController.deleteBookParam)

module.exports = router;