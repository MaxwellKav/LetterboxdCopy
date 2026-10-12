import { createBrowserRouter, useOutletContext, type RouteObject } from "react-router"
import App from "./App";
import Reviewform from "./Review-form";
import Viewreviews from "./Review-list";


const routerConfig: RouteObject[] = [
  {
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/review",
        Component: Reviewform,
      },
      {
        path: "/list",
        Component: Viewreviews,
      },
      {
        path: "*",
        Component: PageNotFound        
      },
    ],
  },
];

function Home() {
  return (
    <div className="md:w-3xl">
      <header>
        <h1>Välkommen till shitterBox</h1>
        <div>
          Här kan du recensera och läsa dina tidigare recensioner.
        </div>
      </header>
    </div>
  );
}

function PageNotFound() {
  return <h2>Sidan kunde inte hittas</h2>;
}



const router = createBrowserRouter(routerConfig)

export default router;