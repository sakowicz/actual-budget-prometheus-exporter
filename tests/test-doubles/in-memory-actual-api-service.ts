import {
  APIAccountEntity,
  APICategoryEntity,
  APICategoryGroupEntity,
} from '@actual-app/api/@types/loot-core/server/api-models';
import { CategoryGroupEntity, PayeeEntity, TransactionEntity } from '@actual-app/api/@types/loot-core/types/models';
import { ActualApiServiceI } from '../../src/types';

export default class InMemoryActualApiService implements ActualApiServiceI {


  private categories: (APICategoryEntity | APICategoryGroupEntity)[] = [];

  private accounts: APIAccountEntity[] = [];

  private transactions: TransactionEntity[] = [];

  private payees: PayeeEntity[] = [];

  private categoryGroups: CategoryGroupEntity[] = [];

  async initializeApi(): Promise<void> {
    // Initialize the API (mock implementation)
  }

  async shutdownApi(): Promise<void> {
    // Shutdown the API (mock implementation)
  }

  async getCategories(): Promise<(APICategoryEntity | APICategoryGroupEntity)[]> {
    return Promise.resolve(this.categories);
  }

  setCategories(categories: (APICategoryEntity | APICategoryGroupEntity)[]): void {
    this.categories = categories;
  }

  async getAccounts(): Promise<APIAccountEntity[]> {
    return Promise.resolve(this.accounts);
  }

  setAccounts(accounts: APIAccountEntity[]): void {
    this.accounts = accounts;
  }

  async getTransactions(): Promise<TransactionEntity[]> {
    return Promise.resolve(this.transactions);
  }

  setTransactions(transactions: TransactionEntity[]): void {
    this.transactions = transactions;
  }

  getAccountBalance(id: string): Promise<number> {
    let balance = 0;
    this.transactions.forEach((transaction) => {
      if (transaction.account === id) {
        balance += transaction.amount;
      }
    });

    return Promise.resolve(balance);
  }

  getPayees(): Promise<PayeeEntity[]> {
    return Promise.resolve(this.payees);
  }

  getCategoryGroups(): Promise<CategoryGroupEntity[]> {
    return Promise.resolve(this.categoryGroups);
  }
}
