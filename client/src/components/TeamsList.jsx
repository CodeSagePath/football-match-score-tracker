import { useState, useRef, useContext } from "react";
import TeamAndMatchContext from "../context/TeamAndMatchContext.jsx";
import { createTeam, deleteTeam } from "../services/teamService.js";

export default function TeamsList() {

    const teamInputRef = useRef(null);
    const { teams, setTeams } = useContext(TeamAndMatchContext);

    const handleAddTeam = async (event) => {
        event.preventDefault();

        const teamName = teamInputRef.current.value; // Get the value from the input field

        // If input is empty, display in alert window
        if(!teamName) {
            alert("Please enter a team name.");
            return;
        }

        // Add the team to the database
        try {
            const addedTeamData = await createTeam(teamName);

            // Add the team to the state
            setTeams((teams) => [...teams, addedTeamData]);
            teamInputRef.current.value = ""; // Clear the input field after successful addition

        } catch (error) {
            console.log("Error adding team: ", error.message);
        }
    };

    const handleDeleteTeam = async (teamId) => {
        // Ask for user confirmation
        const userResponse = confirm("Are you sure you want to delete this team?");

        // If user cancels, do not delete the team
        if(!userResponse) {
            return;
        }

        // Delete the team from the database
        try {
            await deleteTeam(teamId);

            // Remove the team from the state
            const updatedTeam = teams.filter(team => team._id !== teamId);
            setTeams(updatedTeam);

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
