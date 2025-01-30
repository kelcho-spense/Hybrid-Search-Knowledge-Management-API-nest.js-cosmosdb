import { IndexingPolicy, VectorIndexType } from '@azure/cosmos';
// Indexing policies[vector index & full-text indexes] for knowledge items
export const knowledgeItemIndexingPolicy: IndexingPolicy = {
  // regular indexing policy will be applied to the collection to index the data
  includedPaths: [{ path: '/*' }],
  // Keep vectors excluded from regular indexing paths for better performance and to ensure optimized performance for insertion.
  excludedPaths: [{ path: '/contentVector/*' }, { path: '/metadataVector/*' }],
  // Define the vector indexes for the vectors in the collection
  vectorIndexes: [
    {
      path: '/contentVector',
      type: VectorIndexType.DiskANN,
    },
    {
      path: '/metadataVector',
      type: VectorIndexType.QuantizedFlat,
    },
  ],
  // Define the full-text indexes for the title and content fields in the collection
  fullTextIndexes: [
    {
      path: '/title',
    },
    {
      path: '/content',
    },
  ],
};
