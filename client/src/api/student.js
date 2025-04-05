import API from "./index";

export const signIn = (fields) =>
    API.post("/student/login", fields).catch((error) => {
        return error.response;
    });

export const signUp = (fields) =>
    API.post("/student/signup", fields).catch((error) => {
        return error.response;
    });

export const fetchStudent = () =>
    API.get("/student/dashboard").catch((error) => {
        return error.response;
    });

export const fetchStudentProfile = () =>
    API.get("/student/profile").catch((error) => {
        return error.response;
    });

export const updateStudentProfile = (fields) =>
    API.post("/student/profile", fields).catch((error) => {
        return error.response;
    });

export const fetchStudentYearDetails = () =>
    API.get("/student/year").catch((error) => {
        return error.response;
    });

export const addStudentYearDetails = (fields) =>
    API.post("/student/year", fields).catch((error) => {
        return error.response;
    });

export const updateStudentYearDetails = (fields) =>
    API.post("/student/year", fields).catch((error) => {
        return error.response;
    });

export const deleteStudentYearDetails = (fields) =>
    API.post("/student/year/delete", fields).catch((error) => {
        return error.response;
    });

export const updateStudentPastEduDetails = (fields) =>
    API.post("/student/pastEducation", fields).catch((error) => {
        return error.response;
    });

export const getStudentPastEduDetails = () =>
    API.get("/student/pastEducation").catch((error) => {
        return error.response;
    });

export const getStudentsOfMentor = () =>
    API.get("/student/getAllStudentsOfMentor").catch((error) => {
        return error.response;
    });
