import {
  Budget, Metrics, MetricsRendererI, Stats, StatsFetcherI,
} from './types';

export default class ActualBudgetPrometheusExporter {
  private metricsRenderer: MetricsRendererI;

  private statsFetcher: StatsFetcherI;

  private budgets: Budget[];

  constructor(
    statsFetcher: StatsFetcherI,
    metricsRenderer: MetricsRendererI,
    budgets: Budget[],
  ) {
    this.metricsRenderer = metricsRenderer;
    this.statsFetcher = statsFetcher;
    this.budgets = budgets;
  }

  async getMetrics(): Promise<Metrics> {
    const stats: Stats[] = [];
    for (const budget of this.budgets) {
      console.log(`Fetching stats for budget: ${budget.name}`);
      stats.push(await this.statsFetcher.fetch(budget));
    }
    const register = this.metricsRenderer.renderFromStats(stats);
    return {
      metrics: await register.metrics(),
      contentType: register.contentType,
    };
  }
}
