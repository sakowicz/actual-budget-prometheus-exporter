import dotenv from 'dotenv';
import { Budget } from './types';

dotenv.config();

export const serverURL = process.env.ACTUAL_SERVER_URL ?? '';
export const password = process.env.ACTUAL_PASSWORD ?? '';
export const dataDir = '/tmp/actual-budget-prometheus-exporter/';

const configBudgets: Budget[] = [];

let index = 1;
while (process.env[`ACTUAL_BUDGET_ID_${index}`]) {
  configBudgets.push({
    budgetId: process.env[`ACTUAL_BUDGET_ID_${index}`] ?? '',
    e2ePassword: process.env[`ACTUAL_E2E_PASSWORD_${index}`] ?? null,
    name: process.env[`ACTUAL_BUDGET_NAME_${index}`] ?? process.env[`ACTUAL_BUDGET_ID_${index}`] ?? '',
  });
  index++;
}

if (configBudgets.length === 0 && process.env.ACTUAL_BUDGET_ID) {
  configBudgets.push({
    budgetId: process.env.ACTUAL_BUDGET_ID ?? '',
    e2ePassword: process.env.ACTUAL_E2E_PASSWORD ?? null,
    name: process.env.ACTUAL_BUDGET_ID ?? '',
  });
}

export const budgets = configBudgets;
