import API from "../utils/api.js";

export const getMatches = async () => {
    const response = await API.get("/matches");
    return response.data;
};

export const createMatch = async (team1_id, team2_id) => {
    const response = await API.post("/matches", {
        team1_id,
        team2_id,
    });
    return response.data;
};

export const incrementGoal = async (matchId, teamNumber) => {
    const response = await API.put(`/matches/${matchId}/goal`, { team: teamNumber });
    return response.data;
};

export const decrementGoal = async (matchId, teamNumber) => {
    const response = await API.put(`/matches/${matchId}/decrement`, { team: teamNumber });
    return response.data;
};

export const finishMatch = async (matchId) => {
    const response = await API.put(`/matches/${matchId}/finish`);
    return response.data;
};

export const deleteMatch = async (matchId) => {
    const response = await API.delete(`/matches/${matchId}`);
    return response.data;
};
