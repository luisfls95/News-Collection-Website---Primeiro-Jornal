import { useAuth } from "../firebase";
import { Outlet, Route, Routes } from "react-router-dom";
import Login from "./Login";

function ProtectedRoutes() {
  const utilizador = useAuth();
  return (
    <>
      {utilizador ? (
        <Outlet />
      ) : (
        <Routes>
          <Route index element={<Login />} />
        </Routes>
      )}
    </>
  );
}

export default ProtectedRoutes;
