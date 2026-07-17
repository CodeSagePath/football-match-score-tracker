// Component just to render active matches (pure presentational component) - React Pattern

export default function ActiveMatchCard({
    handleUpdateGoal,
    handleFinishMatch,
    handleDeleteMatch,
    match,
}) {
    return (
        <>

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
        </>
    );
}