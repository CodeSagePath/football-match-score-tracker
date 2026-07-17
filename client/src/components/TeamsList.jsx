import { useState, useRef, useContext } from "react";
import TeamContext from "../context/TeamContext.jsx";
import API from "../utils/api.js";

export default function TeamsList() {

    const teamInputRef = useRef(null);
    const { teams, setTeams } = useContext(TeamContext);

    const handleAddTeam = async (event) => {
        event.preventDefault();

        const teamName = teamInputRef.current.value; // Get the value from the input field

        try {
            await API.post(`/teams`, { name: teamName });

            const updatedTeams = await API.get(`/teams`);
            setTeams(updatedTeams.data);
            teamInputRef.current.value = ""; // Clear the input field after successful addition

        } catch (error) {
            console.log("Error adding team: ", error.message);
        }
    };

    const handleDeleteTeam = async (teamId) => {
        try {
            await API.delete(`/teams/${teamId}`);

            const updatedTeams = await API.get(`/teams`);
            setTeams(updatedTeams.data);

        } catch (error) {
            console.log("Error deleting team: ", error.message);
        }
    };

    return (
        <>
            <ul>
                {/* No conditional rendering needed because map method would not work on an empty array. */}
                {teams.map((team) => {
                    return <li key={team._id}>{team.name}

                        <button onClick={() => handleDeleteTeam(team._id)}>Delete</button>
                    </li>
                })}
            </ul>

            <br />
            <br />

            <form onSubmit={handleAddTeam}>
                <input type="text" ref={teamInputRef} placeholder="Add Team Name" />
                <button type="submit">Add Team</button>
            </form>
        </>
    )
}
