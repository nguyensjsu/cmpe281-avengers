## Requirement

A product catalog consists different types of objects with different sets of attributes. The database choice must accomodate such heterogenous collection.


## Limitations with SQL

If we design a schema with a table for each product category, then we must create a new table for every new category of products and we must also explicitly tailor all queries for the exact type of product. This approach is not flexible. 

Suppose a single table is used for all product categories and new columns are added anytime we need to store data regarding a new type of product, it is reasonably flexible than the previous approach by allowing single queries to fetch different types of products, but it is so at the cost of space. 

If we use multiple table inheritence approach by referencing products with primary and foreign keys, we are optimizing the space indeed but at the cost of an expensive JOIN operation to query attributes relevant to a product which would result in a huge performance penalty.

Furthermore, if we serialize all of the data into a BLOB column and keep it simple, the task of fetching the product details for searching and sorting would become difficult. 


## MongoDB for product catalog

First of all, MongoDB is a non-relational database.  Second of all, a single MongoDB collection can  store all the product data. Finally, with MongoDB’s dynamic schema, each document for a product can contain attributes relevant to that product alone. Additionally, it addresses scalability issues of a large dataset.

Therefore, MongoDB is best suitable as a storage engine for a product catalog system.
