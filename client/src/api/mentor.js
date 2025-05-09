import API from "./index";

export const signIn = (fields) =>
    API.post("/mentor/login", fields).catch((error) => {
        return error.response;
    });

export const signUp = (fields) =>
    API.post("/mentor/signup", fields).catch((error) => {
        return error.response;
    });

export const fetchMentor = () =>
    API.get("/mentor/dashboard").catch((error) => {
        return error.response;
    });

export const getAllMentees = () =>
    API.get(`/mentor/getAllMentees`).catch((error) => {
        return error.response;
    });

export const getAllMenteeYears = (menteeId) =>
    API.get(`/mentor/getYears/${menteeId}`).catch((error) => {
        return error.response;
    });

export const getProfile = () =>
    API.get(`/mentor/profile`).catch((error) => {
        return error.response;
    });

export const updateProfile = (data) =>
    API.post(`/mentor/profile`, data).catch((error) => {
        return error.response;
    });

export const updateMentorProfilePicutre = (avatar) =>
    API.post("/avatar", avatar).catch((error) => {
        return error.response;
    });

export const autoPairMentorsAndAssignMentees = () =>
    API.post("/mentor/auto-pair").catch((error) => {
        return error.response;
    });
