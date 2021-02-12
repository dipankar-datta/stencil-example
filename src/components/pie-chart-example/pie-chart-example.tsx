import { Component, Prop, h, Watch, State  } from '@stencil/core';
import * as Highcharts from 'highcharts';
import { OlympicWinnersJsonURL } from '../../constants';
import { OlympicWinner } from '../../types';

interface Filter {
    country: string;
    year: number;
}

@Component({
  tag: 'pie-chart-example',
  shadow: true
})
class PieChartExample {

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

  @Watch('year')
  yearChangeHandler(newValue: number, oldValue: number) {
    if (newValue !== oldValue) {
        this.filter.year = newValue;
        this.fetchData(this.filter);
    }
  }

  processSeries(winners: OlympicWinner[]) {

    let totalGold = 0;
    let totalSilver = 0;
    let totalBronze = 0;

      winners.forEach(winner => {
          if(winner) {              
              totalGold = totalGold + winner.gold;
              totalSilver = totalSilver + winner.silver; 
              totalBronze = totalBronze + winner.bronze;           
          } 
      });

      const data: any[] = [];

      data.push({name: 'Gold', y: totalGold, sliced: true, selected: true });
      data.push({name: 'Silver', y: totalSilver});        
      data.push({name: 'Bronze', y: totalBronze});

      const options = Object.assign({}, this.getOptions());
      
      options.series.push({
        name: 'Medals',
        colorByPoint: true,
        data
      });
      this.options = options;
  }



  fetchData(filter: Filter) {
      fetch(OlympicWinnersJsonURL)
      .then((response: any) => {
        response.json().then((data: OlympicWinner[]) => {
            if(data) {
                const filteredData = data.filter((winner: OlympicWinner) => {
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
    return <span ref={el => this.containerRef = el} />;
  }

  constructor() {
    this.filter = {country: 'United States', year: 2008};
    this.options = this.getOptions();
  }

  loadChart() {
    Highcharts.chart(this.containerRef, this.options);
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
  }
  }
}