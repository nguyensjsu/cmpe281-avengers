# User Stories - Overview

Authentication: User can signup/login/logout

Items on Product Catalog: Multiple User can view lists of items on the Product Catalog that are for sale and search by name.

Shopping Cart: Multiple User can add items to shopping cart and the app remembers it next time you login. Users can view all the items in their shopping cart. User can delete items in the shopping cart.

Checkout: User can checkout, items in the shopping cart will move to a different "state".

# Authentication

# Registration:

Create a signup page /signup

/signup has a form, username, email, and password.

"Submit" button posts to /register


# Login:

Create a login page /login

/login shows a form for username and password

"Submit" button posts to /login_user

# Authenticate:

Create a new page that is only for logged in users. A members only page. Up to you what you want to show!

If the user is logged in, show the page.

If not, redirect the user to the login page


# Logout:

Create a new url/controller for /logout

When /logout is called, redirect user to the home page


# Items

Create a new Product Catalog with the following fields:
Name, Description, Price

Create several in the admin or shell

Create new routes and templates to show a listing of the items(books)

/items ->shows all items

Create new route and template to show just one listing

Create more than 10 items


Shopping cart/order

Create a new Model called Cart (This is the shopping cart!)
A cart belongs to multiple users, and has multiple items. 
A user can have many orders. 

When a user adds an item to the shopping cart, then it  create a new order for the user.

Create a new route and view for /cart
/cart shows what items are in that users cart

To show cart, you will need to query for the right order - match the user (request.user) and set a condition where status is equal to one.

Allow users of that group to delete items from the cart

Shows the total price of all items

Allows them to purchase items, purchasing takes the user to payment form at /payments

Update the /item/ template to have a "purchase" button - when clicked, the item is added to the order, and the user is redirected to /cart

# Order History Form

View the order history for the group of users. The user can see all the orders in "MyOrders" section.
