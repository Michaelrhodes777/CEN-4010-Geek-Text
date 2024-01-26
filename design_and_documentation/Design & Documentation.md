# Backend Server Design Document / Documentation

## Introduction:

Geek Text is a REST API made with a NodeJS / ExpressJS backend and a PostgreSQL database. It employs an MVC pattern with direct CRUD access to all data tables and read only views with aggregated JSON data.

Routes with full CRUD Access:

>- **/books**
>- **/authors**
>- **/publishers**
>- **/users**
>- **/reviews**
>- **/genres**
>- **/wishlists**

Routes with Read only Access:

>- **/books_by_genres**
>- **/books_by_authors**
>- **/average_book_ratings (has /:book_id GET route and /:average_rating GET route)**
>- **/top_sellers**
>- **/shopping_carts**

Additionally, for the purpose of creating composable http routes with querystring extensions, a SqlQueryFactory (uses Factory Pattern to call component classes) was implemented to easily call query object construction. This allows the backend server to reduce boiler plate controller functions by creating a higly composable controller constructor. Furthermore, there is an implicitly defined “interface” for query object; this project employs node-postgres for PostgreSQL client connection, querying, and transaction control. node-postgres uses the following pattern to create queries :

```js
// Directly from node-postgres documentation
const  query  = {
	text:  'INSERT INTO users(name, email) VALUES($1, $2)',
	values: ['brianc',  'brian.m.carlson@gmail.com'],
};

const  res  =  await  client.query(query);
console.log(res.rows[0]);
```
```js
// Alternative pattern from node-postgres documentation
const  text  =  'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *';
const  values  = ['brianc',  'brian.m.carlson@gmail.com'];

const  res  =  await  client.query(text, values);
console.log(res.rows[0]);
```
_**NOTE:** This pattern is the only means by which the backend server communicates with the database. All data that is to persisted and/or queried flows through this pattern. This pattern is exclusively consumed/untilized in controller functions. Try to see if you can find in the code below._

*Please follow the following to learn more about querying with node-postgres:*

