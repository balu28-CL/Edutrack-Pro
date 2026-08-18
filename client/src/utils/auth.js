export const getCurrentUser = () => {

    const user = sessionStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        return null;
    }
};


export const getUserRole = () => {

    const user = getCurrentUser();

    return user?.role || null;
};


export const isAdmin = () => {

    return getUserRole() === "admin";

};


export const isFaculty = () => {

    return getUserRole() === "faculty";

};


export const isStudent = () => {

    return getUserRole() === "student";

};