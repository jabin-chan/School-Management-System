// App.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import './App.css';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the route changes
    window.scrollTo({ top: 0, behavior: "smooth" }); // smooth scroll
  }, [pathname]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;

