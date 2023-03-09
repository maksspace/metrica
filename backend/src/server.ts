import * as dotenv from 'dotenv';

dotenv.config();

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import { Metric, MetricsService } from './metrics.service.js';

const fastify = Fastify({ logger: true });

fastify.register(FastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

const metricsService = MetricsService.create();

fastify.get('/api/metrics', () => {
  return metricsService.getAll();
});

fastify.put('/api/metrics', async (req) => {
  return await metricsService.create(req.body as Omit<Metric, 'id'>);
});

fastify.post('/api/metrics', async (req) => {
  return await metricsService.update(req.body as Metric);
});

fastify.delete('/api/metrics/:id', async (req) => {
  const { id } = req.params as any;
  await metricsService.delete(id);
  return { ok: true };
});

fastify.get('/api/metrics/:id/result', async (req) => {
  const { id } = req.params as any;
  return await metricsService.calculate(id);
});

export async function startServer() {
  try {
    const port = parseInt(process.env['APP_PORT'] ?? '');
    await fastify.listen({ port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
