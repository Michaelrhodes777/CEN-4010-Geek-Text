DROP VIEW IF EXISTS comments_view;
DROP VIEW IF EXISTS books_by_wishlists;
DROP VIEW IF EXISTS shopping_carts;
DROP VIEW IF EXISTS average_book_ratings;
DROP VIEW IF EXISTS average_book_ratings_sub;
DROP VIEW IF EXISTS books_proper_alt;
DROP VIEW IF EXISTS books_proper;
DROP VIEW IF EXISTS users_quantity_of_wishlists;

DROP VIEW IF EXISTS books_by_genres;
DROP VIEW IF EXISTS top_sellers;
DROP VIEW IF EXISTS books_by_authors;

DROP VIEW IF EXISTS register;
DROP VIEW IF EXISTS login;
DROP VIEW IF EXISTS logout;
DROP VIEW IF EXISTS edit_user_data;
DROP VIEW IF EXISTS user_data;

DROP TABLE IF EXISTS books_wishlists_lt;
DROP TABLE IF EXISTS shopping_carts_lt;

DROP TABLE IF EXISTS credit_cards;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS authors;

CREATE TABLE users (
			user_id                 INT                 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			username                VARCHAR(32)         UNIQUE NOT NULL,
			password                VARCHAR(512)        NOT NULL,
			first_name              VARCHAR(32),
			last_name				VARCHAR(32),
			email_address			VARCHAR(128)        UNIQUE,
			address					VARCHAR(128),
			refresh_token			VARCHAR(512)		DEFAULT NULL,
			role					INT					DEFAULT 12789 NOT NULL
);

