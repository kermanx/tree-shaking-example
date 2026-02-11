import { select, scaleLinear } from "d3";

const scale = scaleLinear().domain([0, 100]).range([0, 500]);

console.log('Scale output:', scale(50));

select('body').text('D3 Chart');

console.log('Selection created', document.body.innerHTML);
