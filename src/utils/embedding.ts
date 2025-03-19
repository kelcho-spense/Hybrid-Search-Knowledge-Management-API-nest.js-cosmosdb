
// AZURE OPENAI API SDK => KEY AUTHENTICATION

import { AzureOpenAI } from "openai"
import type { AzureClientOptions } from "openai";
import { ConfigService } from '@nestjs/config';

export async function generateTextVector(text: string): Promise<number[]> {
  const configService = new ConfigService();
  const apiKey = configService.getOrThrow('AZURE_OPENAI_API_KEY');
  const endpoint = configService.getOrThrow('AZURE_OPENAI_TEXT_EMBEDDING_MODEL_ENDPOINT');
  const modelName = configService.getOrThrow('AZURE_OPENAI_TEXT_EMBEDDING_MODEL_NAME');
  const deployment = configService.getOrThrow('AZURE_OPENAI_TEXT_EMBEDDING_MODEL_DEPLOYMENT_NAME');
  const apiVersion = configService.getOrThrow('AZURE_OPENAI_TEXT_EMBEDDING_MODEL_API_VERSION');

  const clientOptions: AzureClientOptions = { endpoint, apiKey, deployment, apiVersion }

  const azureOpenAIClient = new AzureOpenAI(clientOptions);

  const response = await azureOpenAIClient.embeddings.create({
    input: text,
    model: modelName
  });

  if (!response.data || response.data.length === 0) {
    throw new Error("No embedding data returned from API");
  }
// console.log(response.data[0].embedding)
  return response.data[0].embedding;
}

