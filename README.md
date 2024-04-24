Steps to run the project --

Clone the project to you computer
Install Node.js
Open with code editor like - VS Code
Open the terminal in VS Code
Type -- npm run dev 

Now the server is started on PORT 4000 and MongoDB is connected

Test the APIs in POSTMAN
Following are the examples of APIs ----
---------------------------------------------------------------------------------------------------------
REGISTER USER - http://localhost:4000/register   (POST REQUEST IN POSTMAN)
JSON DATA - {
    "username":"Naman",
    "password":"12345678"
}
---------------------------------------------------------------------------------------------------------
LOGIN USER - http://localhost:4000/login       (POST REQUEST IN POSTMAN)
JSON DATA - {
    "username":"Naman",
    "password":"12345678"
}
--------------------------------------------------------------------------------------------------------
LOGOUT USER - http://localhost:4000/logout     (POST REQUEST IN POSTMAN)
--------------------------------------------------------------------------------------------------------

ADD BOOKS - http://localhost:4000/addBook     (POST REQUEST IN POSTMAN)
JSON DATA - {
    "title":"Why we Sleep"  ,
   "author":"Mathew Walker", 
   "publicationYear" :"2017"
}

----------------------------------------------------------------------------------------------------------------------
GET ALL BOOKS - http://localhost:4000/getAllBooks      (GET REQUEST IN POSTMAN)
----------------------------------------------------------------------------------------------------------------------

GET SINGLE BOOK by ID - http://localhost:4000/book/6628d7eb30e7c25b3a815546    (GET REQUEST IN POSTMAN)
----------------------------------------------------------------------------------------------------------------------
FILTER BOOKS - http://localhost:4000/filter?author=Naman%20Srivastava&publicationYear=2024 (GET REQUEST IN POSTMAN)
----------------------------------------------------------------------------------------------------------------------
UPDATE BOOK BY ID -http://localhost:4000/updateBook/6628d7eb30e7c25b3a815546  (PUT REQUEST IN POSTMAN)
JSON DATA - {
    "title":"Wise Man"  ,
   "author":"Naman Srivastava", 
   "publicationYear" :"2024"
}
----------------------------------------------------------------------------------------------------------
DELETE BOOK BY ID- http://localhost:4000/deleteBook/6628ded17995b5a030912d93   (DELETE REQUEST IN POSTMAN)
----------------------------------------------------------------------------------------------------------
DELETE ALL BOOKS - http://localhost:4000/deleteAllBooks  (DELETE REQUEST IN POSTMAN)




NOTE - Make get all books api request then ID of books will be shown which can be used for other requests.
