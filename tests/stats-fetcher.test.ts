import InMemoryActualApiService from './test-doubles/in-memory-actual-api-service';
import GivenActualData from './test-doubles/given/given-actual-data';
import StatsFetcher from '../src/stats-fetcher';

describe('StatsFetcher', () => {
  let inMemoryApiService: InMemoryActualApiService;

  beforeEach(() => {
    inMemoryApiService = new InMemoryActualApiService();
  });

  it('It returns budget name if it is set', async () => {
    // Arrange
    const budgetName = 'Fancy Budget Name';
    const budget = { budgetId: 'budget id', e2ePassword: null, name: budgetName };

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    // Assert
    expect(stats.budget).toEqual(budgetName);
  });

  it('It returns all categories', async () => {
    // Arrange
    const budget = { budgetId: 'budget id', e2ePassword: null, name: 'name' };
    const categoryGroceries = GivenActualData.createCategory('id1', 'Groceries', 'group1');
    const categoryTravel = GivenActualData.createCategory('id2', 'Travel', 'group1');
    inMemoryApiService.setCategories([categoryGroceries, categoryTravel]);

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    // Assert
    expect(stats.categories).toEqual([
      { id: 'id1', name: 'Groceries', transactionCount: 0 },
      { id: 'id2', name: 'Travel', transactionCount: 0 },
    ]);
  });

  it('It returns all accounts', async () => {
    // Arrange
    const budget = { budgetId: 'budget id', e2ePassword: null, name: 'name' };
    const accountMain = GivenActualData.createAccount('id1', 'Main', false, false);
    const accountOffBudget = GivenActualData.createAccount('id2', 'Off Budget', true, false);
    inMemoryApiService.setAccounts([accountMain, accountOffBudget]);

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    // Assert
    expect(stats.accounts).toEqual([
      {
        id: 'id1', name: 'Main', balance: 0, isOffBudget: false,
      },
      {
        id: 'id2', name: 'Off Budget', balance: 0, isOffBudget: true,
      },
    ]);
  });

  it('It calculates total balance properly', async () => {
    // Arrange
    inMemoryApiService.setAccounts(GivenActualData.createSampleAccounts());
    inMemoryApiService.setCategories(GivenActualData.createSampleCategories());
    const budget = { budgetId: 'budget id', e2ePassword: null, name: 'name' };
    const transaction1 = GivenActualData.createTransaction(
      { amount: 100, account: GivenActualData.ACCOUNT_MAIN },
    );
    const transaction2 = GivenActualData.createTransaction(
      { amount: -200, account: GivenActualData.ACCOUNT_OFF_BUDGET },
    );
    const transaction3 = GivenActualData.createTransaction(
      {
        amount: 500,
        account: GivenActualData.ACCOUNT_MAIN,
        category: GivenActualData.CATEGORY_SALARY,
      },
    );
    inMemoryApiService.setTransactions([transaction1, transaction2, transaction3]);

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    // Assert
    expect(stats.balance).toEqual(400);
  });

  it('It returns proper uncategorized transactions count', async () => {
    // Arrange
    inMemoryApiService.setAccounts(GivenActualData.createSampleAccounts());
    inMemoryApiService.setCategories(GivenActualData.createSampleCategories());
    const budget = { budgetId: 'budget id', e2ePassword: null, name: 'name' };
    const transaction1 = GivenActualData.createTransaction(
      { amount: 100, account: GivenActualData.ACCOUNT_MAIN },
    );
    const transaction2 = GivenActualData.createTransaction(
      { amount: -200, account: GivenActualData.ACCOUNT_OFF_BUDGET },
    );
    const transaction3 = GivenActualData.createTransaction(
      {
        amount: 500,
        account: GivenActualData.ACCOUNT_MAIN,
        category: GivenActualData.CATEGORY_SALARY,
      },
    );
    inMemoryApiService.setTransactions([transaction1, transaction2, transaction3]);

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    // Assert
    expect(stats.uncategorizedTransactionCount).toEqual(1);
  });
  it('It returns proper categorized transactions count', async () => {
    // Arrange
    inMemoryApiService.setAccounts(GivenActualData.createSampleAccounts());
    inMemoryApiService.setCategories(GivenActualData.createSampleCategories());
    const budget = { budgetId: 'budget id', e2ePassword: null, name: 'name' };
    const transaction1 = GivenActualData.createTransaction(
      {
        amount: 100,
        account: GivenActualData.ACCOUNT_MAIN,
        category: GivenActualData.CATEGORY_SALARY,
      },
    );
    const transaction2 = GivenActualData.createTransaction(
      {
        amount: -200,
        account: GivenActualData.ACCOUNT_OFF_BUDGET,
      },
    );
    const transaction3 = GivenActualData.createTransaction(
      {
        amount: 500,
        account: GivenActualData.ACCOUNT_MAIN,
        category: GivenActualData.CATEGORY_SALARY,
      },
    );
    inMemoryApiService.setTransactions([transaction1, transaction2, transaction3]);

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    const salaryCategory = stats.categories.find((c) => c.id === GivenActualData.CATEGORY_SALARY);

    // Assert
    expect(salaryCategory?.transactionCount).toEqual(2);
  });
  it('It returns proper account balance', async () => {
    // Arrange
    inMemoryApiService.setAccounts(GivenActualData.createSampleAccounts());
    inMemoryApiService.setCategories(GivenActualData.createSampleCategories());
    const budget = { budgetId: 'budget id', e2ePassword: null, name: 'name' };
    const transaction1 = GivenActualData.createTransaction(
      {
        amount: 100,
        account: GivenActualData.ACCOUNT_MAIN,
        category: GivenActualData.CATEGORY_SALARY,
      },
    );
    const transaction2 = GivenActualData.createTransaction(
      {
        amount: -200,
        account: GivenActualData.ACCOUNT_MAIN,
        category: GivenActualData.CATEGORY_TRAVEL,
      },
    );
    const transaction3 = GivenActualData.createTransaction(
      {
        amount: 500,
        account: GivenActualData.ACCOUNT_MAIN,
        category: GivenActualData.CATEGORY_SALARY,
      },
    );
    inMemoryApiService.setTransactions([transaction1, transaction2, transaction3]);

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    const travelCategory = stats.categories.find((c) => c.id === GivenActualData.CATEGORY_TRAVEL);
    const salaryCategory = stats.categories.find((c) => c.id === GivenActualData.CATEGORY_SALARY);

    // Assert
    expect(salaryCategory?.transactionCount).toEqual(2);
    expect(travelCategory?.transactionCount).toEqual(1);
  });
  it('It returns proper transferCount', async () => {
    // Arrange
    inMemoryApiService.setAccounts(GivenActualData.createSampleAccounts());
    inMemoryApiService.setCategories(GivenActualData.createSampleCategories());
    const budget = { budgetId: 'budget id', e2ePassword: null, name: 'name' };
    const transaction1 = GivenActualData.createTransaction(
      {
        amount: 100,
        account: GivenActualData.ACCOUNT_MAIN,
        isTransfer: true,
      },
    );
    const transaction2 = GivenActualData.createTransaction(
      {
        amount: -200,
        account: GivenActualData.ACCOUNT_MAIN,
        category: GivenActualData.CATEGORY_TRAVEL,
      },
    );
    inMemoryApiService.setTransactions([transaction1, transaction2]);

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    // Assert
    expect(stats.transfersCount).toEqual(1);
  });
  it('It ignores starting balance transactions from uncategorized count', async () => {
    // Arrange
    inMemoryApiService.setAccounts(GivenActualData.createSampleAccounts());
    const budget = { budgetId: 'budget id', e2ePassword: null, name: 'name' };
    const transaction1 = GivenActualData.createTransaction(
      {
        amount: 100,
        account: GivenActualData.ACCOUNT_MAIN,
        isStartingBalance: true,
      },
    );
    inMemoryApiService.setTransactions([transaction1]);

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    // Assert
    expect(stats.uncategorizedTransactionCount).toEqual(0);
  });
  it('It ignores transactions from offBudgetAccounts from uncategorized count', async () => {
    // Arrange
    const offBudgetAccount = GivenActualData.createAccount('id1', 'Off Budget', true, false);
    inMemoryApiService.setAccounts([offBudgetAccount]);
    const budget = { budgetId: 'budget id', e2ePassword: null, name: 'name' };
    const transaction1 = GivenActualData.createTransaction(
      {
        amount: 100,
        account: 'id1',
      },
    );
    inMemoryApiService.setTransactions([transaction1]);

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    // Assert
    expect(stats.uncategorizedTransactionCount).toEqual(0);
  });
  it('It processes sub-transactions as normal ones', async () => {
    // Arrange
    inMemoryApiService.setAccounts(GivenActualData.createSampleAccounts());
    inMemoryApiService.setCategories(GivenActualData.createSampleCategories());
    const budget = { budgetId: 'budget id', e2ePassword: null, name: 'name' };
    const subTransaction1 = GivenActualData.createTransaction(
      {
        amount: 100,
        account: GivenActualData.ACCOUNT_MAIN,
        category: GivenActualData.CATEGORY_SALARY,
      },
    );
    const subTransaction2 = GivenActualData.createTransaction(
      {
        amount: -200,
        account: GivenActualData.ACCOUNT_MAIN,
      },
    );
    const transaction1 = GivenActualData.createTransaction(
      {
        amount: 500,
        account: GivenActualData.ACCOUNT_MAIN,
        category: GivenActualData.CATEGORY_SALARY,
        subtransactions: [subTransaction1, subTransaction2],
      },
    );
    inMemoryApiService.setTransactions([transaction1]);

    // Act
    const stats = await new StatsFetcher(inMemoryApiService).fetch(budget);

    const salaryCategory = stats.categories.find((c) => c.id === GivenActualData.CATEGORY_SALARY);

    // Assert
    expect(salaryCategory?.transactionCount).toEqual(1);
    expect(stats.uncategorizedTransactionCount).toEqual(1);
    expect(stats.transactionCount).toEqual(2);
  });
});
