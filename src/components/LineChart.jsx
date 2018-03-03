import React, {Component} from 'react'
import * as d3 from 'd3'
import axios from 'axios'
import '../css/main.css'

export default class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

componentWillMount() {
  //Store the chart data into state
  let url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
  axios.get(url).then((response)=>{
    this.setState({data: response.data.data});
  }).then(() => {
    this.buildGraph()
  });


}

buildGraph() {
  let monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  let data = this.state.data;

  let margin = {top: 90, right: 20, bottom: 30, left: 50}
  let width  = 800 - margin.left - margin.right
  let height = 500 - margin.top - margin.bottom

  let parseTime = d3.timeParse("%Y-%m-%d");

  let x = d3.scaleTime().range([0, width]);
  let y = d3.scaleLinear().range([height, 0]);
  let length = data.length

  let valueline = d3.line()
                  .x((d)=>{return x(d.date)})
                  .y((d)=>{return y(d.close)});

  let tooltip = d3.select('body')
            .append("div")
            .attr("class",'tooltip')
            .style("opacity","0")
            .style("position","absolute")
            .text("");

  let svg = d3.select(".svg-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function(d) {
    d.date = parseTime(d[0]);
    d.close = +d[1];
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  svg.append("text")
      .attr("x",(width/2))
      .attr("y",0-(margin.top/2))
      .attr("text-anchor","middle")
      .attr("class","title")
      .text("US Gross Domestic Product")

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class","bar")
      .attr("x",function(d) {return x(d.date)})
      .attr("width", Math.ceil(width/length))
      .attr("y",function(d) {return y(d.close)})
      .attr("height",function(d) {return height - y(d.close)})
      .on("mouseover",(d)=>{
      let day = d.date.getDay()
      let month = monthNames[d.date.getMonth()];
      let year = d.date.getFullYear();

        tooltip.transition()
              .duration(300)
              .style("opacity","1");

        tooltip.html(day+"-"+month+"-"+year+" "+ "<br/>"  + d.close)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 45) + "px");

      })
      .on("mouseout",(d)=>{
        tooltip.transition().duration(200).style("opacity","0")
      })


  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
}

render() {
return(<div><div className="svg-chart"></div></div>)
}

}
