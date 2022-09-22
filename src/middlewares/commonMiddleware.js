const jwt = require("jsonwebtoken")
const { default: mongoose } = require("mongoose")


const authentication = async function(req,res,next) {
    let bookId = req.params.bookId
    if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:"bookId validation failed"})
    let find
}