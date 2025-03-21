# Hybrid Search with Azure Cosmos DB

Azure Cosmos DB for NoSQL now supports a powerful hybrid search capability that combines Vector Search with Full Text Search scoring (BM25) using the Reciprocal Rank Fusion (RRF) function.

[![Hybrid Search](./images/Hybrid-Search.svg)](https://learn.microsoft.com/azure/search/hybrid-search-overview?WT.mc_id=MVP_406617)

## Enterprise Knowledge Management system with Hybrid Search, Azure Cosmos DB & Nest.js

This project demonstrates building an enterprise knowledge management system using Nest.js integrated with Azure Cosmos DB's hybrid search capabilities. It combines vector `similarity search` with `full-text search` using Reciprocal Rank Fusion (RRF) for optimal results.

## Hybrid Search Features

- **Vector Search**: Semantic similarity matching using document embeddings
- **Full-Text Search**: BM25-based keyword matching
- **RRF Fusion**: Combines results from both search methods
- **Context-Aware**: Considers user context and project relevance

## Search Implementation

### Search Components

- Vector similarity search for semantic matching
- Full-text search with BM25 scoring
- RRF algorithm for result fusion
- User context integration

### Setup Requirements

1. Provision an Azure Cosmos DB account on the Azure portal
2. Enable full-text search preview feature in Azure Cosmos DB
   ![alt text](./images/full-text-search.png)
3. Enable vector search preview feature in Azure Cosmos DB
   ![alt text](./images/vector-search.png)

## Project Setup

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```bash
# API PORT
PORT=8000

# COSMOS DB
AZURE_COSMOS_DB_ENDPOINT=https://<your-endpoint>.documents.azure.com:443/
AZURE_COSMOS_DB_KEY=<your-key>
AZURE_COSMOS_DB_NAME=<your-db-name>

# AZURE OPENAI
AZURE_OPENAI_API_KEY=<your-open-ai-key>
AZURE_OPENAI_TEXT_EMBEDDING_MODEL_ENDPOINT=<your-embedding-model-endpoint>
AZURE_OPENAI_TEXT_EMBEDDING_MODEL_NAME=<your-embedding-model-name>
AZURE_OPENAI_TEXT_EMBEDDING_MODEL_DEPLOYMENT_NAME=<your-embedding-model-deployment-name>
AZURE_OPENAI_TEXT_EMBEDDING_MODEL_API_VERSION=<your-embedding-model-api-version>

## node env
NODE_ENV=development ## development or production
```

## Running the Application

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Testing

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
