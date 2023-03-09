import fs from 'fs';
import { randomUUID } from 'crypto';
import { ClickHouseClient, createClient } from '@clickhouse/client';

export interface Metric {
  id: string;
  title: string;
  code: string;
  query: string;
  submit: boolean;
}

export type Timestamp = number;
export type MetricResult = [number, Timestamp];

interface DbData {
  metrics: Metric[];
  results: Record<string, MetricResult>;
}

let service: MetricsService | null = null;

// [x, y, z, datetime] | [[x, y, z, datetime]]

export class MetricsService {
  private _ch: ClickHouseClient;
  private _db: DbData = {
    metrics: [],
    results: {},
  };

  constructor() {
    this._readDb();
    this._ch = createClient({
      host: `http://${process.env['CLICKHOUSE_HOST']}:${process.env['CLICKHOUSE_PORT']}`,
      username: process.env['CLICKHOUSE_USERNAME'],
      password: process.env['CLICKHOUSE_PASSWORD'],
      database: process.env['CLICKHOUSE_DB'],
    });
  }

  getAll(): Metric[] {
    return this._db.metrics;
  }

  async create(data: Omit<Metric, 'id'>): Promise<Metric> {
    const metric = {
      id: randomUUID(),
      ...data,
    };

    if (!this._isValidMetric(metric)) {
      throw new Error('Metric is invalid.');
    }

    if (this._db.metrics.some((m) => m.code === metric.code)) {
      throw new Error('Metric with that code already exists.');
    }

    // await this._ch.exec({
    //   query: `create view ${this._viewName(metric.id)} as (${metric.query})`,
    // });

    this._db.metrics.push(metric);
    this._writeDb();

    return metric;
  }

  async delete(id: string): Promise<void> {
    const index = this._db.metrics.findIndex((m) => m.id === id);

    if (typeof index === 'undefined' || index === -1) {
      throw new Error(`Metric ${id} not found`);
    }

    // await this._ch.exec({
    //   query: `drop table ${this._viewName(id)}`,
    // });

    this._db.metrics.splice(index, 1);
    this._writeDb();
  }

  async update(
    metric: Pick<Metric, 'id' | 'title' | 'query'>,
  ): Promise<Metric> {
    const index = this._db.metrics.findIndex((m) => m.id === metric.id);

    if (typeof index === 'undefined' || index === -1) {
      throw new Error(`Metric ${metric.id} not found`);
    }

    if (!this._isValidUpdateMetric(metric)) {
      throw new Error('Metric is invalid.');
    }

    // await this._ch.exec({
    //   query: `drop table ${this._viewName(metric.id)}`,
    // });
    //
    // await this._ch.exec({
    //   query: `create view ${this._viewName(metric.id)} as (${metric.query})`,
    // });

    this._db.metrics[index].title = metric.title;
    this._db.metrics[index].query = metric.query;

    this._writeDb();

    return this._db.metrics[index];
  }

  async calculate(id: string): Promise<MetricResult> {
    const metric = this._db.metrics.find((m) => m.id === id);

    if (!metric) {
      throw new Error(`Metric ${id} not found`);
    }

    if (!metric.query) {
      return [0, new Date().getTime()];
    }

    const result: any = await this._ch
      .query({
        query: metric.query,
        format: 'JSONCompactEachRow',
      })
      .then((res) => res.json());

    const [value, dateTime] = result[0];
    // console.log(dateTime, moment(dateTime).toISOString());
    return [parseFloat(value), dateTime];
  }

  private _writeDb(): void {
    const dbData = JSON.stringify(this._db, null, 2);
    fs.writeFileSync(this._dbFile, dbData);
  }

  private _readDb(): void {
    if (fs.existsSync(this._dbFile)) {
      const dbData = fs.readFileSync(this._dbFile, 'utf-8');
      this._db = JSON.parse(dbData);
    }
  }

  private get _dbFile() {
    return process.env['DB_FILE'] ?? '';
  }

  // private _viewName(id: string): string {
  //   return `metric_${id.replaceAll('-', '')}`;
  // }

  private _isValidMetric(metric: Metric): boolean {
    return (
      typeof metric.id === 'string' &&
      typeof metric.title === 'string' &&
      typeof metric.code === 'string' &&
      typeof metric.query === 'string' &&
      typeof metric.submit === 'boolean'
    );
  }

  private _isValidUpdateMetric(
    metric: Pick<Metric, 'id' | 'title' | 'query'>,
  ): boolean {
    return (
      typeof metric.id === 'string' &&
      typeof metric.title === 'string' &&
      typeof metric.query === 'string'
    );
  }

  static create(): MetricsService {
    if (service) {
      return service;
    }

    service = new MetricsService();

    return service;
  }
}
