import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { Reviews } from './reviews'
import './App.css'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Outlet } from "react-router";

function App() {
  const [reviews, setReviews] = useState(() => new Reviews());
  const [count, setCount] = useState(0)

    return (
    <div className="grid max-w-5xl grid-rows-1 gap-4">
      <h1 className="text-center text-3xl font-bold">Min egen salladsbar</h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/">Hem</Link>} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/compose-salad">Skapa sallad</Link>} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/view-cart">Varukorgen</Link>} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet/>
    </div>
  )
}

export default App
