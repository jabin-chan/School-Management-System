import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import Nav from "./Nav";

import GreetingBanner from "./GreetingBanner";
import StatsRow from "./StatsRow";
import ContinueLearning from "./ContinueLearning";
import RecentNotices from "./RecentNotices";
import UpcomingEvents from "./UpcomingEvents";

export default function Dashboard() {
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

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <GreetingBanner studentName={student?.name} />
        <StatsRow />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <ContinueLearning />
          </div>

          {/* Right sidebar - 1 column */}
          <div className="space-y-6">
            <RecentNotices />
            <UpcomingEvents />
          </div>
        </div>
      </main>
    </div>
  );
}
