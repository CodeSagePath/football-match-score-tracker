import { useContext } from "react";
import TeamAndMatchContext from "../context/TeamAndMatchContext.jsx";
import API from "../utils/api";

import StartMatchForm from "./MatchComponent/StartMatchForm.jsx";
import ActiveMatchCard from "./MatchComponent/ActiveMatchCard.jsx";

export default function MatchesList() {

    const { matches, setMatches } = useContext(TeamAndMatchContext);

    // Handles score increment and decrement
    const handleUpdateGoal = async (matchId, teamNumber, isIncrement) => {

        const match = matches.find(match => match.id === matchId);

        try {
            if (isIncrement) {
                // Use PUT to /goal
                const response = await API.put(`/matches/${matchId}/goal`, { team: teamNumber });

                // Updating the state with the new response
                const updatedList = [...matches];
                const index = updatedList.findIndex(match => match.id === matchId);

                updatedList[index] = response.data;

                setMatches(updatedList);
            } else {
                const confirmed = window.confirm("Are you sure?");
                console.log("confirmed:", confirmed);

                if (!confirmed) {
                    return;
                }

                // If goal is already Zero, don't even call the API
                if ((teamNumber === "1" && match.team1_score === 0) || (teamNumber === "2" && match.team2_score === 0)) {
                    alert(`Cannot decrement ${teamNumber === "1" ? match.team1.name : match.team2.name}'s score below zero.`);
                    return;
                }

                // Use PUT to /decrement
                const response = await API.put(`/matches/${matchId}/decrement`, { team: teamNumber });

                // Updating the state with the new response
                const updatedList = [...matches];
                const index = updatedList.findIndex(match => match.id === matchId);

                updatedList[index] = response.data;

                setMatches(updatedList);
            }
        } catch (error) {
            console.error("Error updating goal:", error.message);

        }
    };


    // Handles locking/finishing the match
    const handleFinishMatch = async (matchId) => {
        try {
            // Use PUT to /finish
            const response = await API.put(`/matches/${matchId}/finish`);

            // Updating the state with the new response
            const updatedList = [...matches];
            const index = updatedList.findIndex(match => match.id === matchId);

            updatedList[index] = response.data;

            setMatches(updatedList);
        } catch (error) {
            console.error("Error finishing match:", error.response?.data?.error || error.message);
        }
    };

    // Handles deleting a match
    const handleDeleteMatch = async (matchId) => {
        try {
            // Use DELETE to /matches
            await API.delete(`/matches/${matchId}`);
            const response = await API.get("/matches");
            setMatches(response.data);
        } catch (error) {
            console.error("Error deleting match:", error.message);
        }
    };

    return (
        <>
            <h2>Matches List</h2>
            <ul>
                {/* Update matches */}
                {matches.filter(match => !match.matchFinishFlag).map((match) => (
                    <ActiveMatchCard
                        handleUpdateGoal={handleUpdateGoal}
                        handleFinishMatch={handleFinishMatch}
                        handleDeleteMatch={handleDeleteMatch}
                        key={match.id}
                        match={match}
                    />
                ))}
            </ul>
            <StartMatchForm />

        </>
    );
}
