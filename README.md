# Technical Challenge

## Prerequisite

Before you begin, make sure you have the following installed:

1. **Git** (make sure its added into your system's PATH environment)
   - [Download Git](https://git-scm.com/downloads)
2. **MySQL**
   - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
3. **Node.js**
   - [Download Node.js](https://nodejs.org/)

## Setup Instructions

### 1. Cloning the Repository

Open Git Bash.

Change the current working directory to the location where you want the cloned directory.

Type git clone, and then paste the URL you copied earlier.

```
cd Technical_Test
git clone https://github.com/Alywcs/TechnicalTest.git

```

### 2. Install Dependencies

Type in npm install in the root directory to install dependencies.

```
npm install
```

### 3. Create a .env File

Create a .env file in the root directory.

Add your environment variables:

```
PORT=your_port_number
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=your_mysql_schema
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h
```

### 4. Set Up MySQL Database

Open your MySQL Workbench.

Enter a MySQL Connection.

Right-click the schema column at the left side of the application.

Select "Create Schema..." option.

Provide a schema name.

Click on apply to create schema.

Double click on to the newly created schema to select the schema.

Type in the following in the query tab to create the "universities" table:

```
CREATE TABLE `universities` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Country` varchar(255) NOT NULL,
  `Webpages` longtext,
  `IsBookmark` tinyint NOT NULL DEFAULT '0',
  `Created` datetime NOT NULL,
  `LastModified` datetime NOT NULL,
  `IsActive` tinyint NOT NULL DEFAULT '1',
  `DeletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Name_UNIQUE` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

Next, type in the following in the query tab to create the "users" table:

```
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(45) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username_UNIQUE` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

```

### 5. Start the server

Type in npm start in the root directory to start the server.

```
npm start
```

### 6. Testing the Application

Before you can start using the application, you need to create a user to log in to get a JWT token for authentication

1. **Create a User**

Make a POST request to the `/createUser` endpoint to create a new user. You can do this using a tool like Postman or cURL.

_Example Request:_

```
POST http://localhost:<your_sql_port>/createUser
Content-Type: application/json
{
    "username": "exampleuser",
    "password": "examplepassword",
}
```

2. **Login to Get JWT Token**

After successfully creating a user, log in using the /login endpoint to retrieve a JWT token for authentication.

_Example Request:_

```
POST http://localhost:<your_sql_port>/login
Content-Type: application/json
{
  "username": "exampleuser",
  "password": "examplepassword"
}
```

If the credentials are correct, you will receive a JSON response with a JWT token.

Example Response:

```
{
    "success": true,
    "message": "You have successfully logged in.",
    "token": "your_jwt_token_here"
}
```

Use this token to authenticate other API requests by including it in the Authorization header.

1. How many hours did you spend on the challenge?
   I spent about 7 hours on the challenge.

2. What improvements or enhancements would you implement if you had more time?
   If I had more time, I would consider adding more user account CRUD functionalities to make the application more complete and flexible.

3. Which parts of your work are you most proud of?
   I’m most proud of how I structured the project. I made it modular and easy to navigate, which I believe makes it easier for other developers to understand and maintain the codebase.

4. Which parts of the challenge did you spend the most time on? What did you find most difficult?
   The most time-consuming part was getting MSSQL to work. Unfortunately, it didn’t work in the end due to some corrupted files that required a clean wipe, so I decided to switch to MySQL instead.
   The most difficult part was interpreting some of the technical requirements. For example, the challenge mentioned DELETE/university/{id} to delete a specific university, but the model also included a DeletedAt and isActive field. This made me question whether a soft delete (by setting the DeletedAt timestamp and toggle isActive to 1) was expected instead of a hard delete that removes the row entirely.

5. Did you use any libraries for the challenge? What are they used for? Why did you choose these libraries and not the alternatives?
   Yes, I used the following libraries:
   express: for setting up the web server and routes.
   dotenv: to manage environment variables securely.
   bcryptjs: for hashing passwords.
   jsonwebtoken: for handling token-based authentication.
   mysql2: for interacting with the MySQL database after MSSQL issues.

I chose these libraries based on familiarity. They are well-documented, and widely used in the Node.js ecosystem.

6. What do you think of the challenge overall?
   I thought the challenge was engaging and gave a good balance of backend implementation and real-world decision-making. It tested not just coding ability but also how to interpret and adapt to changing requirements.

7. How can we improve the challenge? We would love to hear them.
   It would be helpful to clarify certain parts of the requirements. For instance, making it explicit whether soft deletes or hard deletes are expected when a model includes a DeletedAt and isActive field.

8. Any other thoughts that you wish to share with us?
   Overall, I enjoyed working on the challenge! It was a great opportunity to demonstrate how I approach project structure, problem-solving, and adapting to technical issues. Thanks for the opportunity.
