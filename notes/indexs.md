# DatabaseService

This [DatabaseService](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) class serves as the database access layer for a NestJS application that interacts with Azure Cosmos DB. The service is designed to be loaded automatically at application startup and provides a configured container that other parts of the application can use to store and retrieve data.

## Class Structure and NestJS Integration

The class is decorated with `@Injectable()`, making it available to NestJS's dependency injection system. It implements the [OnModuleInit](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) interface, which ensures the database initialization happens automatically when the application starts. The constructor accepts a ConfigService to retrieve environment-specific configuration values, keeping database credentials secure and environment-dependent.

## Cosmos DB Client Configuration

During instantiation, the service creates a CosmosClient with connection details pulled from configuration. The service intelligently adjusts the diagnostic logging level based on the environment - using verbose debugging in development environments while keeping logs minimal in production to optimize performance.

## Database and Container Initialization

The [initDatabase()](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) method handles creating both the database and container if they don't already exist. This idempotent approach ensures the application works correctly whether it's the first startup or a subsequent one. The container is configured with several specialized policies:

#### Database Creation

First, the method retrieves the database name from a configuration service using `this.configService.get<string>('AZURE_COSMOS_DB_NAME')`. It then uses the Cosmos DB client to create the database if it doesn't already exist via the [createIfNotExists](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) method. This approach is idempotent, meaning it can be run multiple times without creating duplicate databases. Once created or retrieved, the database reference is stored in `this.database` for later use.

#### Container Configuration

After securing the database connection, the method creates a specialized container named 'knowledge-items'. This container is configured with:

* A partition key that organizes data based on the '/metadata/department' path within documents
* Version 2 partition key with hash distribution for optimal performance
* Custom indexing policy ([knowledgeItemIndexingPolicy](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)) to control which document properties are indexed
* Vector embedding policy ([knowledgeItemVectorEmbeddingPolicy](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)) for AI vector search capabilities
* Full-text policy ([knowledgeItemFullTextPolicy](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)) for advanced text search features

The container reference is then stored in `this.container` for the service to use when performing database operations.

This initialization approach ensures the required database infrastructure is in place before the application attempts to perform any data operations, providing a robust foundation for the application's data layer.

## Full-Text Search Policy Configuration for Azure Cosmos DB

This code snippet defines a full-text search configuration for an Azure Cosmos DB container that will store knowledge items. Full-text search enables powerful text-based querying capabilities beyond simple equality or range comparisons, allowing users to search for content in a more natural way.

The [knowledgeItemFullTextPolicy](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) object configures which document paths (properties) should be indexed for full-text search and how they should be processed. It specifies American English (`en-US`) as the default language for text analysis, which determines how the text will be tokenized, stemmed, and processed during indexing.

Two specific document paths are configured for full-text indexing:

1. The `/title` field - where document titles are stored
2. The `/content` field - where the main body content is stored

Both fields are configured to use English language analysis. This language-aware indexing enables important search features like word breaking, stemming (recognizing different forms of the same word), and stopword removal (filtering out common words like "the" or "and").

When applied to a Cosmos DB container, this configuration will allow your application to perform sophisticated text queries against these fields, such as phrase matching, prefix matching, and relevance-ranked results - significantly enhancing the search experience for users of your knowledge management system.


# Indexing Policy for Azure Cosmos DB Knowledge Base

This code defines a sophisticated indexing policy for Azure Cosmos DB that enables multi-modal search capabilities across knowledge items. The configuration establishes a hybrid search architecture that combines traditional, vector, and full-text search mechanisms.

## Regular Indexing Configuration

The policy begins by including all document paths (`/*`) for standard indexing, ensuring that basic queries can be performed against any field in the documents. However, it deliberately excludes vector data paths (`/contentVector/*` and `/metadataVector/*`) from regular indexing. This exclusion is performance-optimized since vector data requires specialized handling and would unnecessarily bloat the standard index.

## Vector Search Capabilities

Two different vector indexes are configured:

1. A [DiskANN](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) index for `/contentVector` - this type is optimized for high-dimensional vectors with excellent search efficiency, likely containing embeddings of the document's main content.
2. A [QuantizedFlat](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) index for `/metadataVector` - this compressed vector format balances memory efficiency with search performance, presumably storing embeddings of metadata fields.

These vector indexes enable AI-powered semantic search, allowing users to find documents based on meaning rather than exact keyword matches.

## Full-Text Search Integration

The policy also establishes full-text indexes on both the `/title` and `/content` fields. This enables natural language processing features like word stemming, stopword removal, and relevance ranking when users perform keyword-based searches.

