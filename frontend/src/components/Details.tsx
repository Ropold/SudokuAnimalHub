import {useState} from "react";
import {AnimalModel, DefaultAnimal} from "./model/AnimalModel.ts";
import {DefaultUserDetails, UserDetails} from "./model/UserDetailsModel.ts";

export default function Details() {
    const [animal, setAnimal] = useState<AnimalModel>(DefaultAnimal);
    const [githubUser, setGithubUser] = useState<UserDetails>(DefaultUserDetails);

    return(
        <h3>Details</h3>
    )
}