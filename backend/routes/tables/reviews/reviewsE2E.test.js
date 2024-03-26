const supertest = require('supertest');
const createServer = require('../../../util/createServer.js');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const ReviewModel = require('./ReviewModel.js');

// Mock database setup for testing
const databaseInstantiationPayload = {
    identifiers: ["users", "books", "reviews"], // Dependencies, assuming reviews depend on users and books
    nonCascadeDeletions: ["reviews", "books", "users"],
    dataPayloads: [ /* predefined data arrays for users, books, and reviews */ ]
};

const databaseControl = new DatabaseControl(databaseInstantiationPayload);

beforeAll(async () => {
    await databaseControl.setupDatabase();
    // Here you might want to insert initial data for users and books to reference in reviews
});

afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

// Test data for reviews
const reviewData = {
    rating: 5,
    comment: "This is a test review.",
    user_id_fkey: 1, // Assume this is a valid user ID
    book_id_fkey: 1  // Assume this is a valid book ID
};

describe("E2E Testing for Reviews Route", () => {
    let reviewId;

    test("Create a new review (POST)", async () => {
        const response = await supertest(createServer())
            .post('/reviews')
            .send([reviewData])
            .expect(200);
        
        const createdReview = response.body.response[0];
        expect(createdReview.comment).toEqual(reviewData.comment);
        expect(createdReview.rating).toEqual(reviewData.rating);

        // Assuming the review ID is returned upon creation for reference in further tests
        reviewId = createdReview.review_id;
    });

    test("Retrieve reviews (GET)", async () => {
        await supertest(createServer())
            .get('/reviews')
            .expect(200)
            .then(response => {
                expect(Array.isArray(response.body.response)).toBeTruthy();
                // More detailed checks can be performed based on expected output
            });
    });

    test("Update a review (PUT)", async () => {
        const updatedComment = "Updated comment";
        const updatedReviewData = { ...reviewData, comment: updatedComment };

        await supertest(createServer())
            .put(`/reviews?id=[${reviewId}]`)
            .send([updatedReviewData])
            .expect(200)
            .then(response => {
                const updatedReview = response.body.response[0];
                expect(updatedReview.comment).toEqual(updatedComment);
            });
    });

    test("Delete a review (DELETE)", async () => {
        await supertest(createServer())
            .delete(`/reviews?id=[${reviewId}]`)
            .expect(200)
            .then(response => {
                expect(response.body.response[0]).toBeTruthy();
                // More detailed checks can be performed based on expected output
            });
    });
});