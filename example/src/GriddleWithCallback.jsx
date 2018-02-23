import React from 'react';
import _ from 'underscore';
import Griddle from 'griddle-react';

const Loading = ({ loadingText }) => (
  <div className="loading">{loadingText}</div>
)

Loading.defaultProps = {
  loadingText: "Loading"
}

const NextArrow = <i className="glyphicon glyphicon-chevron-right" />;
const PreviousArrow = <i className="glyphicon glyphicon-chevron-left" />;
const SettingsIconComponent = <i className="glyphicon glyphicon-cog" />;

class GriddleWithCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      page: 0,
      maxPage: 0,
      sortColumn: null,
      sortAscending: true,
      isLoading: true,
    };
  }

  /**
   * Called when component mounts
   */
  componentDidMount() {
    var state = this.state;
    state.pageSize = this.props.resultsPerPage;

    var that = this;

    if (!this.hasExternalResults()) {
      console.error("When using GriddleWithCallback, a getExternalResults callback must be supplied.");
      return;
    }

    // Update the state with external results when mounting
    state = this.updateStateWithExternalResults(state, function(updatedState) {
      that.setState(updatedState);
    });
  }

  componentWillReceiveProps(nextProps) {
    var state = this.state,
    that = this;

    var state = {
      page: 0,
      filter: nextProps.filter
    }

    this.updateStateWithExternalResults(state, function(updatedState) {
      //if filter is null or undefined reset the filter.
      if (_.isUndefined(nextProps.filter) || _.isNull(nextProps.filter) || _.isEmpty(nextProps.filter)){
        updatedState.filter = nextProps.filter;
        updatedState.filteredResults = null;
      }

      // Set the state.
      that.setState(updatedState);
    });
  }


  /**
   * Utility function
   */
  setDefault(original, value) {
    return typeof original === 'undefined' ? value : original;
  }

  setPage(index, pageSize) {
    //This should interact with the data source to get the page at the given index
    var that = this;
    var state = {
      page: index,
      pageSize: this.setDefault(pageSize, this.state.pageSize)
    };

    this.updateStateWithExternalResults(state, function(updatedState) {
      that.setState(updatedState);
    });
  }

  getExternalResults(state, callback) {
    var filter,
    sortColumn,
    sortAscending,
    page,
    pageSize;

    // Fill the search properties.
    if (state !== undefined && state.filter !== undefined) {
      filter = state.filter;
    } else {
      filter = this.state.filter;
    }

    if (state !== undefined && state.sortColumn !== undefined) {
      sortColumn = state.sortColumn;
    } else {
      sortColumn = this.state.sortColumn;
    }

    sortColumn = _.isEmpty(sortColumn) ? this.props.initialSort : sortColumn;

    if (state !== undefined && state.sortAscending !== undefined) {
      sortAscending = state.sortAscending;
    } else {
      sortAscending = this.state.sortAscending;
    }

    if (state !== undefined && state.page !== undefined) {
      page = state.page;
    } else {
      page = this.state.page;
    }

    if (state !== undefined && state.pageSize !== undefined) {
      pageSize = state.pageSize;
    } else {
      pageSize = this.state.pageSize;
    }

    // Obtain the results
    this.props.getExternalResults(filter, sortColumn, sortAscending, page, pageSize, callback);
  }


  updateStateWithExternalResults(state, callback) {
    var that = this;

    // Update the table to indicate that it's loading.
    this.setState({ isLoading: true });
    // Grab the results.
    this.getExternalResults(state, function(externalResults) {
      // Fill the state result properties
      if (that.props.enableInfiniteScroll && that.state.results) {
        state.results = that.state.results.concat(externalResults.results);
      } else {
        state.results = externalResults.results;
      }

      state.totalResults = externalResults.totalResults;
      state.maxPage = that.getMaxPage(externalResults.pageSize, externalResults.totalResults);
      state.isLoading = false;

      // If the current page is larger than the max page, reset the page.
      if (state.page >= state.maxPage) {
        state.page = state.maxPage - 1;
      }

      callback(state);
    });
  }

  getMaxPage(pageSize, totalResults) {
    if (!totalResults) {
      totalResults = this.state.totalResults;
    }

    var maxPage = Math.ceil(totalResults / pageSize);
    return maxPage;
  }

  hasExternalResults() {
    return typeof(this.props.getExternalResults) === 'function';
  }

  changeSort(sort, sortAscending) {
    var that = this;

    // This should change the sort for the given column
    var state = {
      page:0,
      sortColumn: sort,
      sortAscending: sortAscending
    };

    this.updateStateWithExternalResults(state, function(updatedState) {
      that.setState(updatedState);
    });
  }

  setFilter(filter) {
    // no-op
  }

  setPageSize(size) {
    this.setPage(0, size);
  }

  render() {
    return (
      <Griddle {...this.props} useExternal={true} externalSetPage={this.setPage}
      externalChangeSort={this.changeSort} externalSetFilter={this.setFilter}
      externalSetPageSize={this.setPageSize} externalMaxPage={this.state.maxPage}
      externalCurrentPage={this.state.page} results={this.state.results} tableClassName="table" resultsPerPage={this.state.pageSize}
      externalSortColumn={this.state.sortColumn} externalSortAscending={this.state.sortAscending}
      externalLoadingComponent={this.props.loadingComponent} externalIsLoading={this.state.isLoading}

      loadingComponent={Loading}
      nextIconComponent={NextArrow}
      previousIconComponent={PreviousArrow}
      settingsIconComponent={SettingsIconComponent}
      settingsText="Settings "
      showSettings={true}
      useGriddleStyles={false}
      enableSort={true}
      showFilter={false}
      />
    );
  }
}

GriddleWithCallback.defaultProps = {
  getExternalResults: null,
  resultsPerPage: 10,
  loadingComponent: null,
  enableInfiniteScroll: false,
  filter: "",
}

export default GriddleWithCallback;
