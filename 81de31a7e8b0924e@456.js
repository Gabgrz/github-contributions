// https://observablehq.com/@gabgrz/github-contributions@456
import define1 from "./454ad0dd9994db8d@539.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# GitHub contributions

This chart shows daily contributions in 2019 by the given GitHub username.

Type in the username in the cell below.`
)});
  main.variable(observer("githubUser")).define("githubUser", function(){return(
'fabpot'
)});
  main.variable(observer("viewof weekday")).define("viewof weekday", ["html"], function(html){return(
html`<select>
<option value=sunday>Sunday-based weeks
<option value=monday>Monday-based weeks
</select>`
)});
  main.variable(observer("weekday")).define("weekday", ["Generators", "viewof weekday"], (G, _) => G.input(_));
  main.variable(observer("contributionsLegend")).define("contributionsLegend", ["legend","color"], function(legend,color){return(
legend({
  color: color,
  title: "GitHub contributions",
  tickFormat: ".0f"
})
)});
  main.variable(observer("chart")).define("chart", ["d3","data","width","height","cellSize","weekday","countDay","formatDay","timeWeek","color","formatDate","format","pathMonth","formatMonth"], function(d3,data,width,height,cellSize,weekday,countDay,formatDay,timeWeek,color,formatDate,format,pathMonth,formatMonth)
{
  const years = d3.nest()
      .key(d => d.date.getUTCFullYear())
    .entries(data)
    .reverse();

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height * years.length])
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

  const year = svg.selectAll("g")
    .data(years)
    .join("g")
      .attr("transform", (d, i) => `translate(40,${height * i + cellSize * 1.5})`);

  year.append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(d => d.key);

  year.append("g")
      .attr("text-anchor", "end")
    .selectAll("text")
    .data((weekday === "weekday" ? d3.range(2, 7) : d3.range(7)).map(i => new Date(1995, 0, i)))
    .join("text")
      .attr("x", -5)
      .attr("y", d => (countDay(d) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay);

  year.append("g")
    .selectAll("rect")
    .data(d => d.values)
    .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
      .attr("y", d => countDay(d.date) * cellSize + 0.5)
      .attr("fill", d => color(d.value))
    .append("title")
      .text(d => `${formatDate(d.date)}: ${format(d.value)} contributions`);

  const month = year.append("g")
    .selectAll("g")
    .data(d => d3.utcMonths(d3.utcMonth(d.values[0].date), d.values[d.values.length - 1].date))
    .join("g");

  month.filter((d, i) => i).append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("d", pathMonth);

  month.append("text")
      .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
      .attr("y", -5)
      .text(formatMonth);

  return svg.node();
}
);
  main.variable(observer("cellSize")).define("cellSize", function(){return(
17
)});
  main.variable(observer("width")).define("width", function(){return(
954
)});
  main.variable(observer("height")).define("height", ["cellSize","weekday"], function(cellSize,weekday){return(
cellSize * (weekday === "weekday" ? 7 : 9)
)});
  main.variable(observer("timeWeek")).define("timeWeek", ["weekday","d3"], function(weekday,d3){return(
weekday === "sunday" ? d3.utcSunday : d3.utcMonday
)});
  main.variable(observer("countDay")).define("countDay", ["weekday"], function(weekday){return(
weekday === "sunday" ? d => d.getUTCDay() : d => (d.getUTCDay() + 6) % 7
)});
  main.variable(observer("pathMonth")).define("pathMonth", ["weekday","countDay","timeWeek","d3","cellSize"], function(weekday,countDay,timeWeek,d3,cellSize){return(
function pathMonth(t) {
  const n = weekday === "weekday" ? 5 : 7;
  const d = Math.max(0, Math.min(n, countDay(t)));
  const w = timeWeek.count(d3.utcYear(t), t);
  return `${d === 0 ? `M${w * cellSize},0`
      : d === n ? `M${(w + 1) * cellSize},0`
      : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${n * cellSize}`;
}
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format("")
)});
  main.variable(observer("formatDate")).define("formatDate", ["d3"], function(d3){return(
d3.utcFormat("%x")
)});
  main.variable(observer("formatDay")).define("formatDay", function(){return(
d => "SMTWTFS"[d.getUTCDay()]
)});
  main.variable(observer("formatMonth")).define("formatMonth", ["d3"], function(d3){return(
d3.utcFormat("%b")
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data)
{
  const max = d3.quantile(data.map(d => Math.abs(d.value)).sort(d3.ascending), 0.995);
  return d3.scaleQuantize([0, max], d3.schemeBlues[9]);
}
);
  main.variable(observer("data")).define("data", ["githubUser"], function(githubUser){return(
fetch(`https://github-contributions-api.now.sh/v1/`+githubUser+`?format=nested`)
          .then(
              response => {
                  return response.json();
              })
          .then(response => {
              let allDays = [];
              for (let yearIndex in response.contributions){
                  if(yearIndex < 2019){
                      let year = Object.assign({},response.contributions[yearIndex]);Object.assign(year,response.contributions.contributions[2019]);
                  for (let monthIndex in year){

                      let month = year[monthIndex];
                      
                      for (let day in month){
                          month[day].date = new Date(month[day].date);
                          month[day].value = month[day].count;
                          if(day < 32){
                              allDays.push(month[day]);
                          }
                      }
                  }
              }
              }
              return allDays;
          })
          .catch(
              error => console.log(error))
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  return main;
}
