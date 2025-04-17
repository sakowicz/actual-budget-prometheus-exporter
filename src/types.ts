import {
  APIAccountEntity,
  APICategoryEntity,
  APICategoryGroupEntity,
} from '@actual-app/api/@types/loot-core/server/api-models';
import { CategoryGroupEntity, PayeeEntity, TransactionEntity } from '@actual-app/api/@types/loot-core/types/models';
import client from 'prom-client';

export interface Budget {
  budgetId: string,
  e2ePassword: string | null,
  name: string,
}

export type MapString = Record<string, string>;

export interface ActualApiServiceI {
  initializeApi(budget: Budget): Promise<void>;

  shutdownApi(): Promise<void>;

  getCategories(): Promise<(APICategoryEntity | APICategoryGroupEntity)[]>

  getCategoryGroups(): Promise<CategoryGroupEntity[]>

  getAccounts(): Promise<APIAccountEntity[]>

  getTransactions(): Promise<TransactionEntity[]>

  getAccountBalance(id: string): Promise<number>

  getPayees(): Promise<PayeeEntity[]>
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
  groupName: string;
  amount: number;
  is_income: boolean;
}

export interface Stats {
  accounts: Account[];
  categories: Category[];
  categoryNames: MapString;
  categoryGroupNames: MapString;
  payeesNames: MapString;
  uncategorizedTransactionCount: number;
  transactionCount: number;
  balance: number;
  transfersCount: number;
  budget: string;
  transactions: TransactionEntity[];
  payees: PayeeEntity[];
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
