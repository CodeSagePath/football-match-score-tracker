import { useContext } from "react";
import TeamAndMatchContext from "../context/TeamAndMatchContext.jsx";
import { incrementGoal, decrementGoal, finishMatch, deleteMatch } from "../services/matchService.js";

import StartMatchForm from "./MatchComponent/StartMatchForm.jsx";
import ActiveMatchCard from "./MatchComponent/ActiveMatchCard.jsx";

export default function MatchesList() {

    const { matches, setMatches } = useContext(TeamAndMatchContext);

    // Handles score increment and decrement
    const handleUpdateGoal = async (matchId, teamNumber, isIncrement) => {

        const match = matches.find(match => match.id === matchId);

        try {
            if (isIncrement) {
                const updatedMatch = await incrementGoal(matchId, teamNumber);

                // Updating the state with the new response
                const updatedList = [...matches];
                const index = updatedList.findIndex(match => match.id === matchId);

                updatedList[index] = updatedMatch;

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

                const updatedMatch = await decrementGoal(matchId, teamNumber);

                // Updating the state with the new response
                const updatedList = [...matches];
                const index = updatedList.findIndex(match => match.id === matchId);

                updatedList[index] = updatedMatch;

                setMatches(updatedList);
            }
        } catch (error) {
            console.error("Error updating goal:", error.message);

        }
    };


    // Handles locking/finishing the match
    const handleFinishMatch = async (matchId) => {
        // Ask user confirmation
        const confirmed = window.confirm("Are you sure?");
        if (!confirmed) {
            return;
        }
        
        try {
            const finishedMatch = await finishMatch(matchId);

            // Updating the state with the new response
            const updatedList = [...matches];
            const index = updatedList.findIndex(match => match.id === matchId);

            updatedList[index] = finishedMatch;

            setMatches(updatedList);
        } catch (error) {
            console.error("Error finishing match:", error.response?.data?.error || error.message);
        }
    };

    // Handles deleting a match
    const handleDeleteMatch = async (matchId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this match?");
        if (!confirmDelete) return;

        try {
            await deleteMatch(matchId);
            
            // Remove the match from the local state
            const updatedMatches = matches.filter(match => match.id !== matchId);
            setMatches(updatedMatches);
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
