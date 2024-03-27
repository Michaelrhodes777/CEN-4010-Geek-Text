const supertest = require('supertest');
const createServer = require('../../../util/createServer.js');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;

// Assuming ReviewModel is correctly defined in the provided path
const ReviewModel = require('./ReviewModel.js');

// Setup identifiers and database instantiation payload
const identifiers = [tableNamesMap.users, tableNamesMap.books, tableNamesMap.reviews];
const databaseInstantiationPayload = {
    identifiers, 
    nonCascadeDeletions: [tableNamesMap.users, tableNamesMap.books],
    dataPayloads: identifiers.map(identifier => tablesE2EBaseMap[identifier])
};

const databaseControl = new DatabaseControl(databaseInstantiationPayload);

// Increase the timeout for beforeAll and afterAll
const setupTimeout = 30000; // 30 seconds, adjust as needed

beforeAll(async () => {
    await databaseControl.setupDatabase();
}, setupTimeout);

afterAll(async () => {
    await databaseControl.tearDownDatabase();
}, setupTimeout);

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

        reviewId = createdReview.review_id;
    });

    test("Retrieve reviews (GET)", async () => {
        await supertest(createServer())
            .get('/reviews')
            .expect(200)
            .then(response => {
                expect(Array.isArray(response.body.response)).toBeTruthy();
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
            });
    });
});
