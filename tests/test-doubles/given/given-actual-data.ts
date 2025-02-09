import { APIAccountEntity, APICategoryEntity } from '@actual-app/api/@types/loot-core/server/api-models';
import { TransactionEntity } from '@actual-app/api/@types/loot-core/types/models';

export default class GivenActualData {
  public static CATEGORY_GROCERIES = 'ff7be77b-40f4-4e9d-aea4-be6b8c431281';

  public static CATEGORY_TRAVEL = '541836f1-e756-4473-a5d0-6c1d3f06c7fa';

  public static CATEGORY_SALARY = '123836f1-e756-4473-a5d0-6c1d3f06c7fa';

  public static ACCOUNT_OFF_BUDGET = '321836f1-e756-4473-a5d0-6c1d3f06c7fa';

  public static ACCOUNT_MAIN = '333836f1-e756-4473-a5d0-6c1d3f06c7fa';

  public static createCategory(id: string, name: string, groupId: string): APICategoryEntity {
    return { id, name, group_id: groupId };
  }

  public static createAccount(
    id: string,
    name: string,
    isOffBudget: boolean,
    isClosed: boolean,
  ): APIAccountEntity {
    return {
      id, name, offbudget: isOffBudget, closed: isClosed,
    };
  }

  public static createTransaction(
    {
      id = null,
      amount = 123,
      importedPayee = 'Sample Payee',
      notes = '',
      account = GivenActualData.ACCOUNT_MAIN,
      isParent = false,
      category = undefined,
      isTransfer = false,
      isStartingBalance = false,
      subtransactions = [],
    }: {
      id?: string | null,
      amount?: number,
      importedPayee?: string,
      notes?: string,
      account?: string,
      isParent?: boolean,
      category?: string | undefined,
      isTransfer?: boolean,
      isStartingBalance?: boolean,
      subtransactions?: TransactionEntity[],
    },
  ): TransactionEntity {
    return {
      id: id ?? Math.random().toString(),
      amount,
      imported_payee: importedPayee,
      account,
      date: '2021-01-01',
      notes,
      is_parent: isParent,
      category,
      transfer_id: isTransfer ? Math.random().toString() : undefined,
      starting_balance_flag: isStartingBalance,
      subtransactions: subtransactions.length > 0 ? subtransactions : undefined,
    };
  }

  public static createSampleCategories(): APICategoryEntity[] {
    return [
      this.createCategory(GivenActualData.CATEGORY_GROCERIES, 'Groceries', '1'),
      this.createCategory(GivenActualData.CATEGORY_TRAVEL, 'Travel', '1'),
      this.createCategory(GivenActualData.CATEGORY_SALARY, 'Salary', '2'),
    ];
  }

  public static createSampleAccounts(): APIAccountEntity[] {
    return [
      this.createAccount(GivenActualData.ACCOUNT_MAIN, 'Main Account', false, false),
      this.createAccount(GivenActualData.ACCOUNT_OFF_BUDGET, 'Off Budget Account', true, false),
    ];
  }

  public static createSampleTransactions(): TransactionEntity[] {
    return [
      this.createTransaction({
        id: '1',
        amount: 100,
        importedPayee: 'Carrefour 32321',
        notes: 'Transaction without category',
      }),
    ];
  }
}
