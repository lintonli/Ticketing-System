import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TicketDashboardPage } from "./pages/TicketDashboardPage.tsx";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <TicketDashboardPage />
    </>
  );
}

export default App;