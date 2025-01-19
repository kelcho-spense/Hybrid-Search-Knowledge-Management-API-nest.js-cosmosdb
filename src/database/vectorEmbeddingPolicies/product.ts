import {
  VectorEmbeddingDataType,
  VectorEmbeddingDistanceFunction,
  VectorEmbeddingPolicy,
} from '@azure/cosmos';

export const productVectorEmbeddingPolicy: VectorEmbeddingPolicy = {
  // Define the paths to be included in the index
  vectorEmbeddings: [
    {
      path: '/descriptionVector',
      dataType: VectorEmbeddingDataType.Float32,
      dimensions: 1536, // default is 1536
      distanceFunction: VectorEmbeddingDistanceFunction.Cosine, //metric used to compute distance/similarity
    },
    {
      path: '/reviewsCountVector',
      dataType: VectorEmbeddingDataType.Float32,
      dimensions: 1536,
      distanceFunction: VectorEmbeddingDistanceFunction.Euclidean,
    },
    {
      path: '/tagsVector',
      dataType: VectorEmbeddingDataType.Float32,
      dimensions: 1536,
      distanceFunction: VectorEmbeddingDistanceFunction.Cosine,
    },
    {
      path: '/featuresVector',
      dataType: VectorEmbeddingDataType.Float32,
      dimensions: 1536,
      distanceFunction: VectorEmbeddingDistanceFunction.Cosine,
    },
  ],
};
