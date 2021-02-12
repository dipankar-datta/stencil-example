import { Component, Prop, h, Watch, State  } from '@stencil/core';
import * as Highcharts from 'highcharts';
import { OlympicWinnersJsonURL } from '../../constants';
import { OlympicWinner } from '../../types';

interface Filter {
    country: string
}

interface YearWiseData {
    [year: number]: {gold: number, silver: number, bronze: number};
}

@Component({
  tag: 'column-chart-example',
  shadow: true
})
class ColumnChartExample {

  @Prop() country: string;

  @Prop() year: number;

  containerRef?: HTMLSpanElement;

  private filter: Filter;

  @State()
  private options: any;

  @Watch('country')
  countryChangeHandler(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
        this.filter.country = newValue;
        this.fetchData(this.filter);
    }
  }

  processSeries(winners: OlympicWinner[]) {

      const yearWiseData: YearWiseData = {};

      winners.forEach(winner => {
          let yearData = yearWiseData[winner.year];
          if(yearData) {
              
              yearData.gold = winner.gold + yearData.gold;
              yearData.silver = winner.silver + yearData.silver; 
              yearData.bronze = winner.bronze + yearData.bronze; 
          
          } else {
              yearWiseData[winner.year] = {
                  gold: winner.gold, 
                  silver: winner.silver, 
                  bronze: winner.bronze
              };
          }
      });
      
      const gold: number[] = [];
      const silver: number[] = [];
      const bronze: number[] = [];
      const categories: string[] = [];

      Object.entries(yearWiseData).forEach(([key, value]) => {
          categories.push(key);
          gold.push(value.gold);
          silver.push(value.silver);
          bronze.push(value.bronze);
      });

      const series: any[] = [];

      series.push({name: 'Gold', data: gold });
      series.push({name: 'Silver', data: silver});        
      series.push({name: 'Bronze', data: bronze});

      const options = Object.assign({}, this.getOptions());
      
      options.xAxis.categories = categories;
      options.series = series;
      this.options = options;
  }



  fetchData(filter: Filter) {
      fetch(OlympicWinnersJsonURL)
      .then((response: any) => {
        response.json().then((data: OlympicWinner[]) => {
            if(data) {
                const filteredData = data.filter((winner: OlympicWinner) => {
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
    return <span ref={el => this.containerRef = el} />;
  }

  constructor() {
    this.filter = {country: 'United States'};
    this.options = this.getOptions();
  }

  loadChart() {
    Highcharts.chart(this.containerRef, this.options);
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
    }
  }
}