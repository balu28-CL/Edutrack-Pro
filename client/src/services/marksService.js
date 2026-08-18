import API from "./api";

export const getMarks = async () => {
    const response = await API.get("/marks");
    return response.data;
};

export const addMarks = async (data) => {
    const response = await API.post("/marks", data);
    return response.data;
};

export const updateMarks = async (id, data) => {
    const response = await API.put(
        `/marks/${id}`,
        data
    );

    return response.data;
};

export const deleteMarks = async (id) => {
    const response = await API.delete(
        `/marks/${id}`
    );

    return response.data;
};