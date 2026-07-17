import { useEffect, useState } from "react";
import TeamContext from "./context/TeamAndMatchContext.jsx";
import { getTeams } from "./services/teamService.js";
import { getMatches } from "./services/matchService.js";

import { Routes, Route, Link } from "react-router-dom";

import TeamsList from "./components/TeamsList.jsx";
import MatchesList from "./components/MatchesList.jsx";
import PastMatchesList from "./components/PastMatchesList.jsx";

export default function App() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  
  // Loading state to manage the visibility of the initial fetch spinner
  const [isLoading, setIsLoading] = useState(true);

  // Fetch on component mount
  useEffect(() => {
    (async () => {
      try {
        const [teamsData, matchesData] = await Promise.all([
          getTeams(),
          getMatches()
        ]);

        setTeams(teamsData);
        setMatches(matchesData);
      } catch (error) {
        console.log("Error fetching data: ", error.message);
      } finally {
        // The finally block runs whether the API calls succeed or fail.
        // This ensures the loader turns off once the operations finish.
        setIsLoading(false);
      }
    })();
  }, []);


  return (
    <div className="app">

      <div>
        <Link to="/">Home</Link>
        <br />
        <Link to="/teams">Teams</Link>
        <br />
        <Link to="/matches">Matches</Link>
        <br />
        <Link to="/past-matches">Past Matches</Link>
      </div>

      <h1>Football Match Score Tracker</h1>

      {/* Conditionally render the spinner container if loading is active */}
      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="loader-text">Loading...</p>
        </div>
      ) : (
        <TeamContext value={{ teams, setTeams, matches, setMatches }}>
          <Routes>
            <Route path="/" element={
              <h3>Welcome to "Football Match Score Tracker."</h3>
            } />
            <Route path="/teams" element={<TeamsList />} />
            <Route path="/matches" element={<MatchesList />} />
            <Route path="/past-matches" element={<PastMatchesList />} />
          </Routes>
        </TeamContext>
      )}
    </div>
  );
}
