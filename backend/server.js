require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.use("/books", require('./routes/tables/books/routes.js'));
app.use("/authors", require('./routes/tables/authors/routes.js'));
app.use("/publishers", require('./routes/tables/publishers/routes.js'));
app.use("/users", require('./routes/tables/users/routes.js'));
app.use("/reviews", require('./routes/tables/reviews/routes.js'));
app.use("/genres", require('./routes/tables/genres/routes.js'));
app.use("/wishlists", require('./routes/tables/wishlists/routes.js'));

app.use("/books_by_genres", require('./routes/read_only_views/books_by_genres/routes.js'));
app.use("/books_by_authors", require('./routes/read_only_views/books_by_authors/routes.js'));
app.use("/average_book_ratings", require('./routes/read_only_views/average_book_ratings/routes.js'));
app.use("/top_sellers", require('./routes/read_only_views/top_sellers/routes.js'));
app.use("/shopping_carts", require('./routes/read_only_views/shopping_carts/routes.js'));

app.listen(PORT, () => console.log("app listening"));