import { useContext } from "react";
import TeamAndMatchContext from "../context/TeamAndMatchContext.jsx";
import { deleteMatch } from "../services/matchService.js";

export default function PastMatchesList() {

    const { matches, setMatches } = useContext(TeamAndMatchContext);

    // Function to delete the match
    const handleDeleteMatch = async (matchId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this match?");
        if (!confirmDelete) {
            return;
        }

        try {
            await deleteMatch(matchId);

            // Remove the match from the local state
            const updatedMatches = matches.filter(match => match.id !== matchId);
            setMatches(updatedMatches);
        } catch (error) {
            console.error("Error deleting match:", error.message);
        }
    };

    // Helper function to determine the winner of a match
    const handleGetWinner = (match) => {
        if (match.team1_score > match.team2_score) {
            return `${match.team1.name} WON!!!!`;
        } else if (match.team2_score > match.team1_score) {
            return `${match.team2.name} WON!!!!`;
        } else {
            return "IT'S A DRAW!!!!";
        }
    };

    return (
        <>
            <h2> Past Matches</h2>
            <ul>
                {matches.filter((match) => match.matchFinishFlag)
                    .map((match) => {
                        return <li key={match.id}>
                            <h4>
                                {match.team1.name} vs {match.team2.name}
                            </h4>

                            <h4>
                                {match.team1_score} - {match.team2_score}
                            </h4>

                            {/* Logic to determine who won */}
                            <h4>
                                {handleGetWinner(match)}
                            </h4>
                            <button onClick={() => handleDeleteMatch(match.id)}>Delete Match</button>
                        </li>
                    })}
            </ul>
        </>
    );
}
