const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const mongoose = require('mongoose')

const createReview = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        let requestBody = req.body;

        let { review, reviewedBy, rating } = requestBody;

        if (!bookId) {
            return res
                .status(400)
                .send({ status: false, message: "please give bookId" });
        }

        let validateBookId = mongoose.isValidObjectId(bookId);

        if (!validateBookId) {
            return res
                .status(400)
                .send({ status: false, message: "this is not a valid bookId" });
        }

        let findBook = await bookModel.findOne({ bookId });
        if (!findBook) {
            return res
                .status(404)
                .send({ status: false, message: "no books with this Books id" });
        }

        if (findBook.isDeleted) {
            return res
                .status(404)
                .send({ status: false, message: "This book has been deleted" });
        }

        if (!rating) {
            return res
                .status(400)
                .send({ status: false, message: "rating is a required field" });
        }
        if (!(rating <= 5 && rating >= 1)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide a valid rating" });
        }

        if (!review) {
            return res
                .status(400)
                .send({ status: false, message: "review is a required field" });
        }

        let date = Date.now();
        let details = {
            bookId: bookId,
            reviewedBy: reviewedBy.trim(),
            reviewedAt: date,
            rating: rating,
            review: review.trim(),
        };
        const isValid = function (value) {
            if (typeof value == "undefined" || value == null) return false;
            if (typeof value == "string" && value.trim().length > 0) return true;
        };

        if (isValid(reviewedBy)) {
            details["reviewedBy"] = reviewedBy;
        }

        // if requestBody does not have the "reviewedBy name" then assigning its default value "Guest"
        else {
            details["reviewedBy"] = "Guest";
        }

        let reviewCreated = await reviewModel.create(details);

        if (reviewCreated) {
            // USING .lean() to convert mongoose object to plain js object for adding a property temporarily
            let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new: true }).lean();

            updatedBook["reviewData"] = reviewCreated;

            return res
                .status(201)
                .send({ status: true, message: "Review published", data: updatedBook });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
// =========================================deletereview=========================
const deleteReview = async function (req, res) {
    try {
        let review = req.params.reviewId
        if (Object.keys(review).length == 0) return res.status(400).send({ status: false, message: "plzz give reviewId" });
        let book = req.params.bookId
        if (Object.keys(book).length == 0) return res.status(400).send({ status: false, message: "plzz give BookId" });
     
        if (!mongoose.Types.ObjectId.isValid(book)) return res.status(400).send({ status: false, message: "bookId is not Valid" });
        if (!mongoose.Types.ObjectId.isValid(review)) return res.status(400).send({ status: false, message: "reviewId is not Valid" });

        let findreview = await reviewModel.findById(review)
        if (!findreview) return res.status(400).send({ status: false, msg: "reviewId dose not exist" })
        if (findreview.isDeleted) return res.status(404).send({ status: false, msg: "review already deleted" })

        if (findreview.bookId != book) return res.status(400).send({ status: false, msg: "bookId dose not macth" })

        let updatedBook = await bookModel.updateOne({_id:book}, { $inc: { reviews: -1 } }, { new: true }).lean();

        await reviewModel.updateOne((findreview), { $set: { isDeleted: true } })
        return res.status(200).send({ status: true, msg: "successfully deleted"})
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { deleteReview, createReview }