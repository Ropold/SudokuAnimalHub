import {useEffect, useState} from "react";
import {HighScoreModel} from "./model/HighScoreModel.ts";
import axios from "axios";

type HighScoreProps = {
    highScoreEasy: HighScoreModel[];
    getHighScoreEasy: () => void;
    highScoreMedium: HighScoreModel[];
    getHighScoreMedium: () => void;
    highScoreHard: HighScoreModel[];
    getHighScoreHard: () => void;
}

const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(date).toLocaleDateString("de-DE", options);
};

export default function HighScore(props: Readonly<HighScoreProps>) {
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [githubUsernames, setGithubUsernames] = useState<Map<string, string>>(new Map());

    function fetchGithubUsernames(highScores: HighScoreModel[]) {
        const uniqueIds = new Set(
            highScores
                .filter(score => score.githubId !== "anonymousUser")
                .map(score => score.githubId)
        );

        const newUsernames = new Map(githubUsernames);

        uniqueIds.forEach(async (id) => {
            if (!newUsernames.has(id)) {
                axios.get(`https://api.github.com/user/${id}`)
                    .then((response) => {
                        newUsernames.set(id, response.data.login);
                        setGithubUsernames(new Map(newUsernames));
                    })
                    .catch((error) => {
                        console.error(`Error fetching GitHub user ${id}:`, error);
                    });
            }
        });
    }

    useEffect(() => {
        fetchGithubUsernames([...props.highScoreEasy, ...props.highScoreMedium, ...props.highScoreHard]);
    }, [props.highScoreEasy, props.highScoreMedium, props.highScoreHard]);

    useEffect(() => {
        props.getHighScoreEasy();
        props.getHighScoreMedium();
        props.getHighScoreHard();
    }, []);

    const handleTableSelect = (tableId: string) => {
        setSelectedTable(tableId);
    };

    const handleBack = () => {
        setSelectedTable(null);
    };

    return(
        <h3>HighScore</h3>
    )
}