>[https://node-postgres.com/features/queries](https://node-postgres.com/features/queries)

Here is a code snippet for a controller “constructor”

```js
// This is the general pattern of contoller used for the view-based routes
function  getViewByIdController(tableName, options  = { "hasParams": true, "isSingleRow": true}) {

	return  async  function(req, res) {
		const  client  =  clientFactory();
		let  results  = [];
		let  transactionHasBegun  =  false;
		try {
		
			await  client.connect();
			await  client.query("BEGIN");
			transactionHasBegun  =  true;
			const  queryObject  = {
				text: `SELECT * FROM ${tableName}`
			};
			
			if (options.hasParams) {
				const  param_name  =  Object.keys(req.params)[0];
				const  data  =  req.params[param_name];
				queryObject.text  =  queryObject.text  +  ` WHERE ${param_name} = $1`,
				queryObject.values  = [ data ];
			}

			const  response  =  await  client.query(queryObject);
			// cleanRowData is defined above the this function declaration in the actual codebase
			results  =  cleanRowData(response, options.isSingleRow);
			await  client.query("COMMIT");
			res.json({ "response": results });
		}

		catch (error) {
			if (transactionHasBegun) await  client.query("ROLLBACK");
			console.error(error);
			res.status(500).json({ "response": error });
		}

		finally {
			await  client.end();
		}

	};
}
```

_**NOTE:** This is not an actual constructor, but rather a function that returns a reference to an anonymous asynchronous function. This is the general pattern used across the entire backend server. Once you understand this controller function, you essentially understand the entire project. The next sections will eludicate how this code gets called, where it gets called, and why the different sections are composed the way that they are._

## Understanding server.js

The server.js file utilizes the ExpressJS framework to parse incoming HTTP requests. There is various setup prior to the routes. These are middleware that ExpressJS automatically composes; for example, there is a cors middleware, urlencoded, and a json parse in the current iteration of server.js.

Moving on to the actual routes, there are various routes that ExpressJS automatically calls depending on the path portion of the string. At this level, and also based on the way routes are called, parameters and additional paths will not be parsed. Further routing functionality will occur within routes.js files (exported router functions).

![enter image description here](https://res.cloudinary.com/ddl4jnyxi/image/upload/v1706292431/url_anatomy_image_example.png)

*Go to the following links to learn more about URL string anatomy*
>https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL
https://doepud.co.uk/anatomy-of-a-url

The way to conceptualize the server.js file is to separate the initial middleware from the route parsings. The middleware occurs before the various app.use() calls.

```js
// Middleware directly pulled from server.js
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
```

**Critically**, ExpressJS automatically parses requests object’s bodies when calling app.use(express.json({….}); this is one the many features and quality of life improvements that come with using a routing framework like ExpressJS. See Understanding Middleware in ExpressJS section for more information.

Then, the actually route portion of the server.js comes next. You can see the various routes that the project employs here:

```js
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
```
>*NOTE: the require(....) portion in each of these routes is actually a function. Later sections will explain this in greater detail. It is synonymous to the following code pattern:*

```js
// https://www.geeksforgeeks.org/express-js-app-use-function/
app.get('/user', function (req, res) {
	console.log("/user request called");
	res.send('Welcome to GeeksforGeeks');
});
```

This section section is essentially a switch/conditional logic url parser. It abstracts away the need to write parsing logic (without the ExpressJS framework, you would have to write parsing logic for each path, querystring, param, and semantic HTTP verb. Again, ExpressJS is a massive quality of life improvement for writing backend servers and APIs). Observe the following code pattern:

```js
app.use("/books",  require('./routes/tables/books/routes.js'));
```

The first argument is a path and the second argument is actually a router function (when you create a routes.js file within the project, you are actually creating a router function that conditionally calls distinct controllers). When you invoke require(….), you are actually importing the router module associated with that particular path. This router will further parse paths if need be. It also provides another abstraction useful for compiling with Semantic HTTP verb protocols.

## Understanding router.js

router.js is a simple router function (or exported module) that returns a router to the server.js. This returned router will be consumed by the app.use() invocation within in the server.js file. Upon consuming it, server.js will be able further differentiate which route logic to call. This due explicitly to the various HTTP semantic verbs that you appended to router.route(“”). Observe the following code snippet to understand the aforementioned:

```js
// books router.js from backend server
const  express  =  require('express');
const  router  =  express.Router();
const  BookModel  =  require('./BookModel.js');
const {
	createController,
	readController,
	putController,
	deleteController
} =  require('../controllers.js');

router.route("/")
	.post(createController(BookModel))
	.get(readController(BookModel))
	.put(putController(BookModel))
	.delete(deleteController(BookModel));

module.exports  =  router;
```

Before transitioning into the controller portion of this Design Document, you must understand what you are passing to these appended routes. These are references to functions, not actually function invocations. Furthermore, due to the requirements of the specs, these function have to be asynchronous since we are linking to a database (logically speaking, instantaneous data persistence and/or retrieval is impossible due to the backend server and the databases being completely isolated systems; therefore, any and all communication with the database must be done asynchronously). Within the ExpressJS framework, these controller functions have an explicit format. Observer the following code:

```js
function controller(req, res) {
	// logic
	res.json({ "response": "this is a response string" });
}
```

They must have two parameters (req and res), and they must call res.json() or res.status(~status code~).json(). req contains various data elements which were parsed previously by the express.json() middleware (located in the beginning of server.js). res is the response object that will be returned to user requesting server resources. Returning to the requirements of a controller, res.json() automatically returns a semantic http response to the user, and .status() just appends a status code to said response object; I believe express defaults to status code 200 upon calling res.json() (that is why you’ll only see res.json() in some places and res.status(~status code~) in other places).

## Understanding controllers.js

All of the controllers return an asynchronous function definion to the router. You can conceptualize the controller as a wrapper containing a controller. This is done for two reasons.

### I. Firstly, the wrapper portion passes a Model reference (or class) to the internal logic of the actual asynchronous controller.

Observe:

```js
// This is the wrapper pattern for controllers consumed by router.js files in the tables routes
function  createController(Model) {
	return  async  function(req, res) {
		// Logic
		// Model will be consumed somewhere within the logic of this async function
	};
}
```
>***NOTE:** If you look into the code base and observe the controller file for the view-base routes, there will be a slightly different pattern. This is due to the fact that I only need the tableName static property of the Model class/reference, not the entire Model. However, you must recognize that a Model class/reference is still being consumed at the some in the routing-logic-chain. Which is the view-based case, Model will be consumed in some arbitrary router.js file.*

This allows me compose logic in the various routers, thus saving me a tremendous amount of boiler plate code. Specifically, I import the corresponding Model class for each route and then pass it to this controller wrapper. Otherwise, I would have to define an individual controller for each route and import the class there thus 10xing the amount of code I have to write, maintain, and test.

### II. Secondly, ExpressJS’s controller must have two parameters in their function declarations. 

I cannot pass Model as a third parameter because express actually interprets this as middleware. When invoking app.use() and passing functions to it, a third parameter is actually interpreted by ExpressJS as a method to end the execution of the middleware (you’ll almost always see this defined as next where it is called at the end of the middleware). Therefore, I cannot simply just pass a Model reference directly in the router. Rather, I have to call a function that returns a reference to an asynchronous controller.

```js
// Directly from ExressJS M middleware documentation
const myLogger = function (req, res, next) {
	 console.log('LOGGED')
	 next()
}
```
*Follow the link to understand more about middleware in ExpressJS:*
> https://expressjs.com/en/guide/writing-middleware.html

```js
// controller in tables-base routes that is associated with GET requests
function  createController(Model) {
	return  async  function(req, res) {
		const  client  =  clientFactory();
			let  results  = [];
			let  transactionHasBegun  =  false;
			try {
				await  client.connect();
				await  client.query("BEGIN");
				transactionHasBegun  =  true;
				
				// OBSERVE: Actual logic where Model gets consumed
				const  data  =  req.body;
				const  queryFactory  =  new  SqlQueryFactory(Model, data, "create");
				const  queryObject  =  queryFactory.getSqlObject();
				const  response  =  await  client.query(queryObject);
				
				results  =  response.rows[0];
				await  client.query("COMMIT");
				res.json({ "response": results });
			}
			catch (error) {
				if (transactionHasBegun) await  client.query("ROLLBACK");
				console.error(error);
				res.status(500).json({ "response": error });
			}
			finally {
				await  client.end();
			}
	};
}
```

As you can see within the codebase, there is a bunch of repeated code. This is just related to the try, catch, finally error handling and opening clients to the database with node-postgres. Additionally, there is transaction blocking to ensuring atomic transactions. As already mentioned at the end of the routes.js section, res.json() and res.status(~status code number~) methods invocations are just ExpressJS abstractions to easily add fields/properties to a response object (without ExpressJS’s abstraction, you would have to write functions, classes, and logic to meet the guidelines and specifications of HTTP responses. Furthemore, you would to maintain and write tests for all of this).

In the middle portion of each route, there is the actual data destructuring, query construction, and query execution logic. This logic is fundementally built around the node-postgres library. I am meeting the implictily defined “interface” for query objects and using its built-in, asynchronous query execuction logic. Furthermore, you’ll see a SqlQueryFactory() constructor invocation here; its sole existence is to meet this implicitly defined “interface” and to encapsulate logic away from the controller.

_Here’s a link to understanding A.C.I.D. principles for database design (a stands for atomicity):_

> https://www.databricks.com/glossary/acid-transactions. 
> *Tldr: transactions must be all or nothing. Revert any and all changes upon getting an error*

*Here’s a link to the node-postgres documentation to transactions when using this dependency:*

> https://node-postgres.com/features/transactions

## Understanding the SqlQueryFactory:

The SqlQueryFactory implements a factory pattern to compose various implementations of SQL query object construction.

_Here’s a video from Fireship to understand some of the common design patterns:_

> https://www.youtube.com/watch?v=tv-_1er1mWI&t=571s&ab_channel=Fireship

Fundamentally, this pattern allows to decouple controllers from query construction logic. The factory pattern portion is invoked by the condition string. I invoke data packaging logic within the different cases of the switch statement. I would rather do that within the factory class than in each controller. Whenever, I need to make a change it occurs within the class, not the controller. Whenever, I need more functionality, I just add another case to the switch statement (this also makes this pattern more extensible). Observe the Factory pattern's switch statement (this where different classes get called):

```js
switch (condition) {
	case  CONDITIONS.create:
		sql  =  new  InsertSql(
			Model.tableName,
			Model.updateableColumns,
			data
		);
		break;
	case  CONDITIONS.read_by_id:
		sql  =  new  ReadSqlById(
			Model.tableName,
			idName,
			data
		);
		break;
	case  CONDITIONS.read_all:
		sql  =  new  ReadSqlAll(
			Model.tableName,
		);
		break;
	case  CONDITIONS.put:
		sql  =  new  UpdateSql(
			Model.tableName,
			Model.updateableColumns,
			data,
			[ idName, data[idName] ]
		);
		break;
	case  CONDITIONS.delete:
		idName  =  Model.idName;
		sql  =  new  DeleteSql(
			Model.tableName,
			idName,
			data[idName]
		);
		break;
	default:
		throw  new  Error(`SqlQueryFactory: called with wrong ~condition~ ${condition}. Switch fall through occured`);
}
```

_This is a perfect case for the SOLID principles. Here's a link:_

> https://www.educative.io/blog/solid-principles-oop-c-sharp?utm_campaign=brand_educative&utm_source=google&utm_medium=ppc&utm_content=performance_max&eid=5082902844932096&utm_term=&utm_campaign=%5BNew%5D+Performance+Max&utm_source=adwords&utm_medium=ppc&hsa_acc=5451446008&hsa_cam=18511913007&hsa_grp=&hsa_ad=&hsa_src=x&hsa_tgt=&hsa_kw=&hsa_mt=&hsa_net=adwords&hsa_ver=3&gad_source=1&gclid=Cj0KCQiAqsitBhDlARIsAGMR1RjWDartjX5fJiKAR-w8pvSdAPbGhJNnoetsyqJqmyu1YphQOajQhSAaAhXZEALw_wcB

As you can probably tell by the names of the other classes within the SqlQueryFactory module, they correspond to the CRUD logic and sematic HTTP verbiage. These classes execute the actual logic associated with creating, reading, updating, and deleting fields within the database. Remember the whole point of this module is to meet the implicitly defined “interface” of query objects within the node-postgres dependency. At the moment they have only two sections: a constructor() and a getSqlQuery() method. The constructor executes the logic of the class (this should actually be separated out into a separate function in order to write tests). The getSqlQuery() method just packages the internal fields of the classes for consumption in node-postgres.

***NOTICE:** You’ll see an interface in the in Figma document that is the superordinate class of these CRUD Sql classes. It is labeled faux as it does not actually exist within the codebase. However, you can see the apparent pattern of behavior and functionality is exactly same across all of these classes. This should probably be explicitly defined at some point when we know that the routes are not going to change anymore.*

Critically, this module consumes a Model class with static properties that are associated with the database architecture and design. Without this design decision, this pattern would be useless, as the static database-Model properties are shorthand means of calling internally nested logic within and implicit to the factory pattern module.

## Understanding the Model Interface:

The models are very straightforward in how they are defined. tableName is corresponding table in the database. columnNamesMap is map of the columns associated to said table. columnNamesArray is the just the array form of the map. idName is the primary key associated with the table (consumed in where clauses of SQL strings). updatableColumns are all of the columns that can be updated in PUT routes/controllers (you cannot update a primary key within the database. Furthermore, I generally define the primary key as the first element of the columnNamesArray so I can just cut it out with array.slice(1) ).

```js
const  columnNames  = {
	"book_id": "book_id",
	"isbn": "isbn",
	"book_name": "book_name",
	"book_description": "book_description",
	"book_price": "book_price",
	"author_id_fkey": "author_id_fkey",
	"genre_id_fkey": "genre_id_fkey",
	"publisher_id_fkey": "publisher_id_fkey",
	"year_published": "year_published",
	"copies_sold": "copies_sold"
};

class  BookModel {
	static  tableName  =  "books";
	
	static  columnNamesMap  =  columnNames;
	
	static  columnNamesArray  = [
		columnNames.book_id,
		columnNames.isbn,
		columnNames.book_name,
		columnNames.book_description,
		columnNames.book_price,
		columnNames.author_id_fkey,
		columnNames.genre_id_fkey,
		columnNames.publisher_id_fkey,
		columnNames.year_published,
		columnNames.copies_sold
	];
	
	static  idName  =  columnNames.book_id;
	
	static  updateableColumns  =  BookModel.columnNamesArray.slice(1);
}

module.exports  =  BookModel;
```

The actual definition of the interface is very simple. However, where and how these static properties are consumed is not as straight forward. Why I architected the backend server this way may not be apparent at all. Essentially, this Model Interface pattern allows me to call logic in various places around the project. Where there is a static property defined, there is a corresponding usage/consumption some place else within the project. Critically, this allows me to abstract out logic from the model and create modules and libraries that consume these static properties. I want the models to control what logic gets called by simplify defining and extending properties.

For example, columnNamesMap defines what columns can be associated with request data. Only request object properties that share an element with the columnNamesMap can even be written to SQL objects; any columns in a request object that are invalid can never by instantiated into a SQL object and, therefore, can never be persisted to the database. The following demonstrates how this columnNamesMap gets consumed (columnNamesMap converts to columnNamesArray within the Model class). The logic within the for loop is not important, but the ***"for (let columnName of columnNamesArray)"*** is critical for understanding how the columns associated with the database are acutally queried. 

```js
for (let  columnName  of  columnNamesArray) {
	if (dataObject.hasOwnProperty(columnName)) {
		minColumnNamesArray.push(`"${columnName}"`);
		valuesArray.push(dataObject[columnName]);
		valueIdentifiersArray.push(`$${identifierNum++}`);
	}
}
```

## Dependencies & Documentation Links:

NodeJS:

>https://nodejs.org/docs/latest/api/

ExpressJS:

> https://expressjs.com/

node-postgres:

> https://node-postgres.com/

bcrypt:

> https://www.npmjs.com/package/bcrypt

dotenv:

> https://www.npmjs.com/package/dotenv

jwt:

>https://jwt.io/