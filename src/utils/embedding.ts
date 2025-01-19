import axios from 'axios';

export async function generateTextVector(text: any): Promise<number[]> {
  const response = await axios.post(
    process.env.AZURE_OPENAI_TEXT_EMBEDDING_MODEL_ENDPOINT,
    { input: text },
    {
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_API_KEY,
      },
    },
  );

  const vector = response.data.data[0].embedding;
  return vector;
}
