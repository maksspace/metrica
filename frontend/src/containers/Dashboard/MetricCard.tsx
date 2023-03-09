import React from "react";
import MetricChart from "./MetricChart";
import MetricEditor from "./MetricEditor";
import { Metric, MetricResult } from "../../api";

class MetricCard extends React.Component<MetricCardProps, MetricCardState> {
  state = {
    edit: false,
  };

  render() {
    const { metric, data } = this.props;
    const { edit } = this.state;

    return (
      <div
        className="metric"
        key={metric.id}
        style={{ border: "1px solid black", display: "flex" }}
      >
        <div className="metric_head">
          <div className="metric_title">{metric.title}</div>
          <div className="metric_action">
            <button
              style={{ marginRight: 4 }}
              onClick={() => this.setState({ edit: !edit })}
            >
              {edit ? "cancel" : "edit"}
            </button>
            <button onClick={() => this.props.onDelete(metric.id)}>
              delete
            </button>
          </div>
        </div>
        <div className="metric_content">
          {edit ? (
            <MetricEditor metric={metric} />
          ) : (
            <MetricChart metric={metric} data={data} />
          )}
        </div>
      </div>
    );
  }
}

export interface MetricCardProps {
  metric: Metric;
  data: MetricResult;
  onDelete: (id: string) => void;
}

export interface MetricCardState {
  edit: boolean;
}

export default MetricCard;
