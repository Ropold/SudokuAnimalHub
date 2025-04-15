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
import {AnimalModel} from "./components/model/AnimalModel.ts";


export default function App() {

    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [activeAnimals, setActiveAnimals] = useState<AnimalModel[]>([]);
    const [activeTab, setActiveTab] = useState<"profile" | "add" | "my-animals" | "favorites">("profile");

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
        getActiveAnimals();
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser"){
            getUserDetails();
        }
    }, [user]);

    function handleNewAnimalSubmit(newAnimal: AnimalModel) {
        setActiveAnimals((prevAnimals) => [...prevAnimals, newAnimal]);
    }

    function getActiveAnimals() {
        axios
            .get("/api/sudoku-animal-hub/active")
            .then((response) => {
                setActiveAnimals(response.data);
            })
            .catch((error) => {
                console.error("Error fetching active animals: ", error);
            });
    }

  return (
    <>
        <Navbar getUser={getUser} getUserDetails={getUserDetails} user={user} setActiveTab={setActiveTab}/>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Welcome/>}/>
                <Route path="/play" element={<Play/>}/>
                <Route path="/list-of-all-animals" element={<ListOfAllAnimals activeAnimals={activeAnimals}/>}/>
                <Route path="/animal/:id" element={<Details/>}/>
                <Route path="/high-score" element={<HighScore/>}/>
                <Route path="/deck" element={<Deck/>}/>

                <Route element={<ProtectedRoute user={user} />}>
                    <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails} handleNewAnimalSubmit={handleNewAnimalSubmit} activeTab={activeTab} setActiveTab={setActiveTab}/>} />
                </Route>

            </Routes>
        <Footer/>
    </>
  )
}

