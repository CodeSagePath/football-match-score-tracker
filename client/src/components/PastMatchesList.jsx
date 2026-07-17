import { useContext } from "react";
import TeamAndMatchContext from "../context/TeamAndMatchContext.jsx";
import API from "../utils/api.js";

export default function PastMatchesList() {

    const { matches, setMatches } = useContext(TeamAndMatchContext);

    // Function to delete the match
    const handleDeleteMatch = async (matchId) => {
        try {
            await API.delete(`/matches/${matchId}`);
            const updatedMatches = await API.get(`/matches`);
            setMatches(updatedMatches.data);
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
