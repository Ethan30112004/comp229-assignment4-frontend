import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import UsersPage from "./pages/UsersPage";
import ProjectsPage from "./pages/ProjectsPage";
import ServicesPage from "./pages/ServicesPage";
import ContactsPage from "./pages/ContactsPage";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

export default function App() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="app-layout">
        <aside className="sidebar">
          <h2>Portfolio App</h2>

          <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/users">Users</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/contacts">Contacts</NavLink>

            {!token && <NavLink to="/login">Login</NavLink>}
            {!token && <NavLink to="/register">Register</NavLink>}
            {token && <button onClick={handleLogout}>Logout</button>}
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}