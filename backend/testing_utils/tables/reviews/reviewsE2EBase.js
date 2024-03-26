const reviewsBase = require('./reviewsBase.js'); // assuming reviewsBase.js is in the same directory

const userIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Mock user IDs
const bookIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Mock book IDs

const reviewsE2EBase = {
    identifier: reviewsBase.identifier,
    data: reviewsBase.data.map((review, index) => ({
        ...review,
        book_id_fkey: bookIDs[index % bookIDs.length], 
        user_id_fkey: userIDs[index % userIDs.length] 
    })),
    fkeyReferences: reviewsBase.fkeyReferences
};

module.exports = reviewsE2EBase;
