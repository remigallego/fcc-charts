import React, { Component } from 'react';
import LineChart from './LineChart.jsx'
import ScatteredPlot from './ScatteredPlot.jsx'
// require `react-d3-core` for Chart component, which help us build a blank svg and chart title.
//var Chart = require('react-d3-core').Chart;
// require `react-d3-basic` for Line chart component.
//var LineChart = require('react-d3-basic').LineChart;



export default class Main extends Component {



render() {


  return(
    <div>
            <ScatteredPlot />
      <LineChart />

    </div>
  )
  }
}
