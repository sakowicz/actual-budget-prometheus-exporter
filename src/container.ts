import * as actualApiClient from '@actual-app/api';
import fs from 'fs';
import ActualApiService from './actual-api-service';
import {
  budgets, dataDir, password, serverURL,
} from './config';
import StatsFetcher from './stats-fetcher';
import MetricsRenderer from './metrics-renderer';
import ActualBudgetPrometheusExporter from './actual-budget-prometheus-exporter';

const actualApiService = new ActualApiService(
  actualApiClient,
  fs,
  dataDir,
  serverURL,
  password,
);

const statsFetcher = new StatsFetcher(actualApiService);
const metricsRenderer = new MetricsRenderer();

const actualPrometheusExporter = new ActualBudgetPrometheusExporter(
  statsFetcher,
  metricsRenderer,
  budgets,
);

export default actualPrometheusExporter;
