import {
  APIAccountEntity,
  APICategoryEntity,
  APICategoryGroupEntity,
} from '@actual-app/api/@types/loot-core/server/api-models';
import { TransactionEntity } from '@actual-app/api/@types/loot-core/types/models';
import client from 'prom-client';

export interface ActualApiServiceI {
  initializeApi(): Promise<void>;

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
}

export interface MetricsRendererI {
  renderFromStats(stats: Stats): client.Registry<'text/plain; version=0.0.4; charset=utf-8'>
}

export interface StatsFetcherI {
  fetch(): Promise<Stats>
}

export interface Metrics {
  metrics: string,
  contentType: string,
}
