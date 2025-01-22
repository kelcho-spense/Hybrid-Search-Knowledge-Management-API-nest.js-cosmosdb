<!-- (https://learn.microsoft.com/en-us/azure/cosmos-db/index-overview#index-kinds) -->
## Types of indexes
Azure Cosmos DB currently supports three types of indexes. You can configure these index types when defining the indexing policy.

### Range Index
Range indexes are based on an ordered tree-like structure. The range index type is used for: -  Queries that use the `=`, `IN`, `>`, `>`, `<`, `>=`, `<=`, `!=`, `CONTAINS`, and `ORDER BY` operators.
- `sql 
SELECT * FROM container c WHERE c.property = 'value'
`
- `sql
SELECT * FROM c WHERE c.property IN ("value1", "value2", "value3")
`
-`sql
SELECT * FROM container c ORDER BY c.property
`
-`sql
SELECT child FROM container c JOIN child IN c.properties WHERE child = 'value'
`

### Spatial Index
Spatial indexes are used for queries that use the `ST_DISTANCE`, `ST_WITHIN`, `ST_INTERSECTS`, and `ST_ISVALID` operators. Spatial indexes are used for geospatial queries. ie
-`sql
SELECT * FROM container c WHERE ST_DISTANCE(c.property, { "type": "Point", "coordinates": [0.0, 10.0] }) < 40
`

### Composite Index
Composite indexes are used for queries that use the `AND`, `OR`, and `NOT` operators. Composite indexes are used for queries that use multiple properties in the filter. ie
-`sql
SELECT * FROM container c WHERE c.property1 = 'value1' AND c.property2 = 'value2'
`
Queries with a filter and ORDER BY: ie
-`sql
SELECT * FROM container c WHERE c.property1 = 'value' ORDER BY c.property1, c.property2
`
order by queries on multiple properties: ie
-`sql
SELECT * FROM container c ORDER BY c.property1, c.property2
`

### Vector indexes
Vector indexes increase the efficiency when performing vector searches using the VectorDistance system function. Vectors searches will have significantly lower latency, higher throughput, and less RU consumption when leveraging a vector index.

ORDER BY vector search queries: ie
-`sql
SELECT TOP 10 *
FROM c
ORDER BY VectorDistance(c.vector1, c.vector2)
`
Projection of the similarity score in vector search queries: ie
- `sql
SELECT TOP 10 c.name, VectorDistance(c.vector1, c.vector2) AS SimilarityScore
FROM c
ORDER BY VectorDistance(c.vector1, c.vector2)
`
Range filters on the similarity score.
-`sql
SELECT TOP 10 *
FROM c
WHERE VectorDistance(c.vector1, c.vector2) > 0.8
ORDER BY VectorDistance(c.vector1, c.vector2)
`