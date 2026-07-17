import React from "react";
import { useState, useEffect } from "react";
import API from "./utils/api.js";

export default function App() {

    const [teams, setTeams] = useState([]);

    // Fetch on component mount
    useEffect(() => {
        // IIFE
        (async () => {
            try {
                const response = await API.get(`/teams`);
                setTeams((prevValue) => response.data);
            } catch (error) {
                console.log(error.message);
            }
        })();
    }, []);

    return (
        <div className="app">
            <h1>Football Match Score Tracker</h1>
            <ul>
                {/* No conditional rendering needed because map method would not work on an empty array. */}
                {teams.map((team) => {
                    return <li key={team._id}>{team.name}</li>
                })}
            </ul>
        </div>
    )
}
