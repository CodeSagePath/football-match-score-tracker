import { useEffect, useState } from "react";
import TeamContext from "./context/TeamContext.jsx";
import API from "./utils/api.js";

import TeamsList from "./components/TeamsList.jsx";
import MatchesList from "./components/MatchesList.jsx";

import { Routes, Route, Link } from "react-router-dom";

export default function App() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  // Fetch on component mount
  useEffect(() => {
    // IIFE
    (async () => {
      try {
        const response = await API.get(`/teams`);
        setTeams(response.data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);


  useEffect(() => {
    // IIFE
    (
      async () => {
        try {
          const response = await API.get("/matches");
          setMatches(response.data);
        } catch (error) {
          console.log("Error fetching matches: ", error.message);
        }
      }
    )();
  }, []);



  return (
    <div className="app">

      <div>
        <Link to="/">Home</Link>
        <br />
        <Link to="/teams">Teams</Link>
        <br />
        <Link to="/matches">Matches</Link>
      </div>

      <h1>Football Match Score Tracker</h1>

      <TeamContext value={{ teams, setTeams, matches, setMatches }}>
        <Routes>
          <Route path="/" element={
            <h3>Welcome to "Football Match Score Tracker."</h3>
          }></Route>
          <Route path="/teams" element={<TeamsList />} />
          <Route path="/matches" element={<MatchesList />} />
        </Routes>
      </TeamContext>
    </div>
  );
}
