import { Paper } from "@material-ui/core";
import React from "react";
import ReactDOMServer from 'react-dom/server';

console.log(ReactDOMServer.renderToString(
	React.createElement(Paper, null, "Hello")
));
