import * as actualApiClient from '@actual-app/api';
import fs from 'fs';
import ActualApiService from './actual-api-service';
import {
  budgetId, dataDir, e2ePassword, password, serverURL,
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
  budgetId,
  e2ePassword,
);

const statsFetcher = new StatsFetcher(actualApiService);
const metricsRenderer = new MetricsRenderer();

const actualPrometheusExporter = new ActualBudgetPrometheusExporter(statsFetcher, metricsRenderer);

export default actualPrometheusExporter;
