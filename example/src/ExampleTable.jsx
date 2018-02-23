import React from 'react';
import Griddle from 'griddle-react';
import GriddleWithCallback from './GriddleWithCallback';
import StructuredFilter from '../../src/main';

import '../../src/react-structured-filter.css';

import ExampleData from './ExampleData';

class ExampleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: [
            {
              category: 'Industry',
              operator: '==',
              value: 'Music',
            },
            {
              category: 'IPO',
              operator: '>',
              value: 'Dec 8, 1980 10:50 PM',
            },
          ],
    };
    this.updateFilter = this.updateFilter.bind(this);
  }

  getJsonData(filterString, sortColumn, sortAscending, page, pageSize, callback) {

    if (filterString==undefined) {
      filterString = "";
    }
    if (sortColumn==undefined) {
      sortColumn = "";
    }

    // Normally you would make a Reqwest here to the server
    var results = ExampleData.filter(filterString, sortColumn, sortAscending, page, pageSize);
    callback(results);
  }


  updateFilter(filter) {
    // Set our filter to json data of the current filter tokens
    this.setState({filter: filter});
  }


  getSymbolOptions() {
    return ExampleData.getSymbolOptions();
  }

  getSectorOptions() {
    return ExampleData.getSectorOptions();
  }

  getIndustryOptions() {
    return ExampleData.getIndustryOptions();
  }


  render() {
    return (
      <div>
        <StructuredFilter
          placeholder="Filter data..."
          options={[
            {category:"Symbol", type:"textoptions", options:this.getSymbolOptions},
            {category:"Name",type:"text"},
            {category:"Price",type:"number"},
            {category:"MarketCap",type:"number"},
            {category:"IPO", type:"date"},
            {category:"Sector", type:"textoptions", options:this.getSectorOptions},
            {category:"Industry", type:"textoptions", options:this.getIndustryOptions}
            ]}
          customClasses={{
            input: "filter-tokenizer-text-input",
            results: "filter-tokenizer-list__container",
            listItem: "filter-tokenizer-list__item"
          }}
          onChange={this.updateFilter}
          value={this.state.filter}
        />
        <GriddleWithCallback
          getExternalResults={this.getJsonData} filter={JSON.stringify(this.state.filter)}
          resultsPerPage={10}
        />
      </div>
    )
  }
}

export default ExampleTable;
