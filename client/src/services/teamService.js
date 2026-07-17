import API from "../utils/api.js";

export const getTeams = async () => {
    const response = await API.get("/teams");
    return response.data;
};

export const createTeam = async (name) => {
    const response = await API.post(`/teams`, { name });
    return response.data;
};

export const deleteTeam = async (teamId) => {
    const response = await API.delete(`/teams/${teamId}`);
    return response.data;
};
