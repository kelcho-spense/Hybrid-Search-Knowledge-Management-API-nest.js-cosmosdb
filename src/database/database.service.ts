import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CosmosClient,
  Database,
  Container,
  PartitionKeyDefinitionVersion,
  PartitionKeyKind,
  CosmosDbDiagnosticLevel,
} from '@azure/cosmos';

import { productVectorEmbeddingPolicy } from './vectorEmbeddingPolicies';
import { productIndexingPolicy } from './indexingPolicies';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly client: CosmosClient;
  private database: Database;
  private container: Container;

  constructor(private configService: ConfigService) {
    this.client = new CosmosClient({
      endpoint: this.configService.get<string>('AZURE_COSMOS_DB_ENDPOINT'),
      key: this.configService.get<string>('AZURE_COSMOS_DB_KEY'),
      diagnosticLevel:
        this.configService.get<string>('NODE_ENV') != 'production'
          ? CosmosDbDiagnosticLevel.debug
          : CosmosDbDiagnosticLevel.info,
    });
  }

  async onModuleInit() {
    await this.initDatabase();
  }

  private async initDatabase() {
    // Create database if it doesn't exist
    const dbName = this.configService.get<string>('AZURE_COSMOS_DB_NAME');
    const { database } = await this.client.databases.createIfNotExists({
      id: dbName,
    });
    this.database = database;

    // Create containers if it doesn't exist
    const { container: legalDocumentsContainer } =
      await this.database.containers.createIfNotExists({
        id: 'legal-documents',
        partitionKey: {
          paths: ['/id'],
          version: PartitionKeyDefinitionVersion.V2,
          kind: PartitionKeyKind.Hash,
        },
        indexingPolicy: {
          includedPaths: [
            {
              path: '/*',
            },
          ],
          compositeIndexes: [
            [
              {
                path: '/content',
                order: 'ascending',
              },
            ],
          ],
        },
      });
    this.container = legalDocumentsContainer;
  }

  getContainer(): Container {
    if (!this.container) {
      throw new Error('Database container not initialized');
    }
    return this.container;
  }
}
