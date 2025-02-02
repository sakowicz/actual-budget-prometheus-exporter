import {
  APIAccountEntity,
  APICategoryEntity,
  APICategoryGroupEntity,
} from '@actual-app/api/@types/loot-core/server/api-models';
import { TransactionEntity } from '@actual-app/api/@types/loot-core/types/models';
import { ActualApiServiceI } from './types';

class ActualApiService implements ActualApiServiceI {
  private actualApiClient: typeof import('@actual-app/api');

  private fs: typeof import('fs');

  private readonly dataDir: string;

  private readonly serverURL: string;

  private readonly password: string;

  private readonly budgetId: string;

  private readonly e2ePassword: string;

  constructor(
    actualApiClient: typeof import('@actual-app/api'),
    fs: typeof import('fs'),
    dataDir: string,
    serverURL: string,
    password: string,
    budgetId: string,
    e2ePassword: string,
  ) {
    this.actualApiClient = actualApiClient;
    this.fs = fs;
    this.dataDir = dataDir;
    this.serverURL = serverURL;
    this.password = password;
    this.budgetId = budgetId;
    this.e2ePassword = e2ePassword;
  }

  public async initializeApi() {
    if (!this.fs.existsSync(this.dataDir)) {
      this.fs.mkdirSync(this.dataDir);
    }

    await this.actualApiClient.init({
      dataDir: this.dataDir,
      serverURL: this.serverURL,
      password: this.password,
    });

    try {
      if (this.e2ePassword) {
        await this.actualApiClient.downloadBudget(this.budgetId, {
          password: this.e2ePassword,
        });
      } else {
        await this.actualApiClient.downloadBudget(this.budgetId);
      }
      console.log('Budget downloaded');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to download budget:', error.message);
      } else {
        console.error('Failed to download budget:', error);
      }
      throw new Error('Budget download failed');
    }
  }

  public async shutdownApi() {
    await this.actualApiClient.shutdown();
  }

  public async getCategories(): Promise<(APICategoryEntity | APICategoryGroupEntity)[]> {
    return this.actualApiClient.getCategories();
  }

  public async getAccounts(): Promise<APIAccountEntity[]> {
    return this.actualApiClient.getAccounts();
  }

  public async getAccountBalance(id: string): Promise<number> {
    return this.actualApiClient.getAccountBalance(id);
  }

  public async getTransactions(): Promise<TransactionEntity[]> {
    return this.actualApiClient.getTransactions(undefined, undefined, undefined);
  }
}

export default ActualApiService;
