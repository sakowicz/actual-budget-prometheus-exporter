import client from 'prom-client';
import { MetricsRendererI, Stats } from './types';

export default class MetricsRenderer implements MetricsRendererI {
  private register: client.Registry;

  private accountGauge: client.Gauge;

  private categoryGauge: client.Gauge;

  private uncategorizedTransactionCountGauge: client.Gauge;

  private balance: client.Gauge;

  private transactionCount: client.Gauge;

  private transfersCount: client.Gauge;

  constructor() {
    this.register = new client.Registry();

    this.balance = new client.Gauge({
      name: 'actual_budget_balance',
      help: 'Balance of all account',
    });

    this.transactionCount = new client.Gauge({
      name: 'actual_budget_transaction_count',
      help: 'Total number of transactions',
    });

    this.accountGauge = new client.Gauge({
      name: 'actual_budget_account_balance',
      help: 'Account Balance',
      labelNames: ['account', 'is_off_budget'],
    });

    this.categoryGauge = new client.Gauge({
      name: 'actual_budget_category_tranasction_count',
      help: 'Category Transaction Count',
      labelNames: ['category'],
    });

    this.uncategorizedTransactionCountGauge = new client.Gauge({
      name: 'actual_budget_uncategorized_transaction_count',
      help: 'Uncategorized Transaction Count',
    });

    this.transfersCount = new client.Gauge({
      name: 'actual_budget_transfers_count',
      help: 'Transfers Count',
    });

    this.register.registerMetric(this.accountGauge);
    this.register.registerMetric(this.categoryGauge);
    this.register.registerMetric(this.uncategorizedTransactionCountGauge);
    this.register.registerMetric(this.balance);
    this.register.registerMetric(this.transactionCount);
    this.register.registerMetric(this.transfersCount);
  }

  renderFromStats(stats: Stats): client.Registry {
    stats.accounts.forEach((account) => {
      this.accountGauge.set({
        account: account.name,
        is_off_budget: account.isOffBudget ? 'true' : 'false',
      }, account.balance);
    });
    stats.categories.forEach((category) => {
      this.categoryGauge.set({ category: category.name }, category.transactionCount);
    });
    this.uncategorizedTransactionCountGauge.set(stats.uncategorizedTransactionCount);
    this.balance.set(stats.balance);
    this.transactionCount.set(stats.transactionCount);
    this.transfersCount.set(stats.transfersCount);

    return this.register;
  }
}
