import React from "react";
import "./Dashboard.css";
import * as api from "../../api";
import { Metric, MetricResult } from "../../api";
import MetricCard from "./MetricCard";

class Dashboard extends React.Component<any, DashboardState> {
  state: DashboardState = {
    metrics: [],
    results: {},
  };

  loadMetrics = async () => {
    const metrics = await api.getMetrics();
    this.setState({ metrics }, this.calculateMetrics);
  };

  calculateMetrics = async () => {
    const { metrics, results } = this.state;

    for (const metric of metrics) {
      results[metric.id] = await api.calculateMetric(metric.id);
    }

    this.setState({ results });
  };

  delete = async (id: string) => {
    await api.deleteMetric(id).then(() => {
      const { metrics, results } = this.state;
      const index = metrics.findIndex((metric) => metric.id === id);
      if (index >= 0) {
        metrics.splice(index, 1);
        delete results[id];
        this.setState({ metrics, results });
      }
    });
  };

  create = async () => {
    const { metrics } = this.state;
    metrics.push({
      id: "",
      title: "",
      code: "",
      query: "",
    });
    this.setState({ metrics });
  };

  componentDidMount() {
    this.loadMetrics();
  }

  render() {
    const { metrics, results } = this.state;

    return (
      <main className="dashboard">
        <div className="dashboard_title">
          <button onClick={this.create}>create</button>
        </div>
        <div className="metrics">
          {metrics.map((metric: any) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              data={results[metric.id] || []}
              onDelete={this.delete}
            />
          ))}
        </div>
      </main>
    );
  }
}

export interface DashboardState {
  metrics: Metric[];
  results: Record<string, MetricResult>;
}

export default Dashboard;
