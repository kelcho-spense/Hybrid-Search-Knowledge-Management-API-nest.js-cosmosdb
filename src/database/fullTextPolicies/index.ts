import { FullTextPolicy } from '@azure/cosmos';
// Full text policy for knowledge items
export const knowledgeItemFullTextPolicy: FullTextPolicy = {
  defaultLanguage: 'en-US',
  fullTextPaths: [
    {
      language: 'en-US',
      path: '/title',
    },
    {
      path: '/content',
      language: 'en-US',
    },
  ],
};
