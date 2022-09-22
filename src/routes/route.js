const express = require('express');
const router = express.Router();

const userController=require("../controllers/userController")
const bookController=require("../controllers/bookController")
const commonMw = require("../middlewares/commonMiddleware")


router.post("/register",userController.createUser);
router.post("/login", userController.userLogin)
router.post("/books",commonMw.authentication,commonMw.authorisation,bookController.createbook)
router.get("/books",commonMw.authentication,bookController.getBooks)
router.get("/books/:bookId",commonMw.authentication,bookController.getBooksDetail)
router.put("/books/:bookId",commonMw.authentication,commonMw.authorisation,bookController.putBooks)
router.delete("/books/:bookId",commonMw.authentication,commonMw.authorisation,bookController.deleteBookParam)

module.exports = router;