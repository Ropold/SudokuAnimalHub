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
import {DefaultNumberToAnimalMap, NumberToAnimalMap} from "./components/model/NumberToAnimalMap.ts";
import SudokuGridDetails from "./components/SudokuGridDetails.tsx";
import {SudokuGridModel} from "./components/model/SudokuGridModel.ts";
import {HighScoreModel} from "./components/model/HighScoreModel.ts";


export default function App() {

    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [activeAnimals, setActiveAnimals] = useState<AnimalModel[]>([]);
    const [allAnimals, setAllAnimals] = useState<AnimalModel[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [tempDeck, setTempDeck] = useState<NumberToAnimalMap>(DefaultNumberToAnimalMap);
    const [savedDeck, setSavedDeck] = useState<NumberToAnimalMap>(DefaultNumberToAnimalMap);
    const [allSudokuGrids, setAllSudokuGrids] = useState<SudokuGridModel[]>([]);
    const [highScoreEasy, setHighScoreEasy] = useState<HighScoreModel[]>([]);
    const [highScoreMedium, setHighScoreMedium] = useState<HighScoreModel[]>([]);
    const [highScoreHard, setHighScoreHard] = useState<HighScoreModel[]>([]);


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
        getAllAnimals();
        getAllSudokuGrids();
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser"){
            getUserDetails();
            getAppUserFavorites();
            getUsersDeck();
        }
    }, [user]);

    function handleNewAnimalSubmit(newAnimal: AnimalModel) {
        setActiveAnimals((prevAnimals) => [...prevAnimals, newAnimal]);
    }

    function handleDeleteSudokuGrid(id: string) {
        setAllSudokuGrids((prevGrids) => prevGrids.filter((grid) => grid.id !== id));
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

    function getAppUserFavorites(){
        axios.get<AnimalModel[]>(`/api/users/favorites`)
            .then((response) => {
                const favoriteIds = response.data.map((animal) => animal.id);
                setFavorites(favoriteIds);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function toggleFavorite(animalId: string) {
        const isFavorite = favorites.includes(animalId);

        if (isFavorite) {
            axios.delete(`/api/users/favorites/${animalId}`)
                .then(() => {
                    setFavorites((prevFavorites) =>
                        prevFavorites.filter((id) => id !== animalId)
                    );
                })
                .catch((error) => console.error(error));
        } else {
            axios.post(`/api/users/favorites/${animalId}`)
                .then(() => {
                    setFavorites((prevFavorites) => [...prevFavorites, animalId]);
                })
                .catch((error) => console.error(error));
        }
    }

    function getAllAnimals() {
        axios
            .get("/api/sudoku-animal-hub")
            .then((response) => {
                setAllAnimals(response.data);
            })
            .catch((error) => {
                console.error("Error fetching all animals: ", error);
            });
    }

    function getUsersDeck() {
        axios
            .get("/api/users/numbers-to-animal")
            .then((response) => {
                setSavedDeck(response.data);
            })
            .catch((error) => {
                console.error("Error fetching numbers to animals: ", error);
            });
    }

    function getAllSudokuGrids() {
        axios
            .get("/api/sudoku-grid")
            .then((response) => {
                setAllSudokuGrids(response.data)
            })
            .catch((error) => {
                console.error("Error fetching all animals: ", error);
            });
    }

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    function getHighScoreEasy() {
        axios
            .get("/api/high-score/EASY")
            .then((response) => {
                setHighScoreEasy(response.data);
            })
            .catch((error) => {
                console.error("Error fetching high score: ", error);
            });
    }

    function getHighScoreMedium() {
        axios
            .get("/api/high-score/MEDIUM")
            .then((response) => {
                setHighScoreMedium(response.data);
            })
            .catch((error) => {
                console.error("Error fetching high score: ", error);
            });
    }

    function getHighScoreHard() {
        axios
            .get("/api/high-score/HARD")
            .then((response) => {
                setHighScoreHard(response.data);
            })
            .catch((error) => {
                console.error("Error fetching high score: ", error);
            });
    }

    return (
    <>
        <Navbar getUser={getUser} getUserDetails={getUserDetails} user={user}/>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Welcome/>}/>
                <Route path="/play" element={<Play user={user} tempDeck={tempDeck} savedDeck={savedDeck} highScoreEasy={highScoreEasy} getHighScoreEasy={getHighScoreEasy} highScoreMedium={highScoreMedium} getHighScoreMedium={getHighScoreMedium} highScoreHard={highScoreHard} getHighScoreHard={getHighScoreHard} allSudokuGrids={allSudokuGrids}/>}/>
                <Route path="/list-of-all-animals" element={<ListOfAllAnimals activeAnimals={activeAnimals} getActiveAnimals={getActiveAnimals} favorites={favorites} toggleFavorite={toggleFavorite} currentPage={currentPage} setCurrentPage={setCurrentPage} user={user}/>}/>
                <Route path="/animal/:id" element={<Details user={user} favorites={favorites} toggleFavorite={toggleFavorite}/>}/>
                <Route path="/high-score" element={<HighScore highScoreEasy={highScoreEasy} getHighScoreEasy={getHighScoreEasy} highScoreMedium={highScoreMedium} getHighScoreMedium={getHighScoreMedium} highScoreHard={highScoreHard} getHighScoreHard={getHighScoreHard}/>}/>
                <Route path="/deck" element={<Deck user={user} activeAnimals={activeAnimals} tempDeck={tempDeck} setTempDeck={setTempDeck} savedDeck={savedDeck} setSavedDeck={setSavedDeck} />}/>

                <Route element={<ProtectedRoute user={user} />}>
                    <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails} handleNewAnimalSubmit={handleNewAnimalSubmit} allAnimals={allAnimals} getAllAnimals={getAllAnimals} setAllAnimals={setAllAnimals} favorites={favorites} toggleFavorite={toggleFavorite} allSudokuGrids={allSudokuGrids} getAllSudokuGrids={getAllSudokuGrids}/>} />
                    <Route path="/sudoku-grid/:id" element={<SudokuGridDetails handleDeleteSudokuGrid={handleDeleteSudokuGrid} getAllSudokuGrids={getAllSudokuGrids}/>}/>
                </Route>

            </Routes>
        <Footer/>
    </>
  )
}

