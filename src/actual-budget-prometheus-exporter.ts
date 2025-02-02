import { Metrics, MetricsRendererI, StatsFetcherI } from './types';

export default class ActualBudgetPrometheusExporter {
  private metricsRenderer: MetricsRendererI;

  private statsFetcher: StatsFetcherI;

  constructor(
    statsFetcher: StatsFetcherI,
    metricsRenderer: MetricsRendererI,
  ) {
    this.metricsRenderer = metricsRenderer;
    this.statsFetcher = statsFetcher;
  }

  async getMetrics(): Promise<Metrics> {
    const stats = await this.statsFetcher.fetch();
    const register = this.metricsRenderer.renderFromStats(stats);
    return {
      metrics: await register.metrics(),
      contentType: register.contentType,
    };
  }
}
