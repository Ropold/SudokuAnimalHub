import './App.css'
import Welcome from "./components/Welcome.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import axios from "axios";
import {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import NotFound from "./components/NotFound.tsx";

export default function App() {

    const [user, setUser] = useState<string>("anonymousUser");

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

    useEffect(() => {
        getUser();
    }, []);

  return (
    <>
        <Navbar/>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Welcome/>}/>

                <Route element={<ProtectedRoute user={user} />}>

                </Route>
            </Routes>
        <Footer/>
    </>
  )
}