CREATE TABLE credit_cards (
			card_id                 INT 				PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			credit_card_number      VARCHAR(512)        NOT NULL,
			expiration         		VARCHAR(512)        NOT NULL,
			ccv                     VARCHAR(512)        NOT NULL,
			user_id_fkey            INT                 REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE authors (
			author_id				INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			first_name				VARCHAR(32)			NOT NULL,
			last_name				VARCHAR(32)			NOT NULL,
			biography				VARCHAR(4096)
);

CREATE TABLE publishers (
			publisher_id			INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			publisher_name			VARCHAR(64)			UNIQUE NOT NULL,
			discount_percent		INT					DEFAULT 0 NOT NULL
);

CREATE TABLE genres (
			genre_id				INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			genre_name				VARCHAR(32)			UNIQUE NOT NULL
);

CREATE TABLE books (
			book_id					INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			book_name				VARCHAR(256)		NOT NULL,
			isbn					VARCHAR(16)			UNIQUE NOT NULL,
			book_description		VARCHAR(4096),
			book_price				INT					NOT NULL,
			author_id_fkey			INT					REFERENCES authors(author_id) ON DELETE SET NULL,
			genre_id_fkey			INT 				REFERENCES genres(genre_id) ON DELETE SET NULL,
			publisher_id_fkey		INT					REFERENCES publishers(publisher_id) ON DELETE SET NULL,
			year_published			INT,
			copies_sold				INT					DEFAULT 0 NOT NULL
);

CREATE TABLE wishlists (
			wishlist_id				INT 				PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			wishlist_name			VARCHAR(64)			NOT NULL,
			user_id_fkey			INT					REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE books_wishlists_lt (
			book_id_fkey			INT					NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
			wishlist_id_fkey		INT					NOT NULL REFERENCES wishlists(wishlist_id) ON DELETE CASCADE,
			PRIMARY KEY				(book_id_fkey, wishlist_id_fkey)
);

CREATE TABLE reviews (
			review_id				INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			rating					INT					DEFAULT 5 NOT NULL,
			comment					VARCHAR(4096),
			datestamp				VARCHAR(16),
			timestamp      			TIMESTAMP			DEFAULT CURRENT_TIMESTAMP,
			user_id_fkey			INT					REFERENCES users(user_id) ON DELETE CASCADE,
			book_id_fkey			INT					REFERENCES books(book_id) ON DELETE CASCADE
);

CREATE TABLE shopping_carts_lt (
			user_id_fkey			INT					NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
			book_id_fkey			INT					NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
			quantity				INT					DEFAULT 0 NOT NULL,
			PRIMARY KEY				(user_id_fkey, book_id_fkey)
);

-- Views

CREATE VIEW comments_view AS
	SELECT
		book_id_fkey,
		JSON_AGG(reviews.comment) AS "comments"
		FROM reviews WHERE comment IS NOT null
		GROUP BY book_id_fkey
;

CREATE VIEW books_proper_alt AS
	SELECT
		book_id,
		book_name,
		isbn,
		book_description,
		(SELECT books.book_price - (books.book_price * publishers.discount_percent / 100) FROM publishers WHERE publisher_id = (SELECT books.publisher_id_fkey AS "publisher_id" WHERE "book_id" = book_id)) AS "book_price",
		(SELECT first_name || ' ' || last_name FROM authors WHERE author_id = books.author_id_fkey) AS "author",
		(SELECT genre_name FROM genres WHERE genre_id = genre_id_fkey) AS "genre",
		(SELECT publisher_name FROM publishers WHERE publisher_id = publisher_id_fkey) AS "publisher",
		year_published,
		books.copies_sold
		FROM books
;

CREATE VIEW books_proper AS
	SELECT
		book_id,
		JSON_BUILD_OBJECT(
			'book_id', books.book_id,
			'book_name', books.book_name,
			'isbn', books.isbn,
			'book_description', books.book_description,
			'book_price', (SELECT books.book_price - (books.book_price * publishers.discount_percent / 100) FROM publishers WHERE publisher_id = (SELECT books.publisher_id_fkey AS "publisher_id" WHERE "book_id" = book_id)),
			'author', (SELECT first_name || ' ' || last_name FROM authors WHERE author_id = books.author_id_fkey),
			'genre', (SELECT genre_name FROM genres WHERE genre_id = genre_id_fkey),
			'pusblisher', (SELECT publisher_name FROM publishers WHERE publisher_id = publisher_id_fkey),
			'year_published', books.year_published,
			'copies_sold', books.copies_sold
		) AS "book_data"
		FROM books
		GROUP BY book_id
;

CREATE VIEW users_quantity_of_wishlists AS
	SELECT 
		user_id_fkey,
		count(*) AS "number_of_wishlists"
		FROM wishlists
		GROUP BY user_id_fkey
;


CREATE VIEW register AS
	SELECT
		username,
		password,
		email_address
		FROM users
;

CREATE VIEW login AS
	SELECT
		username,
		password,
		refresh_token,
		role
		FROM users
;

CREATE VIEW logout AS
	SELECT
		user_id,
		refresh_token
		FROM users
;	

CREATE VIEW edit_user_data AS
	SELECT
		username,
		first_name,
		last_name,
		address
		FROM users
;

CREATE VIEW user_data AS
	SELECT
		user_id,
		username,
		first_name,
		last_name,
		email_address,
		address,
		refresh_token
		FROM users
;

CREATE VIEW books_by_genres AS
	SELECT
		genre_id,
		genre_name,
		JSON_AGG(books.*) AS "books"
		FROM genres
		INNER JOIN books ON books.genre_id_fkey = genre_id
		GROUP BY genre_id, genre_name
;

CREATE VIEW top_sellers AS
	SELECT
		*
		FROM books
		GROUP BY copies_sold, book_id
		ORDER BY copies_sold DESC LIMIT 10
;

CREATE VIEW shopping_carts AS
	SELECT
		user_id_fkey AS "user_id",
		JSON_AGG(
        	json_build_object(
			'quantity', shopping_carts_lt.quantity,
            'book_data', books_proper_alt.*)
		) AS "shopping_cart"
		FROM books_proper_alt
		INNER JOIN shopping_carts_lt ON book_id_fkey = book_id
		GROUP BY user_id_fkey
;

CREATE VIEW average_book_ratings_sub AS
	SELECT
		book_id_fkey,
		(SELECT avg(subquery) FROM unnest((SELECT ARRAY_AGG(reviews.rating))) AS "subquery") AS "average_rating"
		FROM reviews
		INNER JOIN books ON book_id = book_id_fkey
		GROUP BY book_id_fkey
;

CREATE VIEW average_book_ratings AS
	SELECT
		book_id_fkey AS "book_id",
		average_rating,
		JSON_AGG((SELECT x FROM (SELECT * FROM books_proper_alt WHERE books_proper_alt.book_id = book_id_fkey) AS x)) AS "book"
		FROM average_book_ratings_sub
		GROUP BY book_id_fkey, average_rating
;

CREATE VIEW books_by_authors AS
	SELECT
		author_id,
		first_name,
		last_name,
		CONCAT(first_name, ' ', last_name) AS "author_full_name",
		JSON_AGG(books.*) AS "books"
		FROM authors
		INNER JOIN books ON author_id = author_id_fkey
		GROUP BY author_id
;

CREATE VIEW books_by_wishlists AS
	SELECT
	wishlist_id_fkey AS "wishlist_id",
	JSON_AGG(books_proper.book_data) AS "books"
	FROM books_wishlists_lt
	INNER JOIN books_proper ON book_id = book_id_fkey
	GROUP BY wishlist_id_fkey
;