By combining these three indexing approaches, this configuration creates a powerful knowledge management system that can support traditional filtering, keyword-based searching, and AI-powered semantic queries - providing users with multiple ways to discover relevant information.


# Vector Embedding Configuration for Azure Cosmos DB

This code defines the vector embedding configuration for a knowledge management system that leverages AI-powered semantic search capabilities in Azure Cosmos DB. Vector embeddings enable similarity-based searching, allowing users to find content based on meaning rather than just keywords.

## Vector Embedding Structure

The configuration establishes two distinct vector embedding fields within each document:

1. `/contentVector` - This field stores vector representations (embeddings) of the document's main content, allowing for semantic searching of the actual information contained within documents.
2. `/metadataVector` - This field stores vector representations of the document's metadata properties, enabling similarity searches based on categorical or descriptive information about the document.

## Technical Configuration

Both vector fields are configured with identical technical specifications:

* [dataType: VectorEmbeddingDataType.Float32](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) - Uses 32-bit floating point numbers for each vector dimension, providing good precision while managing memory usage.
* [dimensions: 1536](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) - Specifies a 1536-dimensional vector, which matches the output dimension of OpenAI's text-embedding-ada-002 model, suggesting this system likely uses OpenAI's embedding service or a similar model.
* [distanceFunction: VectorEmbeddingDistanceFunction.Cosine](vscode-file://vscode-app/c:/Users/KevinComba/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) - Employs cosine similarity for measuring vector proximity, which is optimal for finding semantically similar content regardless of vector magnitude.

This configuration enables sophisticated AI-powered search capabilities, allowing users to find knowledge items based on conceptual similarity rather than requiring exact term matches, significantly enhancing the system's ability to retrieve relevant information.
















## Types of indexes

Azure Cosmos DB currently supports three types of indexes. You can configure these index types when defining the indexing policy.

### Range Index

Range indexes are based on an ordered tree-like structure. The range index type is used for: -  Queries that use the `=`, `IN`, `>`, `>`, `<`, `>=`, `<=`, `!=`, `CONTAINS`, and `ORDER BY` operators.

- `sql  SELECT * FROM container c WHERE c.property = 'value' `
- `sql SELECT * FROM c WHERE c.property IN ("value1", "value2", "value3") `
  -`sql SELECT * FROM container c ORDER BY c.property `
  -`sql SELECT child FROM container c JOIN child IN c.properties WHERE child = 'value' `

### Spatial Index

Spatial indexes are used for queries that use the `ST_DISTANCE`, `ST_WITHIN`, `ST_INTERSECTS`, and `ST_ISVALID` operators. Spatial indexes are used for geospatial queries. ie
-`sql SELECT * FROM container c WHERE ST_DISTANCE(c.property, { "type": "Point", "coordinates": [0.0, 10.0] }) < 40 `

### Composite Index

Composite indexes are used for queries that use the `AND`, `OR`, and `NOT` operators. Composite indexes are used for queries that use multiple properties in the filter. ie
-`sql SELECT * FROM container c WHERE c.property1 = 'value1' AND c.property2 = 'value2' `
Queries with a filter and ORDER BY: ie
-`sql SELECT * FROM container c WHERE c.property1 = 'value' ORDER BY c.property1, c.property2 `
order by queries on multiple properties: ie
-`sql SELECT * FROM container c ORDER BY c.property1, c.property2 `

### Vector indexes

Vector indexes increase the efficiency when performing vector searches using the VectorDistance system function. Vectors searches will have significantly lower latency, higher throughput, and less RU consumption when leveraging a vector index.

ORDER BY vector search queries: ie
-`sql SELECT TOP 10 * FROM c ORDER BY VectorDistance(c.vector1, c.vector2) `
Projection of the similarity score in vector search queries: ie

- `sql SELECT TOP 10 c.name, VectorDistance(c.vector1, c.vector2) AS SimilarityScore FROM c ORDER BY VectorDistance(c.vector1, c.vector2) `
  Range filters on the similarity score.
  -`sql SELECT TOP 10 * FROM c WHERE VectorDistance(c.vector1, c.vector2) > 0.8 ORDER BY VectorDistance(c.vector1, c.vector2) `

# How to use hybrid search

- [Enable the Vector Search in Azure Cosmos DB for NoSQL feature](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/vector-search#enable-the-vector-indexing-and-search-feature).
- Enable the [Full Text &amp; Hybrid Search for NoSQL preview feature](https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/full-text-search#enable-the-full-text-and-hybrid-search-for-nosql-preview-feature).
- Create a container with a vector policy, full text policy, vector index, and full text index.
- Insert your data with text and vector properties.
  Run hybrid queries against the data.
