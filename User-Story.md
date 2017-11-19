# User Stories - Overview

Authentication: User can signup/login/logout

Items for sale: Multiple User can view lists of items for sale and search by name.

Shopping Cart: Multiple User can add items to shopping cart and the app remembers it next time you login. Users can view all the items in their shopping cart. User can delete items in the shopping cart.

Checkout: User can checkout, items in the shopping cart will move to a different "state".

# Authentication

# Registration:

Create a signup page /signup

Add a url/controller/template /signup

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

Create a new Item Model with the following fields:
Name, Description, Price

Create several in the admin or shell

Create new routes and templates to show a listing of the items

/items ->shows all items

Create new route and template to show just one listing

Create more then 10 items


Shopping cart/order

Create a new Model called Order (This is the shopping cart!)
An order belongs to multiple users, and has multiple items. 
A user can have many orders. An order has a status column, which is an integer field:

1 - In shopping cart

2 - Purchased

For any given group of users, you can only have one order with a status equal to 1.

When a user adds an item to the shopping cart, if there is no order with a status equal to 1, then create a new order for the user.

Create a new route and view for /cart
/cart shows what items are in that users cart

To show cart, you will need to query for the right order - match the user (request.user) and set a condition where status is equal to one.

Allow users of that group to delete items from the cart

Shows the total price of all items

Allows them to purchase items, purchasing takes the user to payment form at /payments

Update the /item/ template to have a "purchase" button - when clicked, the item is added to the order, and the user is redirected to /cart

# Order History Form

View the order history for the group of users.
