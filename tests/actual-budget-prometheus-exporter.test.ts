import { APIAccountEntity, APICategoryEntity } from '@actual-app/api/@types/loot-core/server/api-models';
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
    inMemoryApiService.setCategories(categories);
    inMemoryApiService.setAccounts(accounts);
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
  });

  // todo write more tests
});
