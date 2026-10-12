import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { TicketDashboardPage } from "./pages/TicketDashboardPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="/tickets" element={<TicketDashboardPage />} />
          <Route path="/create" element={<TicketDashboardPage />} />
          <Route path="/stats" element={<TicketDashboardPage />} />
          <Route path="*" element={<Navigate to="/tickets" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;