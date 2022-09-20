const { default: mongoose } = require("mongoose")
const bookController = require("../models/bookModel")

// Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field. Response example here
// Return the HTTP status 200 if any documents are found. The response structure should be like this
// If no documents are found then return an HTTP status 404 with a response like this
// Filter books list by applying filters. Query param can have any combination of below filters.
// By userId
// By category
// By subcategory example of a query url: books?filtername=filtervalue&f2=fv2
// Return all books sorted by book name in Alphabatical order

const getBooks = async function (req, res) {
    try {
        let requestQuery = req.query
        let requestBody = req.body
        if(Object.keys(requestBody).length>0) {
            return res.status(400).send({status:false,msg:"Please enter the filters in requestQuery only"})
        }
        if(Object.keys(requestQuery).length==0) {
            return res.status(400).send({status:false,msg:"Please input the required filters"})
        }
        if(Object.keys(requestQuery).length>3) {
            return res.status(400).send({status:false,msg:"Invalid entry in requestQuery"})
        }
        if(requestQuery.userId) {
            if(!mongoose.Types.ObjectId.isValid(requestQuery.userId)) {
                return res.status(400).send({status:false,msg:"userid validation failed"})
            }
        }
        let findBooks = await bookController.find({ isDeleted: false, ...requestQuery}).select({_id:1,title:1,userId:1,category:1,releasedAt:1,reviews:1}).sort({title:1})
        if (!findBooks) {
            return res.status(404).send({ status: false, msg: "No books found by the given filters" })
        }
        res.status(200).send({ status: true,message:"Books list",data:findBooks})
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.getBooks = getBooks
