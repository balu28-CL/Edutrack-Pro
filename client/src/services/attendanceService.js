import API from "./api";

export const getAttendance = async () => {
    const response = await API.get("/attendance");
    return response.data;
};

export const addAttendance = async (attendanceData) => {
    const response = await API.post(
        "/attendance",
        attendanceData
    );

    return response.data;
};

export const updateAttendance = async (id, attendanceData) => {
    const response = await API.put(
        `/attendance/${id}`,
        attendanceData
    );

    return response.data;
};

export const deleteAttendance = async (id) => {
    const response = await API.delete(
        `/attendance/${id}`
    );

    return response.data;
};