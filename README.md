# Geek Text Group 8

## Table of Contents
### I. [Contributors](#contributors)
### II. [Getting Started](#getting_started)
### III. [Learning Resources](#learning_resources)

 1. JavaScript/NodeJS
 3. SQL/PostgreSQL
 4. MVC Design Pattern
 5. What is JSON?
 6. Extensive HTTP Networking Tutorial

## Contributors <a name="contributors"></a>
- Michael Rhodes
- Jasmine Perez
- Lizbeth Perez
- Lugenie Raymond
- David Reyes Romero
- Fabiola Rivera-Noriega

## Getting Started <a name="getting_started"></a>

#### 1. Install Visual Studio Code - https://code.visualstudio.com/download
#### 2. Install NodeJS (LTS) - https://nodejs.org/en/download/
#### 3. Install GIT - https://git-scm.com/downloads
When installing, accept all of the defaults except for the default editor. The installer will automatically set vim as the default. Select visual studio code as the default editor for git
#### 4. Open Visual Studio code and select the git bash terminal
#### 5. In web browser, go to repository press the code button.
There should be a https link. This be used in a CLI command in VSCode.
#### 6. Run command: git clone "and the https link you copied"
There should be an authentication pop. Use the browser option to authorize access
#### 8. Open the backend folder in a new window.
#### 9. Run "npm install" in the terminal.
- Make sure you are in the backend folder directory. Otherwise, npm will not find the associated package.json and not be able to execute the "npm install" command.
- The "npm install" command will install all of the third party dependencies associated with the project. These dependencies are located in the node_modules folder.

NOTE: You should never actually change the change the code in the node_modules folder nor should push these to
github.

#### 10. In the backend folder create a .env file
paste the contents into the .env file:

    PGUSER=postgres
    PGHOST=localhost
    PGDATABASE=geek_text
    PGPASSWORD=amazingPassword777!
    PGPORT=5432
#### 11. .env file notice

An .env file is where environment variables are stored. Environment variables contain sensitive information that should not be disclosed to anyone; these will include master keys to database or keys to third party apis. They should never be pushed to github. In later steps, you will create .gitignore file and place .env as contents in said .gitignore file.

***Understanding what these variables represent:***
In later steps, you will setup pgAdmin. PgAdmin is a client or interface for accessing and maintaining your locally hosted PostgreSQL databases. When creating resources for your postgresql servers and database, it will ask you to define various fields such as "user", "password", "database", "host", and "port". The contents of the .env file are will be injected into the build file at runtime. These environment variables will be comsumed by one of our dependencies called "node-postgres". node-postgres uses these variables to connect to the PostgreSQL server. If your environment variables to do not match the ones PgAdmin asks you to input, then you will most likely not be able to connect to the database.

#### 12. Install PostgreSQL Software - https://www.postgresql.org/download/

Download all of the associated software and drivers during the installation process.

NOTICE: When installing the PostgreSQL software, it will ask you for a root password. If you do not use "amazingPassword777!", then you must change PGPASSWORD field in the .env variable to this new password. If you forget your password, you will have to unistall PostgreSQL and reinstall everything.

    PGPASSWORD=amazingPassword777!
    // Must change to 
    PGPASSWORD="your new root password that defined during the PostgreSQL install"

Critically, during the installation, the software will ask you what port you want to host you server on. By default, PostgreSQL uses port 5432. If you cannot use this, just set it to port 5433. However, you must remember to update your .env file to this new port. Otherwise, the backend server will be able to connect and the node-postgresql dependency will not be to open a connection to your locally-hosted PostgreSQL database.

    PGPORT=5432
    // Must change to 
    PGPORT=5433
    
#### 13. Install PgAdmin - https://www.pgadmin.org/download/
#### 14. Open PgAdmin
#### 15. Create New server if one does not exist

You will know this if in the directory on the left does have a "PostgreSQL 18" or whatever current version PostgreSQL that you installed. Furthermore, the "Servers" directory is the server group that contains the PostgreSQL server called "PostgreSQL 18". This server is where you will execute the initialization script.

- There should be a directory on the left and some text called "Servers"

