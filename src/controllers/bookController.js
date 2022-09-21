const { default: mongoose } = require("mongoose");
const { updateMany } = require("../models/bookModel");
const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')

let regexValidation = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/;
let regexValidISBM = /^[\d*\-]{10}|[\d*\-]{13}$/;
let regexValidReleasedAt =/^[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}/;

const createbook = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "plzz give some data" });

        const { title, excerpt, userId, ISBN, category, subcategory ,releasedAt} = data

        if (!title) return res.status(400).send({ status: false, message: "Enter title" });
        if (!excerpt) return res.status(400).send({ status: false, message: "Enter excerpt" });
        if (!userId) return res.status(400).send({ status: false, message: "Enter userId" });
        if (!ISBN) return res.status(400).send({ status: false, message: "Enter ISBN" });
        if (!category) return res.status(400).send({ status: false, message: "Enter category" });
        if (!subcategory) return res.status(400).send({ status: false, message: "Enter subcategory" });
        if (!releasedAt) return res.status(400).send({ status: false, message: "Enter releasedAt" });
        

        if (!title.match(regexValidation)) return res.status(400).send({ status: false, message: "please enter a valid title" })
        if (!ISBN.match(regexValidISBM)) return res.status(400).send({ status: false, message: "please enter a valid ISBM" })
        if (!releasedAt.match(regexValidReleasedAt)) return res.status(400).send({ status: false, message: "please enter a valid Date('YYYY-MM-DD')" })

        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "userId is not Valid" });
        let correctuserId = await userModel.findById(userId)
        if (!correctuserId) return res.status(404).send({ status: false, message: "userId is not exist" })

        let findtitle = await bookModel.findOne({ title: title });
        if (findtitle) return res.status(409).send({ status: false, message: "title already exsits" });

        let findISBN = await bookModel.findOne({ ISBN: ISBN });
        if (findISBN) return res.status(409).send({ status: false, message: "ISBN already exsits" });

        const book = await bookModel.create(data)
        res.status(201).send({ status: true, data: book })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getBooks = async function (req, res) {
    try {
        let requestQuery = req.query
        let requestBody = req.body
        if (Object.keys(requestBody).length > 0) {
            return res.status(400).send({ status: false, msg: "Please enter the filters in requestQuery only" })
        }
        if (Object.keys(requestQuery).length == 0) {
            return res.status(400).send({ status: false, msg: "Please input the required filters" })
        }
        if (Object.keys(requestQuery).length > 3) {
            return res.status(400).send({ status: false, msg: "Invalid entry in requestQuery" })
        }
        if (requestQuery.userId) {
            if (!mongoose.Types.ObjectId.isValid(requestQuery.userId)) {
                return res.status(400).send({ status: false, msg: "userid validation failed" })
            }
        }
        let findBooks = await bookModel.find({ isDeleted: false, ...requestQuery }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
        if (!findBooks) {
            return res.status(404).send({ status: false, msg: "No books found by the given filters" })
        }
        res.status(200).send({ status: true, message: "Books list", data: findBooks })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

// PUT /books/:bookId
// Update a book by changing its
// title
// excerpt
// release date
// ISBN
// Make sure the unique constraints are not violated when making the update
// Check if the bookId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like this
// Return an HTTP status 200 if updated successfully with a body like this
// Also make sure in the response you return the updated book document.

const putBooks = async function(req,res) {

    try {

    requestBody = req.body
    requestQuery = req.query
    bookId = req.params.bookId

    if(Object.keys(requestQuery).length>0) return res.status(400).send({status:false,msg:"Please input the data in requestBody only"})
    if(Object.keys(requestBody).length==0) return res.status(400).send({status:false,msg:"Please input the details for updation"})
    if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:"bookId validation failed"})

    let findBook = await bookModel.findOne({_id:bookId})
    if(!findBook) return res.status(404).send({status:false,msg:"No book found with this bookId"})
    if(findBook.isDeleted==true) return res.status(409).send({status:false,msg:"The Book is already deleted , it can't be updated"})

    let {title,excerpt,releasedAt,ISBN} = requestBody

    if (!title.match(regexValidation)) return res.status(400).send({ status: false, message: "please enter a valid title" })
    if (!excerpt.match(regexValidation)) return res.status(400).send({ status: false, message: "please enter a valid excerpt" })
    if (!ISBN.match(regexValidISBM)) return res.status(400).send({ status: false, message: "please enter a valid ISBM" })
    if (!releasedAt.match(regexValidReleasedAt)) return res.status(400).send({ status: false, message: "please enter a valid Date('YYYY-MM-DD')" })

    let findtitle = await bookModel.findOne({ title: title });
    if (findtitle) return res.status(409).send({ status: false, message: "title already exsits enter a different title" });

    let findISBN = await bookModel.findOne({ ISBN: ISBN });
    if (findISBN) return res.status(409).send({ status: false, message: "ISBN already exsits enter a different ISBN" });

    let updateBook = await bookModel.findOneAndUpdate({isDeleted:false,_id:bookId},{$set:{title:title,excerpt:excerpt,releasedAt:releasedAt,ISBN:ISBN}},{new:true})
    
    res.status(200).send({ status: true,msg: "Sucessfully updated",data:updateBook });
    
    } catch (error) {
        res.status(500).send({ status: false,message: error.message});
    }
}

module.exports = { createbook,getBooks,putBooks }
 
