import { useEffect, useState } from "react";
import { Reviews } from './reviews'
import './App.css'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Outlet } from "react-router";
import type { Movie, Review } from "./types";
import { Link } from 'react-router';





const defaultReviews: Record<string, Review> = {
  Inception: {
    movie: {
      id: 27205,
      title: "Inception",
      overview:
        "A thief who steals secrets from people's dreams is offered a chance to have his record wiped clean if he can plant an idea in someone's mind instead.",
      release_date: "2010-07-15",
      poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      vote_average: 8.4,
    },
    description: "Mind-bending and beautifully made. The ending still gets me.",
    rating: 9,
    favorite: true,
  },
  Interstellar: {
    movie: {
      id: 157336,
      title: "Interstellar",
      overview:
        "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
      release_date: "2014-11-05",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      vote_average: 8.5,
    },
    description: "Great visuals and soundtrack, but a bit long in the middle.",
    rating: 7,
    favorite: false,
  },
};


function readReviews(): Reviews {
  try {
    const saved = localStorage.getItem("reviews");
    if (saved) {
      return new Reviews(JSON.parse(saved));
    }
  } catch {
  }
  return new Reviews(defaultReviews);
}

function App() {

  const [reviews, setReviews] = useState<Reviews>(readReviews);

    useEffect(() => {
      localStorage.setItem("reviews", JSON.stringify(reviews.reviews));
    }, [reviews]);

  function updateReview(review: Review) {
    setReviews(prev => prev.add(review.movie.title, review));
  }

  function removeReview(review: Review) {
    setReviews(prev => prev.remove(review.movie.title));
  }

    return (
    <div className="mx-auto grid max-w-5xl grid-rows-1 gap-4 p-4">
      <h1 className="text-center text-3xl font-bold">shitterBox</h1>
      <NavigationMenu className="mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/" />}>Hem</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/review">Lägg till review</Link>} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/list">Review lista</Link>} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet context={{ reviews, updateReview, removeReview }}/>
    </div>
  )
}

export default App
