import React, {Component} from 'react'
import * as d3 from 'd3'
import axios from 'axios'
import '../css/main.css'


export default class ScatteredPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.secFormat = this.secFormat.bind(this);
  }

  componentWillMount() {
    //Store the chart data into state
    let url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
    axios.get(url).then((response)=>{
      this.setState({data: response.data});
    }).then(() => {
      this.buildGraph()
    });
  }



  buildGraph() {
    let w = 550
    let h = 500
    let padding = 20

    const dataset = this.state.data
    console.log(dataset);

    let bestTime = d3.min(dataset, (d) => d.Seconds);
    let parseTime = d3.timeParse("%M:%S");

    dataset.forEach((d)=>{
      d.behind = d.Seconds - bestTime
      console.log(d.behind);
    })


    let tooltip = d3.select('.svg-scatteredplot')
              .append("div")
              .attr("class",'tooltip')
              .style("opacity","0")
              .style("position","absolute")
              .text("");

    let countryCode = {
      'GER' : 'de',
      'ITA' : 'it',
      'FRA' : 'fr',
      'USA' : 'us',
      'ESP' : 'es',
      'DEN' : 'dk',
      'POR' : 'pt',
      'COL' : 'co',
      'RUS' : 'ru',
      'SUI' : 'ch',
      'UKR' : 'ua'


}
    let flag = function(d) {return `<span class="flag-icon flag-icon-${countryCode[d.Nationality]}"></span>`};

    let tooltipContent = function(d) {
      let time = d.Time
      let place = d.Place
      let name = d.Name
      let year = d.Year
      let nationality = countryCode[d.Nationality]
      let doping = d.Doping
      let url = d.URL
      return `${time} - ${name} <br> ${flag(d)} - ${year}`
    }

    let formatMinutes = function(d) {
    var t = new Date(2012, 0, 1, 0, d)
    t.setSeconds(t.getSeconds() + d);
    return parseTime(t);
  };

    let xScale = d3.scaleLinear()
                   .domain([d3.min(dataset, (d) => d.behind),d3.max(dataset, (d) => d.behind)+30])
                   .range([w - padding*4, 0]);
    let yScale = d3.scaleLinear()
                   .domain([d3.min(dataset, (d) => d.Place),d3.max(dataset, (d) => d.Place)+1])
                   .range([0, h]);
    const svg = d3.select(".svg-scatteredplot")
                  .append("svg")
                  .attr("width",w + padding*2)
                  .attr("height",h + padding*2)
                  .append("g")
                  .attr("transform",
                        "translate(" + 30 + "," + padding + ")");

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class","circle")
        .attr("cx",(d)=>xScale(d.behind))
        .attr("cy",(d)=>yScale(d.Place))
        .attr("r",3)
        .attr("fill",(d) => {
          console.log(d.Doping);
          if(d.Doping.length > 0)
            return "steelblue"
          else
            return "lightgreen"
          }
      )
    .on("mouseover", (d) => {
      console.log(d.formatted)
      tooltip.style("left", d3.event.pageX + "px")
             .style("top", d3.event.pageY + 15 + "px")
             .html(tooltipContent(d))

      tooltip.transition().duration(200).style("opacity","0.9")
    })
    .on("mouseout", (d)=> {
      tooltip.transition().duration(200).style("opacity","0")
    })


    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .html((d) => {return d.Name})
        .attr("class","name")
        .attr("x",(d)=>{d.x = xScale(d.behind)+ 5; return d.x})
        .attr("y",(d)=>yScale(d.Place) + 5)

    let body = d3.select('body');

    svg.selectAll('foreignObject')
        .data(dataset)
        .enter()
        .append('foreignObject')
        .attr("x",(d)=>d.x+d.Name.length*4.4)
        .attr("y",(d)=>yScale(d.Place)-2)
        .attr('width', '10px')
        .attr('height','10px')
        .html((d)=>flag(d))
        .attr("class",'flag-div')


    // ---------------  LEGEND
    svg.append("circle")
        .attr("cx",w-w/3-10)
        .attr("cy",h-h/3-5)
        .attr("r",3)
        .style("fill","lightgreen")

    svg.append("circle")
        .attr("cx",w-w/3-10)
        .attr("cy",h-h/3-5+20)
        .attr("r",3)
        .style("fill","steelblue")

    svg.append("text")
       .attr("x",w-w/3)
       .attr("y",h-h/3)
       .attr("class","legend")
       .style("font-size","12px")
       .text("No doping allegations")

     svg.append("text")
        .attr("x",w-w/3)
        .attr("y",h-h/3+20)
        .attr("class","legend")
         .style("font-size","12px")
        .text("Doping allegations")

    svg.append("text")
        .attr("x",(w/2-w/5))
        .attr("y",padding)
        .attr("text-anchor","middle")
        .attr("class","title")
        .style("font-size","20px")
        .text("35 Fastest times up Alpe d'Huez")


    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(xScale)
              .tickFormat((d) => {
                return this.secFormat(d)
              }))
    svg.append("g")
        .call(d3.axisLeft(yScale));
  }

  secFormat(seconds) {
    let min = Math.floor(+seconds/60)
    if(min < 10)
      min = "0" + min;
    let sec = +seconds%60;
    if(sec < 10)
      sec = "0" + sec;
    return min+":"+sec
  }

  render() {
    return(
      <div><div className="svg-scatteredplot"></div></div>
    )
  }
}
