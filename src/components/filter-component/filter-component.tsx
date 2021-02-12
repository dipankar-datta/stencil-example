import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';
import { OlympicWinnersJsonURL } from '../../constants';
import { Filter, OlympicWinner } from '../../types';

@Component({
    tag: 'filter-component',
    styleUrl: '../../../node_modules/bootstrap/scss/bootstrap.scss', 
    shadow: true
  })
  class FilterComponent {

    @State() countries: string[] = [];

    @State() years: number[] = [];

    @State() data: {countries: string[], years: number[]};

    @Event({
        eventName: 'filterChange',
        bubbles: true,
        composed: false,
        cancelable: true,
    }) 
    onChangeEmitter: EventEmitter<{country: string, year: number}>;

    private filter: Filter;

    constructor() {
        this.data = {countries: [], years: []};
        this.filter = {country: "", year: 0};
    }


    componentDidLoad() {
        this.fetchData();
    }

    processResponse = (winners: OlympicWinner[]) => {
        const years: number[] = [];
        const countries: string[] = [];

        winners.forEach(winner => {
            if (years.indexOf(winner.year) === -1) {
                years.push(winner.year)
            }
            if (countries.indexOf(winner.country) === -1) {
                countries.push(winner.country)
            }
        })

        years.sort();
        countries.sort();

        this.data = {countries, years};
    }

    async fetchData() {
        await fetch(OlympicWinnersJsonURL)
        .then(response => response.json().then(this.processResponse));
    }

    filterChangeHandler = (filter: string, value: string) => {

        if (filter === 'country') {
            this.filter.country = value;
        } else if (filter === 'year') {
            this.filter.year = Number(value);
        }

        this.onChangeEmitter.emit(this.filter);

    }


    render() {
        return (
            <form>
                <div class="form-row">               
                    {this.data && this.data.countries && this.data.countries.length > 0 ? 
                    (
                        <div class="form-group col-md-6">
                            <label htmlFor="inputState">Country</label>
                            <select  id="inputState" class="form-control" onChange={(e: any) => this.filterChangeHandler('country', e.target.value)}>
                                <option>Choose...</option>
                                {this.data.countries.map(country => <option selected={this.filter && this.filter.country && this.filter.country === country} value={country}>{country}</option>)}
                            </select>
                        </div>
                    ) : <div/>}
                    

                    {this.data && this.data.years && this.data.years.length > 0 ? 
                    (
                        <div class="form-group col-md-6">
                            <label htmlFor="inputState">Year</label>
                            <select id="inputState" class="form-control" onChange={(e: any) => this.filterChangeHandler('year', e.target.value)}>
                                <option selected>Choose...</option>
                                {this.data.years.map(year => <option selected={this.filter && this.filter.year && this.filter.year === year} value={year}>{year}</option>)}
                            </select>
                        </div> 
                    ) : <div/>}
                      
                </div>  
            </form>
            );
    }    
  }