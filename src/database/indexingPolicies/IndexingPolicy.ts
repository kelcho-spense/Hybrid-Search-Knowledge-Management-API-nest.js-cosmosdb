import { IndexingPolicy, VectorIndexType } from '@azure/cosmos';

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
};
