DROP VIEW IF EXISTS books_by_genres;
DROP VIEW IF EXISTS top_sellers;
DROP VIEW IF EXISTS shopping_carts;
DROP VIEW IF EXISTS average_book_ratings;
DROP VIEW IF EXISTS books_by_authors;

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
			user_id					INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			username				VARCHAR(32)			UNIQUE NOT NULL,
			password				VARCHAR(256)		NOT NULL,
			first_name				VARCHAR(32),
			last_name				VARCHAR(32),
			email_address			VARCHAR(128)		UNIQUE,
			address					VARCHAR(128)
);

CREATE TABLE credit_cards (
			card_id					INT 				PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			credit_card_number		VARCHAR(256)		NOT NULL,
			expiration_date			VARCHAR(256)		NOT NULL,
			ccv						VARCHAR(256)		NOT NULL,
			user_id_fkey			INT					REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE authors (
			author_id				INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			first_name				VARCHAR(32)			NOT NULL,
			last_name				VARCHAR(32)			NOT NULL,
			biography				VARCHAR(4096)
);

CREATE TABLE publishers (
			publisher_id			INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			publisher_name			VARCHAR(32)			UNIQUE NOT NULL,
			discount_percent		INT					DEFAULT 0 NOT NULL
);

CREATE TABLE genres (
			genre_id				INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			genre_name				VARCHAR(32)			UNIQUE NOT NULL
);

CREATE TABLE books (
			book_id					INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			book_name				VARCHAR(128)		UNIQUE NOT NULL,
			isbn					VARCHAR(32)			UNIQUE NOT NULL,
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
			book_id_fkey			INT					REFERENCES books(book_id) ON DELETE CASCADE,
			wishlist_id_fkey		INT					REFERENCES wishlists(wishlist_id) ON DELETE CASCADE,
			PRIMARY KEY				(book_id_fkey, wishlist_id_fkey)
);

CREATE TABLE reviews (
			review_id				INT					PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			rating					INT					DEFAULT 5 NOT NULL,
			comment					VARCHAR(4096),
			datestamp				VARCHAR(16),
			user_id_fkey			INT					REFERENCES users(user_id) ON DELETE CASCADE,
			book_id_fkey			INT					REFERENCES books(book_id) ON DELETE CASCADE
);

CREATE TABLE shopping_carts_lt (
			user_id_fkey			INT					REFERENCES users(user_id) ON DELETE CASCADE,
			book_id_fkey			INT					REFERENCES books(book_id) ON DELETE CASCADE,
			PRIMARY KEY				(user_id_fkey, book_id_fkey)
);

-- Views

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
		(SELECT sum(subquery) FROM unnest((SELECT ARRAY_AGG(books.book_price))) AS "subquery") AS "shopping_cart_value",
		JSON_AGG(books.*) AS "shopping_cart"
		FROM books
		INNER JOIN shopping_carts_lt ON book_id_fkey = book_id
		GROUP BY user_id_fkey
;

CREATE VIEW average_book_ratings AS
	SELECT
		book_id_fkey AS "book_id",
		(SELECT avg(subquery) FROM unnest((SELECT ARRAY_AGG(reviews.rating))) AS "subquery") AS "average_rating"
		FROM reviews
		INNER JOIN books ON book_id = book_id_fkey
		GROUP BY book_id_fkey
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
-- Populate Tables

INSERT INTO users ( username, password, first_name, last_name ) VAlUES 
	( 'user 1', 'password', 'bob', 'adams' ),
	( 'user 2', 'password', 'bill', 'smalls' ),
	( 'user 3', 'password', 'benjamin', 'smith' )
;

INSERT INTO publishers ( publisher_name, discount_percent ) VALUES
	( 'publisher 1', 55 ),
	( 'publisher 2', 23 ),
	( 'publisher 3', 10 )
;

INSERT INTO genres ( genre_name ) VALUES
	( 'genre 1' ),
	( 'genre 2' ),
	( 'genre 3' ),
	( 'genre 4' )
;

INSERT INTO authors ( first_name, last_name ) VALUES
	( 'john', 'smith' ),
	( 'john', 'doe' ),
	( 'jane', 'doe' )
;

INSERT INTO books ( book_name, isbn, book_price, author_id_fkey, genre_id_fkey, copies_sold ) VALUES
	( 'book 1', 700, 100, 1, 1, 1 ),
	( 'book 2', 800, 100, 1, 1, 2 ),
	( 'book 3', 900, 200, 1, 2, 3 ),
	( 'book 4', 1000, 200, 2, 2, 4 ),
	( 'book 5', 1100, 300, 3, 3, 5 ),
	( 'book 6', 1200, 300, null, 3, 6 )
;

INSERT INTO shopping_carts_lt ( user_id_fkey, book_id_fkey ) VALUES
	( 1, 1 ),
	( 1, 2 ),
	( 2, 3 ),
	( 2, 4 ),
	( 3, 5 ),
	( 3, 6 )
;

INSERT INTO reviews ( rating, comment, user_id_fkey, book_id_fkey ) VALUES
	( 77, 'comment 1', 1, 1 ),
	( 78, 'comment 2', 1, 2 ),
	( 79, 'comment 3', 1, 3 ),
	( 80, 'comment 4', 2, 1 ),
	( 81, 'comment 5', 2, 4 ),
	( 82, 'comment 6', 3, 4 )
;

SELECT * FROM users;
SELECT * FROM books_by_genres;
--SELECT * FROM top_sellers;
--SELECT * FROM shopping_carts;
SELECT * FROM average_book_ratings;
--SELECT * FROM books_by_authors;

SELECT * FROM books;