import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuthGuard from "./security/AuthGuard";
import RoleGuard from "./security/RoleGuard";
import { AuthProvider } from "./security/authProvider/AuthProvider";
import { ThemeProvider } from "./layouts/themeProvider/ThemeProvider";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
      
              <Route path="/dashboard" element={<AuthGuard><Dashboard/></AuthGuard>} />

              <Route path="/admin/dashboard" element={<RoleGuard allowedRoles={["ROLE_ADMIN", "ROLE_SUPERADMIN"]}><AdminDashboard /></RoleGuard>} />

              <Route path="*" element={<Navigate to="/dashboard" />} />

            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
