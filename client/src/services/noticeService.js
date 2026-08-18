import API from "./api";

export const getNotices = async () => {

    const response = await API.get("/notices");

    return response.data;

};

export const addNotice = async (data) => {

    const response = await API.post("/notices", data);

    return response.data;

};

export const updateNotice = async (id, data) => {

    const response = await API.put(
        `/notices/${id}`,
        data
    );

    return response.data;

};

export const deleteNotice = async (id) => {

    const response = await API.delete(
        `/notices/${id}`
    );

    return response.data;

};