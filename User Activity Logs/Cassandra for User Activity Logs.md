# Cassandra

Cassandra is an excellent choice for dealing with time series data (logs). But Cassandra by itself is typically not 
enough. Storing data is 10% of the battle, what you need to think about is how to analyze, search and represent 
the data once it is stored. For that Cassandra/Solr combo may be useful which stores application log data as well as 
index/search the data using Solr search engine.

# Basic rules of Cassandra Data Modelling:

Picking the right data model is the hardest part of using Cassandra. If someone have a relational background, CQL will look 
familiar, but the way they use it can be very different.

These are the two high-level goals for Cassandra data model:

1. Spread data evenly around the cluster
2. Minimize the number of partitions read

Cassandra data model needs to be designed top down, that is design how we store the data based on what we want to see and 
not the other way.The partition key, needs to be based on something that will always be provided while querying. The 
timestamp column should be the first clustering key with a timeuuid datatype. Using a timeuuid will serve a dual purpose 
of natural ordering a time-series data, as well as provide for a unique 'rowid' that can be useful for pagination queries.
Any other searchable field, say logging level, can be kept as subsequent clustering key.

# Advantages:

1. Fast, elastic scale
2. Automatic data replication
3. Great selection of APIs, designed for dealing with time series data
4. CQL (query language)
5. I like Cassandra clustering model

# Disadvantages:

1. CQL is limited. For complex searches need Solr or some other search engine.
2. Cassandra data model is a a bit hard to understand at first especially for those coming from SQL world.
3. Need to manage Cassandra clusters and know how manage data (compaction, repairs, etc).

# References

1. https://www.quora.com/What-are-the-pluses-minuses-of-using-Cassandra-for-storing-application-log-data
2. https://www.datastax.com/dev/blog/basic-rules-of-cassandra-data-modeling
3. https://dzone.com/articles/full-text-searchable-log-repository-using-cassandr
