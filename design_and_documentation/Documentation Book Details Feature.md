
### Book Details

#### Create Book

- **Endpoint:** `/books`
- **HTTP Method:** `POST`
- **Request Body:**
  ```json
  {
    "isbn": "string",
    "book_name": "string",
    "book_description": "string",
    "book_price": "number",
    "author_id_fkey": "number",
    "genre_id_fkey": "number",
    "publisher_id_fkey": "number",
    "year_published": "number",
    "copies_sold": "number"
  }
  ```
- **Response:** HTTP 200 OK with no body on success.

#### Retrieve Book by ISBN

- **Endpoint:** `/books?id={book_id}`
- **HTTP Method:** `GET`
- **Query Parameters:**
  - `id`: The unique identifier for the book.
- **Response:** 
  ```json
  {
    "response": {
      "book_id": "number",
      "isbn": "string",
      "book_name": "string",
      [...]
    }
  }
  ```

### Author Details

#### Create Author

- **Endpoint:** `/authors`
- **HTTP Method:** `POST`
- **Request Body:**
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "biography": "string"
  }
  ```
- **Response:** HTTP 200 OK with no body on success.

#### Retrieve Books by Author

- **Endpoint:** `/books_by_authors?author_id={author_id}`
- **HTTP Method:** `GET`
- **Query Parameters:**
  - `author_id`: The unique identifier for the author.
- **Response:**
  ```json
  {
    "response": [
      {
        "book_id": "number",
        "isbn": "string",
        "book_name": "string",
        [...]
      }
    ]
  }
  ```

### Common Errors

- **Status Code:** `400 Bad Request` - The request was unacceptable, often due to missing a required parameter.
- **Status Code:** `401 Unauthorized` - No valid API key provided.
- **Status Code:** `404 Not Found` - The requested resource doesn’t exist.
- **Status Code:** `500 Internal Server Error` - Something went wrong on the server.

### Authentication

- **Middleware:** `verifyJWTMiddleware` - Validates the JWT token provided in the `Authorization` header.
- **Middleware:** `verifyRolesMiddleware` - Validates if the authenticated user has the required role to access the endpoint.

### Middleware Used

- `bodyFormatValidationMiddleware` - Ensures that the request body matches the expected format.
- `schemaValidationMiddleware` - Validates the request body against the schema defined in `BookModel.js` or `AuthorModel.js`.

### Testing

- Endpoints have been tested with `supertest` to simulate HTTP requests and assertions.

---

### File References for Documentation

- **Model Definitions:** `BookModel.js`, `AuthorModel.js`
- **Route Handlers:** `booksRouter.js`, `authorsRouter.js`
- **Controllers:** Imported in routers and include `createController`, `readController`, `updateController`, `deleteController`
- **Validation Middleware:** `bodyFormatValidationMiddleware.js`, `queryStringValidationMiddleware.js`, `schemaValidationMiddleware.js`
- **Query Factories:** `SqlQueryFactory.js`
- **Environment Configurations:** `.env`

---

