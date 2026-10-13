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
        children: [
          { index: true, Component: Reviewform },       
          { path: ":movieId", Component: Reviewform },  
        ],
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
    <div className="mx-auto md:w-3xl">
      <header>
        <title>Välkommen till shitterBox</title>
        <div>
          <img className="mx-auto" src="./src/assets/shitterBoxd.png"></img>
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
