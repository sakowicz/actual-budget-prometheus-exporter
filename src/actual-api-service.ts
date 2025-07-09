import {
  APIAccountEntity,
  APICategoryEntity,
  APICategoryGroupEntity,
} from '@actual-app/api/@types/loot-core/src/server/api-models';
import { TransactionEntity } from '@actual-app/api/@types/loot-core/src/types/models';
import { ActualApiServiceI, Budget } from './types';

class ActualApiService implements ActualApiServiceI {
  private actualApiClient: typeof import('@actual-app/api');

  private fs: typeof import('fs');

  private readonly dataDir: string;

  private readonly serverURL: string;

  private readonly password: string;

  constructor(
    actualApiClient: typeof import('@actual-app/api'),
    fs: typeof import('fs'),
    dataDir: string,
    serverURL: string,
    password: string,
  ) {
    this.actualApiClient = actualApiClient;
    this.fs = fs;
    this.dataDir = dataDir;
    this.serverURL = serverURL;
    this.password = password;
  }

  public async initializeApi(budget: Budget): Promise<void> {
    if (!this.fs.existsSync(this.dataDir)) {
      this.fs.mkdirSync(this.dataDir);
    }

    await this.actualApiClient.init({
      dataDir: this.dataDir,
      serverURL: this.serverURL,
      password: this.password,
    });

    try {
      if (budget.e2ePassword) {
        await this.actualApiClient.downloadBudget(budget.budgetId, {
          password: budget.e2ePassword,
        });
      } else {
        await this.actualApiClient.downloadBudget(budget.budgetId);
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.actualApiClient.getCategories();
  }

  public async getAccounts(): Promise<APIAccountEntity[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.actualApiClient.getAccounts();
  }

  public async getAccountBalance(id: string): Promise<number> {
    return this.actualApiClient.getAccountBalance(id);
  }

  public async getTransactions(): Promise<TransactionEntity[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.actualApiClient.getTransactions(undefined, undefined, undefined);
  }
}

export default ActualApiService;
