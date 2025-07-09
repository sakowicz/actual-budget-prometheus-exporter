import {
  APIAccountEntity,
  APICategoryEntity,
  APICategoryGroupEntity,
} from '@actual-app/api/@types/loot-core/src/server/api-models';
import { TransactionEntity } from '@actual-app/api/@types/loot-core/src/types/models';
import client from 'prom-client';

export interface Budget {
  budgetId: string,
  e2ePassword: string | null,
  name: string,
}

export interface ActualApiServiceI {
  initializeApi(budget: Budget): Promise<void>;

  shutdownApi(): Promise<void>;

  getCategories(): Promise<(APICategoryEntity | APICategoryGroupEntity)[]>

  getAccounts(): Promise<APIAccountEntity[]>

  getTransactions(): Promise<TransactionEntity[]>

  getAccountBalance(id: string): Promise<number>
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  isOffBudget: boolean;
}

export interface Category {
  id: string;
  name: string;
  transactionCount: number;
}

export interface Stats {
  accounts: Account[];
  categories: Category[];
  uncategorizedTransactionCount: number;
  transactionCount: number;
  balance: number;
  transfersCount: number;
  budget: string,
}

export interface MetricsRendererI {
  renderFromStats(stats: Stats[]): client.Registry<'text/plain; version=0.0.4; charset=utf-8'>
}

export interface Metrics {
  metrics: string,
  contentType: string,
}

export interface StatsFetcherI {
  fetch(budget: Budget): Promise<Stats>
}
