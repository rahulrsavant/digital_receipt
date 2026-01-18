import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AdminProjectsList from "./pages/AdminProjectsList";
import AdminProjectForm from "./pages/AdminProjectForm";
import AdminReceiptsList from "./pages/AdminReceiptsList";
import AdminReceiptForm from "./pages/AdminReceiptForm";
import AdminReceiptView from "./pages/AdminReceiptView";
import PublicReceiptView from "./pages/PublicReceiptView";
import NotFound from "./pages/NotFound";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <nav className="nav">
        <div className="brand">Digital Receipt</div>
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/admin/projects">Projects</NavLink>
          <NavLink to="/admin/receipts">Receipts</NavLink>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/projects" element={<AdminProjectsList />} />
          <Route path="/admin/projects/new" element={<AdminProjectForm />} />
          <Route path="/admin/projects/:id/edit" element={<AdminProjectForm />} />
          <Route path="/admin/receipts" element={<AdminReceiptsList />} />
          <Route path="/admin/receipts/new" element={<AdminReceiptForm />} />
          <Route path="/admin/receipts/:id" element={<AdminReceiptView />} />
          <Route path="/r/:projectCode/:receiptId" element={<PublicReceiptView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
