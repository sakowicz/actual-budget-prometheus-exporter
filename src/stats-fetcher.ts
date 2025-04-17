import { APICategoryEntity } from '@actual-app/api/@types/loot-core/server/api-models';
import {
  Account, ActualApiServiceI, Budget, Category, MapString, Stats, StatsFetcherI,
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
    const categoryNames: MapString = {};
    const categoryGroupNames: MapString = {};
    const payeesNames: MapString = {};

    // Remapping of category group ID into names
    const categoryGroups = await this.actualApiService.getCategoryGroups();
    for (const categoryGroup of categoryGroups) {
      categoryGroupNames[categoryGroup.id] = categoryGroup.name;
    }
    categoryGroupNames[''] = 'undefined';

    const categories: Category[] = actualCategories.map(
      (category) => (
        {
          id: category.id,
          name: category.name,
          transactionCount: 0,
          amount: 0,
          is_income: (category.is_income ?? false),
          groupName: categoryGroupNames[(category as APICategoryEntity).group_id ?? ''],
        }),
    );
    // Mapping of group names from ID
    for (const category of categories) {
      categoryNames[category.id] = category.name;
    }

    const payees = await this.actualApiService.getPayees();
    for (const payee of payees) {
      payeesNames[payee.id] = payee.name;
    }

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
    let transactionCount = transactions.length;
    for (const transaction of transactions) {
      if (transaction.subtransactions && transaction.subtransactions.length > 0) {
        transaction.subtransactions.forEach((subtransaction): void => {
          transactions.push(subtransaction);
          transactionCount += 1;
        });
        transactionCount -= 1;
        continue;
      }
      const category = categories.find((c) => c.id === transaction.category);
      if (category) {
        category.transactionCount += 1;
        category.amount += transaction.amount;
      } else if (transaction.transfer_id) {
        transfersCount += 1;
      } else if (
        transaction.starting_balance_flag
        || accounts.find((a) => a.id === transaction.account)?.isOffBudget) {
        // ignore starting balance or off-budget accounts
      } else {
        uncategorizedTransactionCount += 1;
      }
    }

    await this.actualApiService.shutdownApi();
    return {
      accounts,
      categories,
      categoryGroupNames,
      uncategorizedTransactionCount,
      transactionCount,
      balance,
      transfersCount,
      budget: budget.name,
      transactions,
      payees,
      payeesNames,
      categoryNames,
    };
  }
}
