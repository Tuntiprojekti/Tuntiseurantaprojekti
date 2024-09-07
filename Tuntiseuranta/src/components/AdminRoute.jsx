// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
    const { currentUser, isAdmin } = useAuth();

    if (!currentUser || !isAdmin) {
        return <Navigate to="/register" />;
    }

    return children;
};

export default AdminRoute;
