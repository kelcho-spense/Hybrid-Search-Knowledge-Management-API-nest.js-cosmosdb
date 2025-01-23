import { IndexingPolicy, VectorIndexType } from '@azure/cosmos';
// Indexing policies[vector index & full-text indexes] for knowledge items
export const knowledgeItemIndexingPolicy: IndexingPolicy = {
  includedPaths: [{ path: '/*' }],
  excludedPaths: [{ path: '/contentVector/*' }, { path: '/metadataVector/*' }],
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
  fullTextIndexes: [
    {
      path: '/title',
    },
    {
      path: '/content',
    },
  ],
};
