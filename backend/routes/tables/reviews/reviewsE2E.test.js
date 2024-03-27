const supertest = require('supertest');
const createServer = require('../../../util/createServer.js');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;

// Define identifiers used for setting up the mock database
const identifiers = [tableNamesMap.users, tableNamesMap.books, tableNamesMap.reviews];

// Mock database setup for testing
const databaseInstantiationPayload = {
    identifiers, 
    nonCascadeDeletions: [tableNamesMap.reviews],  // Adjust based on actual dependency management
    dataPayloads: identifiers.map(identifier => tablesE2EBaseMap[identifier])
};

const databaseControl = new DatabaseControl(databaseInstantiationPayload);

beforeAll(async () => {
    jest.setTimeout(10000);  // Increase timeout for setup if needed
    await databaseControl.setupDatabase();
    // Insert initial data for users and books to reference in reviews, if necessary
}, 10000);

afterAll(async () => {
    await databaseControl.tearDownDatabase();
}, 10000);

// Test data for reviews
const reviewData = {
    rating: 5,
    comment: "This is a test review.",
    user_id_fkey: 1,  // Adjust these IDs based on the actual seeded data in your test setup
    book_id_fkey: 1
};

describe("E2E Testing for Reviews Route", () => {
    let reviewId;

    test("Create a new review (POST)", async () => {
        const response = await supertest(createServer())
            .post('/reviews')
            .send([reviewData]);
        
        expect(response.statusCode).toBe(200);
        const createdReview = response.body.response[0];
        expect(createdReview.comment).toEqual(reviewData.comment);
        expect(createdReview.rating).toEqual(reviewData.rating);

        // Assuming the review ID is returned upon creation for reference in further tests
        reviewId = createdReview.review_id;
    });

    test("Retrieve reviews (GET)", async () => {
        const response = await supertest(createServer())
            .get('/reviews');
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.response)).toBeTruthy();
        // More detailed checks can be performed based on expected output
    });

    test("Update a review (PUT)", async () => {
        const updatedComment = "Updated comment";
        const updatedReviewData = { ...reviewData, comment: updatedComment };

        const response = await supertest(createServer())
            .put(`/reviews?id=[${reviewId}]`)
            .send([updatedReviewData]);

        expect(response.statusCode).toBe(200);
        const updatedReview = response.body.response[0];
        expect(updatedReview.comment).toEqual(updatedComment);
    });

    test("Delete a review (DELETE)", async () => {
        const response = await supertest(createServer())
            .delete(`/reviews?id=[${reviewId}]`);

        expect(response.statusCode).toBe(200);
        expect(response.body.response[0]).toBeTruthy();
        // More detailed checks can be performed based on expected output
    });
});
