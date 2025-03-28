import {
  VectorEmbeddingDataType,
  VectorEmbeddingDistanceFunction,
  VectorEmbeddingPolicy,
} from '@azure/cosmos';
// Vector policies for knowledge items
export const knowledgeItemVectorEmbeddingPolicy: VectorEmbeddingPolicy = {
  vectorEmbeddings: [
    {
      path: '/contentVector',
      dataType: VectorEmbeddingDataType.Float32, // Float32 data type 
      dimensions: 1536, // 1536 dimensions for the content vector
      distanceFunction: VectorEmbeddingDistanceFunction.Cosine, 
    },
    {
      path: '/metadataVector',
      dataType: VectorEmbeddingDataType.Float32,
      dimensions: 1536,
      distanceFunction: VectorEmbeddingDistanceFunction.Cosine,
    },
  ],
};
