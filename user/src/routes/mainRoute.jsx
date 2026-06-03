import { Routes, Route } from "react-router-dom";
import UserLayout from "../layout/userLayout";
import Home from "../pages/user/home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/login";
import ProtectedRoute from "./protected.route.jsx";
import ManageLibrary from "../pages/user/manage.library.jsx";
import ManageStudent from "../pages/user/add.student.jsx";
import CreateSeatPage from "../pages/user/create.seat.page.jsx";
import SeatManagement from "../pages/user/seat.management.jsx";
import Plan from "../pages/user/plan.jsx";
import FeaturesManagement from "../pages/user/features.jsx";

const MainRoutes = () => {
  return (
    <Routes>
      {/* Protected Routes (Requires Authentication) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/libraries" element={<ManageLibrary />} />
          <Route path="/students" element={<ManageStudent />} />
          <Route path="/bookings" element={<SeatManagement />} />
          <Route path="/sheets" element={<CreateSeatPage />} />
          <Route path="/plans" element={<Plan />} />
          <Route path="/features" element={<FeaturesManagement />} />
        </Route>
      </Route>

      {/* --- Auth Routes (No Navbar) --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default MainRoutes;
