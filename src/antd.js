import React from "react";
import ReactDOM from "react-dom/client";
import { Button } from "antd";
import { jsx as _jsx } from "react/jsx-runtime";
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(/* @__PURE__ */ _jsx(React.StrictMode, { children: /* @__PURE__ */ _jsx(Button, {
	variant: "text",
	children: "Text"
}) }));