import {
  Account, ActualApiServiceI, Budget, Category, Stats, StatsFetcherI,
} from './types';

export default class StatsFetcher implements StatsFetcherI {
  private actualApiService: ActualApiServiceI;

  constructor(actualApiService: ActualApiServiceI) {
    this.actualApiService = actualApiService;
  }

  async fetch(budget: Budget): Promise<Stats> {
    await this.actualApiService.initializeApi(budget);
    const actualAccounts = await this.actualApiService.getAccounts();
    const actualCategories = await this.actualApiService.getCategories();
    const accounts: Account[] = [];
    const categories: Category[] = actualCategories.map(
      (category) => (
        { id: category.id, name: category.name, transactionCount: 0 }),
    );
    let balance = 0;

    for (const account of actualAccounts) {
      const accountBalance = await this.actualApiService.getAccountBalance(account.id);
      balance += accountBalance;
      accounts.push({
        id: account.id, name: account.name, balance: accountBalance, isOffBudget: account.offbudget,
      });
    }

    let uncategorizedTransactionCount = 0;
    let transfersCount = 0;

    const transactions = await this.actualApiService.getTransactions();
    const transactionCount = transactions.length;
    transactions.forEach((transaction) => {
      if (transaction.subtransactions && transaction.subtransactions.length > 0) {
        transaction.subtransactions.forEach((subtransaction) => {
          transactions.push(subtransaction);
        });
        return;
      }
      const category = categories.find((c) => c.id === transaction.category);
      if (category) {
        category.transactionCount += 1;
      } else if (transaction.transfer_id) {
        transfersCount += 1;
      } else if (
        transaction.starting_balance_flag
        || accounts.find((a) => a.id === transaction.account)?.isOffBudget) {
        // ignore starting balance or off-budget accounts
      } else {
        uncategorizedTransactionCount += 1;
      }
    });

    await this.actualApiService.shutdownApi();
    return {
      accounts,
      categories,
      uncategorizedTransactionCount,
      transactionCount,
      balance,
      transfersCount,
      budget: budget.name,
    };
  }
}
