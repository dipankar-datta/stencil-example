import { Component, Prop, h, Watch, State  } from '@stencil/core';
import { OlympicWinnersJsonURL } from '../../constants';
import { Filter, OlympicWinner } from '../../types';

@Component({
    tag: 'table-example', 
    styleUrl: '../../../node_modules/bootstrap/scss/bootstrap.scss',
    shadow: true
})
class TableExample {

  @Prop() country: string;

  @Prop() year: number;

  private filter: Filter;

  @State()
  private data: OlympicWinner[] = [];

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

  constructor() {
    this.filter = {country: 'United States', year: 2008};
  }

    async fetchData(filter: Filter) {
        await fetch(OlympicWinnersJsonURL)
        .then((response: any) => {
            response.json().then((data: OlympicWinner[]) => {
                if(data) {
                    const filteredData = data.filter((winner: OlympicWinner) => {
                        return winner.country === filter.country && winner.year === filter.year;
                    });
                    this.data = filteredData;
                }
            });
        });
    }

    componentDidLoad() {
        this.fetchData(this.filter);
    }

    render() {
        
        return (                    
            <span>                
                <table class="table table-striped table-dark">
                    {this.getTableHeader()}     
                    {this.getTableBody(this.data)}
                </table>
            </span>            
        );
    }

    getTableHeader() {
        return (
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th>Athlete</th>
                    <th>Age</th>
                    <th>Country</th>
                    <th>Year</th>
                    <th>Date</th>
                    <th>Sport</th>
                    <th>Gold</th>
                    <th>Silver</th>
                    <th>Bronze</th>
                    <th>Total</th>
                </tr>
            </thead>
        );
    }

    getTableBody(data: OlympicWinner[]) {
        const body = (<tbody>
                        {data.map((winner, index) => {
                            return <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{winner.athlete}</td>
                                <td>{winner.age}</td>
                                <td>{winner.country}</td>
                                <td>{winner.year}</td>
                                <td>{winner.date}</td>
                                <td>{winner.sport}</td>
                                <td>{winner.gold}</td>
                                <td>{winner.silver}</td>
                                <td>{winner.bronze}</td>
                                <td>{winner.total}</td>
                            </tr>
                        })}
                    </tbody>);
                    
        
        return  body;
        ;
    }
}