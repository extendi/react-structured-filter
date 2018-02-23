import React from 'react';
import ReactDOM from 'react-dom';
import ExampleTable from './ExampleTable';

import './css/griddle.css';

ReactDOM.render(
  <div>
    <div className="navbar navbar-default navbar-static-top">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">react-structured-filter demo</a>
        </div>
      </div>
    </div>

    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Example stock data</h3>
        </div>
        <div className="panel-body">
          <ExampleTable/>
          <hr/>
          <p><a href="https://github.com/joshcarr/react-structured-filter/blob/master/docs/index.md">Documentation</a></p>

        </div>
      </div>
    </div>
  </div>
  ,
  document.getElementById('main'));
