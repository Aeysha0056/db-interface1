import React from "react";

const Tabs = React.lazy(() => import("./views/tabs"));
const Sections = React.lazy(() => import("./views/sections"));
const Values = React.lazy(() => import("./views/values"));
const Views = React.lazy(() => import("./views/views"));

const routes = [
  { path: "/tabs", name: "Tabs", component: Tabs },
  { path: "/sections", name: "Sections", component: Sections },
  { path: "/values", name: "Values", component: Values },
  { path: "/views", name: "Views", component: Views }
];

export default routes;
