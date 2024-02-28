require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const rateLimiterConfig = require('./middleware/rateLimiterConfig.js');

const app = express();
const PORT = process.env.PORT || 3500;

// const limiter = rateLimit({
//   windowMs: rateLimiterConfig.windowMs,
//   max: rateLimiterConfig.max,
//   message: rateLimiterConfig.message,
//   headers: rateLimiterConfig.headers,
// });

// app.use(limiter);

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.use("/books", require('./routes/tables/books/router.js'));
app.use("/authors", require('./routes/tables/authors/router.js'));
app.use("/publishers", require('./routes/tables/publishers/router.js'));
app.use("/users", require('./routes/tables/users/router.js'));
app.use("/reviews", require('./routes/tables/reviews/router.js'));
app.use("/genres", require('./routes/tables/genres/router.js'));
app.use("/wishlists", require('./routes/tables/wishlists/router.js'));
app.use("/credit_cards", require('./routes/tables/credit_cards/router.js'));

app.use("/shopping_carts_lt", require('./routes/linking_tables/shopping_carts_lt/router.js'));
app.use("/books_wishlists_lt", require('./routes/linking_tables/books_wishlists_lt/router.js'));

app.use("/books_by_genres", require('./routes/read_only_views/books_by_genres/router.js'));
app.use("/books_by_authors", require('./routes/read_only_views/books_by_authors/router.js'));
app.use("/average_book_ratings", require('./routes/read_only_views/average_book_ratings/router.js'));
app.use("/top_sellers", require('./routes/read_only_views/top_sellers/router.js'));
app.use("/shopping_carts", require('./routes/read_only_views/shopping_carts/router.js'));

app.use(function (error, req, res, next) {
    console.error(error);
    if (error.isCustomError) {
        res.status(error.statusCode).json({  "response": error });
    }
    else {
        res.status(500).json({ "response": "Internal Sever Error" });
    }
    next();
});

app.listen(PORT, () => console.log("app listening"));

module.exports = app;
