import { createBrowserRouter, type RouteObject } from "react-router";
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
        path: "/create-review",
        Component: Reviewform,
      },
      {
        path: "/Review-list",
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
        <h2 className="text-2xl font-bold">Välkommen till shitterBox</h2>
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
