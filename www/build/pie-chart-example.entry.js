import { r as registerInstance, h } from './index-6ebb3692.js';
import { h as highcharts } from './highcharts-7b83aa59.js';
import { O as OlympicWinnersJsonURL } from './constants-1628b6cd.js';

const PieChartExample = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.filter = { country: 'United States', year: 2008 };
    this.options = this.getOptions();
  }
  countryChangeHandler(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.filter.country = newValue;
      this.fetchData(this.filter);
    }
  }
  yearChangeHandler(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.filter.year = newValue;
      this.fetchData(this.filter);
    }
  }
  processSeries(winners) {
    let totalGold = 0;
    let totalSilver = 0;
    let totalBronze = 0;
    winners.forEach(winner => {
      if (winner) {
        totalGold = totalGold + winner.gold;
        totalSilver = totalSilver + winner.silver;
        totalBronze = totalBronze + winner.bronze;
      }
    });
    const data = [];
    data.push({ name: 'Gold', y: totalGold, sliced: true, selected: true });
    data.push({ name: 'Silver', y: totalSilver });
    data.push({ name: 'Bronze', y: totalBronze });
    const options = Object.assign({}, this.getOptions());
    options.series.push({
      name: 'Medals',
      colorByPoint: true,
      data
    });
    this.options = options;
  }
  fetchData(filter) {
    fetch(OlympicWinnersJsonURL)
      .then((response) => {
      response.json().then((data) => {
        if (data) {
          const filteredData = data.filter((winner) => {
            return winner.country === filter.country && winner.year === filter.year;
          });
          this.processSeries(filteredData);
        }
      });
    });
  }
  componentDidLoad() {
    if (!this.containerRef) {
      return;
    }
    this.loadChart();
    this.fetchData(this.filter);
  }
  componentDidUpdate() {
    this.loadChart();
  }
  render() {
    return h("span", { ref: el => this.containerRef = el });
  }
  loadChart() {
    highcharts.chart(this.containerRef, this.options);
  }
  getOptions() {
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Medals won by ' + this.filter.country + ' in ' + this.filter.year
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: []
    };
  }
  static get watchers() { return {
    "country": ["countryChangeHandler"],
    "year": ["yearChangeHandler"]
  }; }
};

export { PieChartExample as pie_chart_example };
