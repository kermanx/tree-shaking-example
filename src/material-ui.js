import { Paper } from "@mui/material";
import React from "react";
import ReactDOMServer from 'react-dom/server';

export const answer = ReactDOMServer.renderToString(
	React.createElement(Paper, null, "Hello")
);
