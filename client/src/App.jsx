import { useEffect, useState } from "react";
import TeamContext from "./context/TeamAndMatchContext.jsx";
import { getTeams } from "./services/teamService.js";
import { getMatches } from "./services/matchService.js";

import { Routes, Route, Link } from "react-router-dom";

import TeamsList from "./components/TeamsList.jsx";
import MatchesList from "./components/MatchesList.jsx";
import PastMatchesList from "./components/PastMatchesList.jsx";
import ToastList from "./components/ToastList.jsx";

// Establishing socket connection
import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.startsWith("http") ?
  import.meta.env.VITE_API_URL.replace("/api", "") :
  window.location.origin;

const socket = io(socketUrl);


export default function App() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  const [notifications, setNotifications] = useState([]);

  // Loading state to manage the visibility of the initial fetch spinner
  const [isLoading, setIsLoading] = useState(true);

  const addNotification = (message) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

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


  // checking if `ADMIN_KEY` is present in URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("ADMIN_KEY");
    if (key) {
      console.log("ADMIN_KEY is present in URL");
      localStorage.setItem("ADMIN_KEY", key);
    } else {
      console.log("ADMIN_KEY is NOT present in URL");
    }
  }, []);

  
  // Setting up socket event listeners
  useEffect(() => {
    
    // Listening for new matches
    socket.on("matchCreated", (matchData) => {
      setMatches((prevMatches) => [...prevMatches, matchData]);
      addNotification(`Match Started: ${matchData.team1.name} vs ${matchData.team2.name}`);
    });

    // Listening for score changes (increments, decrements, resets)
    socket.on("goalScored", (updatedMatchData) => {
      setMatches((prevMatches) => prevMatches.map((match) => match.id === updatedMatchData.id ? updatedMatchData : match));
      addNotification(`Goal! ${updatedMatchData.team1.name} ${updatedMatchData.team1_score} - ${updatedMatchData.team2_score} ${updatedMatchData.team2.name}`);
    });

    // Listening for match finished status
    socket.on("matchFinished", (updatedMatchData) => {
      setMatches((prevMatches) => prevMatches.map((match) => match.id === updatedMatchData.id ? updatedMatchData : match));
      addNotification(`Match Finished: ${updatedMatchData.team1.name} ${updatedMatchData.team1_score} - ${updatedMatchData.team2_score} ${updatedMatchData.team2.name}`);
    });

    // Listening for match deletions
    socket.on("matchDeleted", (matchId) => {
      setMatches((prevMatches) => {
        const deletedMatch = prevMatches.find((m) => m.id === matchId);
        if (deletedMatch) {
          addNotification(`Match Deleted: ${deletedMatch.team1.name} vs ${deletedMatch.team2.name}`);
        }
        return prevMatches.filter((match) => match.id !== matchId);
      });
    });

    return () => {
      // Clean up the socket event listeners
      socket.off("matchCreated");
      socket.off("goalScored");
      socket.off("matchFinished");
      socket.off("matchDeleted");
    };
  }, []);

  return (
    <div className="app">
      {/* Toast Notifications Container */}
      <ToastList notifications={notifications} />

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
