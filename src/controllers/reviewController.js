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

        let findBook = await bookModel.findOne({ _id:bookId });
        if (!findBook) {
            return res
                .status(404)
                .send({ status: false, message: "no books with this Books id" });
        }

        if (findBook.isDeleted) {
            return res
                .status(200)
                .send({ status: true, message: "This book has been deleted" });
        }

        if (!rating) {
            return res
                .status(400)
                .send({ status: false, message: "rating is a required field" });
        }
        if (!(1<=rating<=5)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide a valid rating" });
        }

        let date = Date.now();
        let details = {
            bookId: bookId,
            reviewedBy: reviewedBy,
            reviewedAt: date,
            rating: rating,
            review: review,
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

            updatedBook["reviewsData"] = reviewCreated;

            return res
                .status(201)
                .send({ status: true, message: "Review published", data: updatedBook });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
// =========================================deletereview=============================//
const deleteReview = async function (req, res) {
    try {
        let review = req.params.reviewId
        let book = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(book)) return res.status(400).send({ status: false, message: "bookId is not Valid" });
        if (!mongoose.Types.ObjectId.isValid(review)) return res.status(400).send({ status: false, message: "reviewId is not Valid" });

        let findBook = await bookModel.findById(book)
        if (!findBook) return res.status(404).send({ status: false, message: "book does not exist" })
        if (findBook.isDeleted) return res.status(404).send({ status: false, message: "book already deleted you can't delete review" })


        let findreview = await reviewModel.findById(review)
        if (!findreview) return res.status(404).send({ status: false, message: "reviewId does not exist" })
        if (findreview.isDeleted) return res.status(404).send({ status: false, message: "review already deleted" })

        if (findreview.bookId != book) return res.status(400).send({ status: false, message: "You can't delete someone else review" })

        await bookModel.updateOne({ _id: book }, { $inc: { reviews: -1 } })
        await reviewModel.updateOne((findreview), { $set: { isDeleted: true } })
        
        return res.status(200).send({ status: true, message: "successfully deleted" })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { deleteReview, createReview }