const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose');

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
        console.log(data)

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createbook }
