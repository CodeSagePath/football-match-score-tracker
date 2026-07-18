import { useContext, useState } from "react";
import TeamAndMatchContext from "../../context/TeamAndMatchContext.jsx";
import { createMatch } from "../../services/matchService.js";

export default function StartMatchForm() {

    const { teams, matches, setMatches } = useContext(TeamAndMatchContext);

    const [team1_id, setTeam1_id] = useState("");
    const [team2_id, setTeam2_id] = useState("");

    const checkAdminAccess = localStorage.getItem("ADMIN_KEY") ? true : false;

    // Helper function to check if there is an existing match
    const checkExistingMatch = () => {
        const existingMatch = matches.find(
            (match) =>
                !match.matchFinishFlag &&
                (match.team1?.id === team1_id ||
                    match.team1?.id === team2_id ||
                    match.team2?.id === team1_id ||
                    match.team2?.id === team2_id)
        );

        if (existingMatch) {
            return true;
        }
        return false;
    };

    // Handles starting a match
    const handleStartMatch = async (e) => {
        e.preventDefault();

        if (!team1_id || !team2_id) {
            alert("Select both teams");
            return;
        }

        const existingMatch = checkExistingMatch();

        if (existingMatch) {
            alert("One or both selected teams are already in an active match.");
            return;
        }

        try {
            const addedMatchData = await createMatch(team1_id, team2_id);

            // Update local state directly with the newly created match if not already added by socket
            setMatches((prevMatches) => {
                if (prevMatches.some((match) => match.id === addedMatchData.id)) {
                    return prevMatches;
                }
                return [...prevMatches, addedMatchData];
            });

            // Refreshing the select fields to default value
            setTeam1_id("");
            setTeam2_id("");
        } catch (error) {
            alert(error.response?.data?.error || error.message);
            console.log(error.response?.data || error.message);
        }
    };

    return (
        <>
            {/* Match Start Form */}
            {checkAdminAccess && <form onSubmit={handleStartMatch}>
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
                        if (team._id === team1_id) {
                            return null;
                        }

                        return (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        );
                    })}
                </select>
                <button type="submit">Create Match</button>
            </form>
            }
        </>
    );
}