## Online Books inventory:

The well known name in the online books inventory is Amazon. It is the largest online retailer.  There are other online bookstores that sell via third party sellers as well. 

## Online Ice-cream inventory:

There are a couple online ice-cream ordering systems that take orders from customers and deliver ice-cream frozen right to their doorstep. 


## The focus here is to observe how the data flows in such online ordering systems.

1) customer logins to the online bookstore

2) The product catalog is served to the customer

3) The customer adds the interested item to the shopping cart and selects to check out

4) The customer is redirected to the payments page

5) The order is placed after successful payment.

we can say that the item is moved around from catalog to shopping cart and then to orders. Once the item is in orders, the shipping components start working on it and it is moved again from orders to shipped to in-transit and then to delivered state. 

Although this looks straightforward on the outside, the design for such systems is rather complicated yet interesting. 



