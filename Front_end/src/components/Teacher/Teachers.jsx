import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import Nav from "../Home/Nav.jsx";
import TeacherList from "./TeacherList";

export default function Teachers() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const student = user?.student || null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav student={student} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <TeacherList />
      </main>
    </div>
  );
}
