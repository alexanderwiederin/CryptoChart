import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Chart from 'chart.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      labels: [],
      data: [],
      start: '2017-08-02',
      end: '2018-08-02',
    };
    this.getData = this.getData.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { start, end } = this.state;
    axios.get(`/v1/bpi/historical/close.json?start=${start}&end=${end}`)
      .then((results) => {
        const { bpi } = results.data;
        const labels = Object.keys(bpi);
        const data = Object.values(bpi);
        this.setState({ labels, data });
        this.renderChart();
      })
      .catch(error => console.log(error));
  }

  handleInputChange(e) {
    e.preventDefault();
    const { id, value } = e.target;
    this.setState({ [id]: value });
  }

  refreshData(e) {
    e.preventDefault();
    this.getData();
  }

  renderChart() {
    const { node } = this;
    const { labels, data } = this.state;
    const myChart = new Chart(node, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: '# of votes',
          data,
        }],
      },
    });
  }

  render() {
    return (
      <div>
        <canvas
          style={{ width: 800, height: 300 }}
          ref={node => (this.node = node)}
        />
        <form>
          start:
          <input id="start" type="date" onChange={e => this.handleInputChange(e)} />
          end:
          <input id="end" type="date" onChange={e => this.handleInputChange(e)} />
          <button type="submit" onClick={e => this.refreshData(e)}>getData</button>
        </form>
        <p>
        Powered by:
          <a href="https://www.coindesk.com/price/bitcoin">Coindesk</a>
        </p>

      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
