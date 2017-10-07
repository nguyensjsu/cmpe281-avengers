# Sticky sessions with Local session caching
Sticky sessions can be used when we are running application on a single server.
In the industry where high availability and scalibility is expected in the application, this approach does not work for horizontal scaling.
It allow you to route a site user to the particular web server that is managing that individual user’s session. The session’s validity can be determined by a number of methods, including a client-side cookies or via configurable duration parameters that can be set at the load balancer which routes requests to the web servers.
  
## Advantages:
1. Cost effective as sessions are stored in the servers running the application.
2. Fast retrieval and low latency.
  
## Disadvantages:
1. In the event of failure, the data and sessions on the failing node is lost.
2. In scale up or scale down scenarios, the load balancer might spread the traffic unequally across different web servers and users might experience a glitch.
  
  
# Session storing using RDBMS
A common solution is to set up a dedicated session-state server with a database. It requires high performance SSD storage.
It is not recommended for applications which have high traffic and require high scalability. It has a few drawbacks like DB license, growth management, failover mechanism, etc.
  
  
# Session storing using Redis/Memcache
A common solution to for this is to use an In-Memory Key/Value store such as Redis and Memcached. ElastiCache offerings for In-Memory key/value stores include ElastiCache for Redis, which can support replication, and ElastiCache for Memcached which does not support replication.
1. Extremely fast data stores.
2. sub-millisecond latency
3. Boosts performance by caching any data
### Added network latency and added cost are the drawbacks.
    
  
# Session Storing using DynamoDB
AWS Dynamo DB can handle massive concurrent reads and writes. Scalability and administration needs to be taken care in the service. 
1. Data items on SSDs.
2. replicated across 3 availability zones.
3. Provides high availability and durability.
4. Provides SDKs and session state extensions for a variety of languages.
  
      
# References
1. https://www.awsadvent.com/2016/12/17/session-management-for-web-applications-on-aws-cloud/
2. https://aws.amazon.com/caching/session-management/
