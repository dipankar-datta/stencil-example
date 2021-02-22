import { r as registerInstance, h } from './index-6ebb3692.js';
import { h as highcharts } from './highcharts-7b83aa59.js';
import { O as OlympicWinnersJsonURL } from './constants-1628b6cd.js';

const ColumnChartExample = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.filter = { country: 'United States' };
    this.options = this.getOptions();
  }
  countryChangeHandler(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.filter.country = newValue;
      this.fetchData(this.filter);
    }
  }
  processSeries(winners) {
    const yearWiseData = {};
    winners.forEach(winner => {
      let yearData = yearWiseData[winner.year];
      if (yearData) {
        yearData.gold = winner.gold + yearData.gold;
        yearData.silver = winner.silver + yearData.silver;
        yearData.bronze = winner.bronze + yearData.bronze;
      }
      else {
        yearWiseData[winner.year] = {
          gold: winner.gold,
          silver: winner.silver,
          bronze: winner.bronze
        };
      }
    });
    const gold = [];
    const silver = [];
    const bronze = [];
    const categories = [];
    Object.entries(yearWiseData).forEach(([key, value]) => {
      categories.push(key);
      gold.push(value.gold);
      silver.push(value.silver);
      bronze.push(value.bronze);
    });
    const series = [];
    series.push({ name: 'Gold', data: gold });
    series.push({ name: 'Silver', data: silver });
    series.push({ name: 'Bronze', data: bronze });
    const options = Object.assign({}, this.getOptions());
    options.xAxis.categories = categories;
    options.series = series;
    this.options = options;
  }
  fetchData(filter) {
    fetch(OlympicWinnersJsonURL)
      .then((response) => {
      response.json().then((data) => {
        if (data) {
          const filteredData = data.filter((winner) => {
            return winner.country === filter.country;
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
        type: 'column'
      },
      title: {
        text: 'Year wise medals of ' + this.filter.country
      },
      xAxis: {
        categories: []
      },
      credits: {
        enabled: false
      },
      series: []
    };
  }
  static get watchers() { return {
    "country": ["countryChangeHandler"]
  }; }
};

export { ColumnChartExample as column_chart_example };
