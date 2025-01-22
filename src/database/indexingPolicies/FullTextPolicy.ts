import { FullTextPolicy } from '@azure/cosmos';

export const knowledgeItemFullTextPolicy: FullTextPolicy = {
  defaultLanguage: 'en-US',
  fullTextPaths: [
    {
      language: 'en-US',
      path: '/title',
    },
    {
      path: '/context',
      language: 'en-US',
    },
  ],
};
