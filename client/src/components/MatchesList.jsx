import { useContext, useState } from "react";
import TeamAndMatchContext from "../context/TeamAndMatchContext.jsx";
import API from "../utils/api";

export default function MatchesList() {

    const { teams, matches, setMatches } = useContext(TeamAndMatchContext);

    const [team1_id, setTeam1_id] = useState("");
    const [team2_id, setTeam2_id] = useState("");

    const handleStartMatch = async (e) => {
        e.preventDefault();

        if (!team1_id || !team2_id) {
            alert("Select both teams");
            return;
        }

        try {
            await API.post("/matches", {
                team1_id,
                team2_id,
            });

            const response = await API.get("/matches");
            setMatches(response.data);

            // Refreshing the select fields to default value
            setTeam1_id("");
            setTeam2_id("");
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };


    // Handles score increment and decrement
    const handleUpdateGoal = async (matchId, teamNumber, isIncrement) => {
        try {
            if (isIncrement) {
                // Use PUT to /goal
                await API.put(`/matches/${matchId}/goal`, { team: teamNumber });
            } else {
                const confirmed = window.confirm("Are you sure?");
                console.log("confirmed:", confirmed);

                if (!confirmed) {
                    return;
                }

                // Use PUT to /decrement
                await API.put(`/matches/${matchId}/decrement`, { team: teamNumber });
            }

            const response = await API.get("/matches");
            setMatches(response.data);
        } catch (error) {
            console.error("Error updating goal:", error.message);

            // 400 error if score is already 0.
            if (error.response.status === 400) {
                alert("Cannot decrement score below zero.");
            }
        }
    };


    // Handles locking/finishing the match
    const handleFinishMatch = async (matchId) => {
        try {
            // Use PUT to /finish
            await API.put(`/matches/${matchId}/finish`);
            const response = await API.get("/matches");
            setMatches(response.data);
        } catch (error) {
            console.error("Error finishing match:", error.response?.data?.error || error.message);
        }
    };

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
            {/* Display matches */}
            <ul>
                {matches.filter(match => !match.matchFinishFlag).map((match) => {
                    return <li key={match.id}>
                        <p>
                            {match.team1.name} - {match.team2.name}
                        </p>
                        <p>
                            {match.team1_score} - {match.team2_score}
                        </p>

                        {match.matchFinishFlag && (
                            <p>
                                {/* Winner logic */}
                                {match.team1_score > match.team2_score
                                    ? `${match.team1.name} wins!`
                                    : match.team2_score > match.team1_score
                                        ? `${match.team2.name} wins!`
                                        : "Draw"}
                            </p>
                        )}
                    </li>
                })}
            </ul>

            {/* Match Start Form */}
            <form onSubmit={handleStartMatch}>
                <select
                    value={team1_id}
                    onChange={(e) => setTeam1_id(e.target.value)}
                >
                    <option value="">Select</option>
                    {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                            {team.name}
                        </option>
                    ))}
                </select>

                <select
                    value={team2_id}
                    onChange={(e) => setTeam2_id(e.target.value)}
                >
                    <option value="">Select</option>
                    {teams.map((team) => {
                        if (team._id === team1_id) return null;

                        return (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        );
                    })}
                </select>
                <button type="submit">Create Match</button>
            </form>

            {/* Update matches */}
            {matches.filter(match => !match.matchFinishFlag).map((match) => (
                <li key={match.id} style={{ marginBottom: "15px" }}>
                    <p>
                        {match.team1.name} ({match.team1_score}) vs {match.team2.name} ({match.team2_score})
                    </p>

                    {/* Only show goal controls if the match is active */}
                    {!match.matchFinishFlag ? (
                        <div>
                            <span>{match.team1.name} goals: </span>
                            <button onClick={() => handleUpdateGoal(match.id, "1", true)}>+</button>
                            <button onClick={() => handleUpdateGoal(match.id, "1", false)}>-</button>

                            <br />

                            <span>{match.team2.name} goals: </span>
                            <button onClick={() => handleUpdateGoal(match.id, "2", true)}>+</button>
                            <button onClick={() => handleUpdateGoal(match.id, "2", false)}>-</button>

                            <br /><br />

                            <button onClick={() => handleFinishMatch(match.id)}>Finish Match</button>
                        </div>
                    ) : (
                        <p>
                            <strong>Match Finished! </strong>
                            {match.team1_score > match.team2_score
                                ? `${match.team1.name} wins!`
                                : match.team2_score > match.team1_score
                                    ? `${match.team2.name} wins!`
                                    : "Draw"}
                        </p>
                    )}

                    {/* Delete button (available for all matches) */}
                    <button onClick={() => handleDeleteMatch(match.id)} style={{ color: "red" }}>
                        Delete Match Record
                    </button>
                </li>
            ))}
        </>
    );
}
