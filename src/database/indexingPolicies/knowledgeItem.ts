import { IndexingPolicy, VectorIndexType } from '@azure/cosmos';

export const knowledgeItemIndexingPolicy: IndexingPolicy = {
  includedPaths: [{ path: '/*' }],
  excludedPaths: [
    { path: '/contentVector/*' },
    { path: '/metadataVector/*' }
  ],
  compositeIndexes: [
    [
      { path: '/metadata/department', order: 'ascending' },
      { path: '/dateCreated', order: 'descending' }
    ]
  ],
  vectorIndexes: [
    { 
      path: '/contentVector', 
      type: VectorIndexType.DiskANN 
    },
    { 
      path: '/metadataVector', 
      type: VectorIndexType.QuantizedFlat 
    }
  ],
};