import { useContext, useState } from "react";
import MatchesContext from "../context/TeamContext.jsx";
import API from "../utils/api";

export default function MatchesList() {

    const { teams, matches, setMatches } = useContext(MatchesContext);

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

    return (

        <>
            <h2>Matches List</h2>
            <ul>
                {matches.map((match, index) => {
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
        </>
    );
}