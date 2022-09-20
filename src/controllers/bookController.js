const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose');
let regexValidation = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/;
let regexValidISBM =/^[\d*\-]{10}|[\d*\-]{13}$/;



const createbook = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "plzz give some data" });

        const { title, excerpt, userId, ISBN, category, subcategory, reviews, } = data

        if (!title) return res.status(400).send({ status: false, msg: "Enter title" });
        if (!excerpt) return res.status(400).send({ status: false, msg: "Enter excerpt" });
        if (!userId) return res.status(400).send({ status: false, msg: "Enter userId" });
        if (!ISBN) return res.status(400).send({ status: false, msg: "Enter ISBN" });
        if (!category) return res.status(400).send({ status: false, msg: "Enter category" });
        if (!subcategory) return res.status(400).send({ status: false, msg: "Enter subcategory" });
        if (!reviews) return res.status(400).send({ status: false, msg: "Enter reviews" });

     
        

        if(!mongoose.Types.ObjectId.isValid(userId))
        return res.status(400).send({ status: false, msg: "userId is not Valid"});

        let correctuserId = await userModel.findById(userId)
        if (!correctuserId) return res.status(404).send({ status: false, msg: "userId is not exist" })

        let findtitle = await collegeModel.findOne({ title: title });
        if (findtitle) return res.status(409).send({ status: false, msg: "title already exsits" });

        let findISBN = await collegeModel.findOne({ ISBN: ISBN });
        if (findISBN) return res.status(409).send({ status: false, msg: "ISBN already exsits" });

        const book = await bookModel.create(data)
        res.status(201).send({ status: true, data: book })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createbook }