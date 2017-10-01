SCALING :
A system’s ability to scale is its ability to process a growing workload, usually measured in transactions per second, amount of data, or number of users. There is a limit to how far a system can scale before reengineering is required to permit additional growth.
The basic strategy for building a scalable system is to design it with scalability in mind from the start and to avoid design elements that will prevent additional scaling in the future.

1. Identify Bottlenecks
2. Reengineer concepts


SCALING UP :
The simplest methodology for scaling a system is to use bigger, faster equipment. A system that runs too slowly can be moved to a machine with a faster CPU, more CPUs, more RAM, faster disks, faster network interfaces, and so on. Often an existing computer can have one of those attributes improved without replacing the entire machine. This is called scaling up because the system is increasing in size.
When this solution works well, it is often the easiest solution because it does not require a redesign of the software. However, there are many problems with scaling this way.
But, scaling up simply won’t work in all situations. Buying a faster, more powerful machine without changing the design of the software being used usually won’t result in proportionally faster throughput. Software that is single-threaded will not run faster on a machine with multiple processors. Software that is written to spread across all processors may not see much performance improvement beyond a certain number of CPUs due to bottlenecks such as lock contention.
Likewise, improving the performance of any one component is not guaranteed to improve overall system performance. A faster network connection will not improve throughput, for example, if the protocol performs badly when latency is high.

THE AKF SCALING CUBE - 
Methodologies for scaling to massive proportions boil down to three basic options: replicate the entire system (horizontal duplication); split the system into individual functions, services, or resources (functional or service splits); and split the system into individual chunks (lookup or formulaic splits).Many scaling techniques combine multiple axes of the AKF Scaling Cube

CACHING - 
A cache is a small data store using fast/expensive media, intended to improve a slow/cheap bigger data store. For example, recent database queries may be stored in RAM so that if the same query is repeated, the disk access can be avoided. Caching is a distinct pattern all its own, considered an optimization of the z-axis of the AKF Scaling Cube.


CACHE REPLACEMENT ALGORITHMS :
When a cache miss is processed, the data gathered by the regular lookup is added to the cache. If the cache is full some data must be thrown away to make room. There are many different replacement algorithms available to handle the cache manipulation.
In general, better algorithms keep track of more usage information to improve the cache hit ratio. Different algorithms work best for different data access patterns.
The Least Recently Used (LRU) algorithm tracks when each cache entry was used and discards the least recently accessed entry. It works well for access patterns where queries are repeated often within a small time period. For example, a DNS server might use this algorithm: if a domain has not been accessed in a long time, chances are it won’t be accessed again. Typos, for example, rarely repeat and will eventually expire from the cache.
The Least Frequently Used (LFU) algorithm counts the number of times a cache entry is accessed and discards the least active entries. It may track total accesses, or keep an hourly or daily count. This algorithm is a good choice when more popular data tends to be accessed the most. For example, a video service might cache certain popular videos that are viewed often while other videos are viewed once and rarely ever rewatched.
New algorithms are being invented all the time. Tom’s favorite algorithm, Adaptive Replacement Cache (ARC), was invented in 2003 (Megiddo & Modha 2003). Most algorithms do not perform well with a sudden influx of otherwise little-used data. For example, backing up a database involves reading every record one at a time and leaves the cache filled with otherwise little-used data. At that point, the cache is cold, so performance suffers. ARC solves this problem by putting newly cached data in a probationary state. If it is accessed a second time, it gets out of probation and is put into the main cache. A single pass through the database flushes the probationary cache, not the main cache.





