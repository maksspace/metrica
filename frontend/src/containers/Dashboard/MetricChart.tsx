import React from "react";
import ApexChart, { Props as ApexChartProps } from "react-apexcharts";
import { Metric, MetricResult } from "../../api";

const chartOptions: ApexChartProps = {
  xaxis: { type: "datetime" },
  stroke: {
    curve: "smooth",
    width: 1.2,
  },
};

class MetricChart extends React.Component<MetricChartProps> {
  render() {
    const { data, metric } = this.props;

    const [value, timestamp] = data;
    const series = [{ name: metric.title, data: [{ x: timestamp, y: value }] }];

    return <ApexChart type="bar" options={chartOptions} series={series} />;
  }
}

export interface MetricChartProps {
  metric: Pick<Metric, "title">;
  data: MetricResult;
}

export default MetricChart;
