# Third-Sem-Project-Orders-API
It's a simple e-commerce project where users can sign up and place orders. Suppliers can add products while customers can purchase them. This project uses MongoDB+Express+NodeJS

Project details:
It's a simple ecommerce-like portal where suppliers and customers can register accounts. Suppliers can only add products to the database and view products from it. Customers can view products and order them.

This project uses NodeJS+Express for the backend and handlebars for template rendering. Authentication is implemented and logged in user information is stored in cookies and retrived when needed (to access private routes).

There are private routes for customers and suppliers which can be accessed only by them after logging in. JWT is used for token verification.

If you want to use/test this project in your PC, make sure you've got these programs installed:
 1. NodeJS v10
 2. MongoDB v4
 
 Steps to replicate this project:
 
 1. Clone this repo to your computer and run "npm install" (without quotes) in the cloned directory.
 2. Create a new folder to set up MongoDB database and run mongod --dbpath <PATH> to start the database.
 3. Run nodemon app.js to start the app and open http://localhost:3000 in your browser.
 4. (Optional) Install Robo3T from https://robomongo.org/ to view the database entries in a GUI.
 
 Note: This project is developed for local environent only as a project for one of my credit courses. You should make modifications if you're planning to deploy it to a server.
 
