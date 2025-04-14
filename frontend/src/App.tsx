import './App.css'
import Welcome from "./components/Welcome.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import axios from "axios";
import {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import NotFound from "./components/NotFound.tsx";
import {UserDetails} from "./components/model/UserDetailsModel.ts";
import Profile from "./components/Profile.tsx";
import Play from "./components/Play.tsx";
import ListOfAllAnimals from "./components/ListOfAllAnimals.tsx";
import Details from "./components/Details.tsx";
import HighScore from "./components/HighScore.tsx";
import Deck from "./components/Deck.tsx";
import Favorites from "./components/Favorites.tsx";
import MyAnimals from "./components/MyAnimals.tsx";
import AddAnimalCard from "./components/AddAnimalCard.tsx";


export default function App() {

    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    // User functions
    function getUser() {
        axios.get("/api/users/me")
            .then((response) => {
                setUser(response.data.toString());
            })
            .catch((error) => {
                console.error(error);
                setUser("anonymousUser");
            });
    }

    function getUserDetails() {
        axios.get("/api/users/me/details")
            .then((response) => {
                setUserDetails(response.data as UserDetails);
            })
            .catch((error) => {
                console.error(error);
                setUserDetails(null);
            });
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser"){
            getUserDetails();
        }
    }, [user]);

  return (
    <>
        <Navbar getUser={getUser} getUserDetails={getUserDetails} user={user}/>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Welcome/>}/>
                <Route path="/play" element={<Play/>}/>
                <Route path="/list-of-all-animals" element={<ListOfAllAnimals/>}/>
                <Route path="/animal/:id" element={<Details/>}/>
                <Route path="/high-score" element={<HighScore/>}/>
                <Route path="/deck" element={<Deck/>}/>

                <Route element={<ProtectedRoute user={user} />}>
                    <Route path="/favorites" element={<Favorites/>}/>
                    <Route path="/my-animals" element={<MyAnimals/>}/>
                    <Route path="/add" element={<AddAnimalCard/>}/>
                    <Route path="/profile" element={<Profile userDetails={userDetails}/>} />
                </Route>
            </Routes>
        <Footer/>
    </>
  )
}

