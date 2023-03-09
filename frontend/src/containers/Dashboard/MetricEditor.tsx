import React from "react";
import CodeEditor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism.css";
import * as api from "../../api";
import { Metric } from "../../api";

class MetricEditor extends React.Component<
  MetricEditorProps,
  MetricEditorState
> {
  state = {
    query: "",
    title: "",
    code: "",
    result: [],
  };

  componentDidMount() {
    this.setState({
      query: this.props.metric.query,
      code: this.props.metric.code,
      title: this.props.metric.title,
    });
  }

  calculate = async () => {
    const result = await api.calculateMetric(this.props.metric.id);
    this.setState({ result });
  };

  save = async () => {
    if (!this.props.metric.id) {
      await api.createMetric({
        query: this.state.query,
        title: this.state.title,
        code: this.state.code,
        submit: true,
      });
    } else {
      await api.updateMetric({
        id: this.props.metric.id,
        query: this.state.query,
        title: this.state.title,
      });
    }
  };

  render() {
    const { query, title, code, result } = this.state;

    return (
      <div
        style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}
      >
        <div>
          <input
            style={{ margin: "8px 4px" }}
            placeholder="Title"
            value={title}
            onChange={(e) =>
              this.setState({
                title: e.target.value,
              })
            }
          />
          <input
            style={{ margin: "8px 4px" }}
            placeholder="Code"
            value={code}
            onChange={(e) =>
              this.setState({
                code: e.target.value,
              })
            }
          />
          <button onClick={this.save}>save</button>
          {this.props.metric.id && (
            <button onClick={this.calculate}>exec</button>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <CodeEditor
            value={query}
            onValueChange={(code) => this.setState({ query: code })}
            highlight={(code) => highlight(code, languages.sql, "SQL")}
            padding={10}
            style={{
              border: "1px solid gray",
              borderRadius: "4px",
              height: "100%",
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
        </div>
        <code
          style={{
            border: "1px solid gray",
            borderRadius: "4px",
            padding: 8,
            flex: 1,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </code>
      </div>
    );
  }
}

export interface MetricEditorProps {
  metric: Metric;
}

export interface MetricEditorState {
  title: string;
  query: string;
  code: string;
  result: any[];
}

export default MetricEditor;
