import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, ...rest }) => {
  let auth =
    (localStorage.getItem("Token")?.length > 0) &
    (localStorage.getItem("roles") === "ADMIN" || localStorage.getItem("roles") ===  "SUPER ADMIN");
  return auth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
