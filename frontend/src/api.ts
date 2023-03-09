import axios from "axios";

const httpClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

export async function getMetrics(): Promise<Metric[]> {
  const result = await httpClient.get("/metrics");
  return result.data;
}

export async function updateMetric(metric: any): Promise<Metric> {
  const result = await httpClient.post("/metrics", metric);
  return result.data;
}

export async function deleteMetric(id: string): Promise<void> {
  await httpClient.delete("/metrics/" + id);
}

export async function createMetric(metric: any): Promise<Metric> {
  const result = await httpClient.put("/metrics", metric);
  return result.data;
}

export async function calculateMetric(id: string): Promise<MetricResult> {
  const result = await httpClient.get("/metrics/" + id + "/result");
  return result.data;
}

export interface Metric {
  id: string;
  title: string;
  code: string;
  query: string;
}

export type Timestamp = number;
export type MetricResult = [number, Timestamp];