- Right-click on that and go to register and click on server

- A new window called Register -server will open up

- In the General tab, The name can be whatever you like

- Navigate to the Connection tab and the alter the following 4 fields: "Host name/address", "Port", "Username",
and "Password". Host name/address = "localhost", Port = whatever port you selected during the PostgreSQL install,
username = "postgres", and password = whatever root password you selected during the PostgreSQL install.

- Click on save. Now you should have a server in which you can create databases and run the database initialization setup script

#### 16. Connect to the server
If you have not already connected to your locally-hosted server, try to double click on this new server. A pop-up
should open. You must enter your root password

#### 17. Create a new database called "geek_text"

- In the directory to left, there should be a server group and a server nested within said server group. Click on the
server and then right click on it and select create database.

- A new window will open up there will be two fields that you must enter. These are "Database" which you will name
"geek_text" and "owner" which you will select "postgres"

- Click save to create the database

#### 18. Running the main.sql script

This file is in the cloned repo that you downloaded under the database folder. There should only be one file called
main.sql in it.

Under file, there is some text called "Object Explorer" there should be a button directly to the right of it called
"query tool". At first it will be grayed out. This is because you must first select a database in the directory.

After selecting the "geek_text", you will then press this "query tool" button and a new window should open in the center.

Now, try to open the main.sql file and execute it. There should be output at the bottom. If not, then something was done wrong or I gave you bad instructions.

#### 19. Go back to visual studio code and run the "npm run dev" command in the terminal

Again, make sure you are in the correct directory. Otherwise, npm will not be able to find the command and will
therefore not be able to start the server.

Upon executing the command, the terminal should output "app listening". Everything should be functional at this point and you should be ready to use Postman.

#### 20. Create an account with Postman and Install the Postman client. Or, you can use the web browswer

You will need to get invited to the workspace if you already have not. Just send me your email that you created
the account under.

#### 21. Use anyone of the routes in the Postman workspace to verify that everything is functional

***NOTICE:*** As of now, everyone in the postman workspace has administative privileges. Please do not modify any
preexisting routes. However, your are more than welcome to create new routes.

## Learning Resources For Our Project's Stack <a name="learning_resources"></a>

### JavaScript/NodeJS Tutorials

Here's a JavaScript tutorial from Dave Gray. It goes over basic JavaScript

https://www.youtube.com/watch?v=EfAl9bwzVZk&t=15666s

Here's a NodeJS tutorial. This is the tutorial I used to learn Node and Express. He goes over various npm dependencies that we will be using like dot-env, jwt, bcrypt, etc.

https://www.youtube.com/watch?v=f2EqECiTBL8&t=18984s

Additionally, he goes the MVC architectural pattern used in structuring his database. Although the current design isn't exactly in this format, I use something very similar; I declare the models and define props that are then consumed in the controllers.

### SQL/PostgreSQL
Here's an introduction to SQL:
https://www.youtube.com/watch?v=HXV3zeQKqGY&t=10475s

 Here's a tutorial on PostgreSQL:
 https://www.youtube.com/watch?v=qw--VYLpxG4&t=2930s
 
### MVC Design Pattern

Here's a link giving a brief overview of the Model, View, Controller Design Pattern. The current backend server and database make extensive use of this pattern. Currently, in the database I have multiple tables representing data constructs. However, I have implemented various views that constrict access to users and "package" the data into JSON for convenience in the backend. 

https://www.geeksforgeeks.org/mvc-design-pattern/#

https://www.youtube.com/watch?v=DUg2SWWK18I

### What is JSON? 

https://www.youtube.com/watch?v=iiADhChRriM

### Extensive HTTP Networking Tutorial 

This tutorial is pretty extensive and really goes in depth on how networking functions and what are some the standards with regards to HTTP.

https://www.youtube.com/watch?v=2JYT5f2isg4&t=1441s

### How to use Git/Github and Version Control

https://www.youtube.com/watch?v=RGOj5yH7evk&t=1174s

### Postman Tutorial

https://www.youtube.com/watch?v=VywxIQ2ZXw4&t=697s