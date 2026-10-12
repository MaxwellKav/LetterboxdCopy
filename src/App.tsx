import { useState } from 'react'
import { Reviews } from './reviews'
import './App.css'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Link, Outlet } from "react-router";

function App() {
  const [reviews, setReviews] = useState(() => new Reviews());

    return (
    <div className="grid max-w-5xl grid-rows-1 gap-4">
      <h1 className="text-center text-3xl font-bold">shitterBox</h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/" />}>Hem</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/create-review" />}>
              Skriv recension
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/Review-list" />}>
              Mina recensioner
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet/>
    </div>
  )
}

export default App
