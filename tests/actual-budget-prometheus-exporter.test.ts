import { APIAccountEntity, APICategoryEntity, APICategoryGroupEntity } from '@actual-app/api/@types/loot-core/server/api-models';
import InMemoryActualApiService from './test-doubles/in-memory-actual-api-service';
import GivenActualData from './test-doubles/given/given-actual-data';
import ActualBudgetPrometheusExporter from '../src/actual-budget-prometheus-exporter';
import MetricsRenderer from '../src/metrics-renderer';
import StatsFetcher from '../src/stats-fetcher';
import { MetricsRendererI, StatsFetcherI } from '../src/types';

describe('ActualBudgetPrometheusExporter', () => {
  let sut: ActualBudgetPrometheusExporter;
  let inMemoryApiService: InMemoryActualApiService;
  let metricsRenderer: MetricsRendererI;
  let statsFetcher: StatsFetcherI;

  beforeEach(() => {
    inMemoryApiService = new InMemoryActualApiService();
    const categories: APICategoryEntity[] = GivenActualData.createSampleCategories();
    const accounts: APIAccountEntity[] = GivenActualData.createSampleAccounts();
    const groups: APICategoryGroupEntity[] = GivenActualData.createRandomGroups(2,5);
    inMemoryApiService.setCategories(categories);
    inMemoryApiService.setAccounts(accounts);
    inMemoryApiService.setCategoryGroups(groups);
    metricsRenderer = new MetricsRenderer();
    statsFetcher = new StatsFetcher(inMemoryApiService);
  });

  it('It should return metrics', async () => {
    // Arrange
    inMemoryApiService.setTransactions(GivenActualData.createSampleTransactions());

    // Act
    sut = new ActualBudgetPrometheusExporter(
      statsFetcher,
      metricsRenderer,
      [{ budgetId: '1', e2ePassword: 'password', name: 'budget' }],
    );
    const metrics = await sut.getMetrics();

    // Assert
    expect(metrics.metrics).toContain('actual_budget_balance');
    expect(metrics.metrics).toContain('actual_budget_transaction_count');
    expect(metrics.metrics).toContain('actual_budget_account_balance');
    expect(metrics.metrics).toContain('actual_budget_category_transaction_count');
    expect(metrics.metrics).toContain('actual_budget_category_tranasction_count');
    expect(metrics.metrics).toContain('actual_budget_category_transaction_amount');
    expect(metrics.metrics).toContain('actual_budget_transaction');
    expect(metrics.metrics).toContain('actual_budget_uncategorized_transaction_count');
    expect(metrics.metrics).toContain('actual_budget_transfers_count');
  });

  // todo write more tests
});
