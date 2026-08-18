import API from "./api";

export const getFaculty = async () => {
    const response = await API.get("/faculty");
    return response.data;
};

export const addFaculty = async (facultyData) => {
    const response = await API.post("/faculty", facultyData);
    return response.data;
};

export const updateFaculty = async (id, facultyData) => {
    const response = await API.put(
        `/faculty/${id}`,
        facultyData
    );
    return response.data;
};

export const deleteFaculty = async (id) => {
    const response = await API.delete(
        `/faculty/${id}`
    );
    return response.data;
};