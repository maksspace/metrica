import * as dotenv from 'dotenv';

dotenv.config();

import { v2, client } from '@datadog/datadog-api-client';
import NodeCron from 'node-cron';
import { MetricSeries } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/index.js';
import { MetricsService } from './metrics.service.js';

const conf = client.createConfiguration({
  authMethods: {
    apiKeyAuth: process.env['DD_API_KEY'],
    appKeyAuth: process.env['DD_APP_KEY'],
  },
});

client.setServerVariables(conf, {
  site: process.env['DD_METRICS_DOMAIN'] ?? 'datadoghq.com',
});

const metricsService = MetricsService.create();
const datadogClient = new v2.MetricsApi(conf);

export async function collectMetrics() {
  const tags = [
    `env:${process.env.NODE_ENV}`,
    `service:metrica`,
    `version:${process.env.npm_package_version}`,
  ];

  const series: MetricSeries[] = [];

  for (const metric of metricsService.getAll()) {
    console.log(
      `Collecting metric ${metric.title}: ${new Date().toISOString()}`,
    );

    if (!metric.submit) {
      continue;
    }

    const [value, timestamp] = await metricsService.calculate(metric.id);

    series.push({
      metric: `metrica.${metric.code}`,
      type: 3,
      metadata: {},
      points: [
        {
          timestamp,
          value,
        },
      ],
      tags,
    });
  }

  await datadogClient.submitMetrics({
    body: {
      series,
    },
  });
}

export async function startCollection() {
  await collectMetrics();
  NodeCron.schedule('* * * * *', async () => {
    await collectMetrics();
  });
}
