Using MongoDB instead of RDBMS for storing the transaction details in "Financial data" module :

MongoDB is strongly consistent by default - if you do a write and then do a read, assuming the write was successful you will always be able to read the result of the write you just read. This is because MongoDB is a single-master system and all reads go to the primary by default. If you optionally enable reading from the secondaries then MongoDB becomes eventually consistent where it's possible to read out-of-date results.

Insertion speed is the primary performance concern for a transaction logging system. At the same time, the system must be able to support flexible queries so that you can return data from the system efficiently. 

MongoDB is a document-oriented database with a similar distribution design to Redis. In a replica set, there exists a single primary node which accepts writes and asynchronously replicates a log of its operations ("oplog") to N secondaries. Mongo builds in its leader election and replicated state machine. There's no separate system which tries to observe a replica set in order to make decisions about what it should do. The replica set decides among itself which node should be primary, when to step down, how to replicate, etc. This is operationally simpler and eliminates whole classes of topology problems.Mongo allows you to ask that the primary confirm successful replication of a write by its disk log, or by secondary nodes. At the cost of latency, we can get stronger guarantees about whether or not a write was successful.

Partition Tolerance :
Your replica gets split into two partitions.
Writes continue to both sides as new masters were elected
Partition is resolved - all servers are now connected again
What happens is that new master is elected - the one that has highest oplog, but the data from the other master gets reverted to the common state before partition and it is dumped to a file for manual recovery
all secondaries catch up with the new master


It turns out that most of the time where you find yourself with a Master-Detail pattern in an RDBMS, you can achieve the same level of consistency in MongoDB by modelling your object as a rich, nested document, rather than multiple joined tables. Combine this with MongoDB’s atomic update operators, and you can solve most of what you would traditionally do with multi-statement transactions in an RDBMS.

An RDBMS needs multi-statement transactions for these scenarios because the only way it has to model these types of objects is with multiple tables. By contrast, MongoDB can go much further with single-statement transactions because there’s no need to join on simple updates like this.

This is not to say that multi-statement transactions are not useful. If you need to perform cross-entity transactions (e.g. move a line item from one purchase order to another) or if you need to modify a purchase order and inventory objects in a single step, then you may still need multi-statement transactions. Or else you would have to take some alternate approach.

But it turns out that many of the cases where we traditionally need multi-statement transactions go away when we can model objects as documents and perform atomic updates on those documents.
