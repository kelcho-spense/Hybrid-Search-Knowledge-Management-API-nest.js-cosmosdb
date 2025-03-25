import { FullTextPolicy } from '@azure/cosmos';
// Full text policy for knowledge items
export const knowledgeItemFullTextPolicy: FullTextPolicy = {
  defaultLanguage: 'en-US',
  fullTextPaths: [
    {
      path: '/title',
      language: 'en-US',
    },
    {
      path: '/content',
      language: 'en-US',
    },
  ],
};
