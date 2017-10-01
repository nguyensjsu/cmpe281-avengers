## Why User Activity Logs are required?

User Activity Logs are essential features of the online shopping cart to track and audit the user activities so that 
analysis and custom audit report can be easliy made.The auditing would be very valuable for security purposes.

## How to store User Activity Logs?

Traditional way to store any logs is to use system log files. This traditional way will be useful if three are less number 
of user activities. As activity logs goes on increaing we can still store it into the system log files but handling 
of such files becomes difficult. 

There is another way to store User Activity logs into the database. Relational database has the constraint of storing 
only structured data. Since the User activity logs' data are unstructred there is need to use the NoSQL database. 
I studied various NoSQL databases and found out that Cassendra tables will be best suitable for storing, retriving 
and updating the user activity logs. Some of the advantages of using Cassendra table are as follows:

1. As audit logs increase in size, logging data to a Cassandra table is more useful.
2. User activity events stored in database tables can be secured like any other table using RBAC. For example, store 
database table-based logs in encrypted SSTables. Control access to the tables with object permissions.
3. Larger clusters use Cassandra tables because logback audit logs become cumbersome. The data can be queried like 
any other table, making analysis easier and custom audit reports possible.

So I can conclude that Cassendra NoSQL databases will be the best for user activity logs related operations.

