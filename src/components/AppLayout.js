import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AppLayout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    return(
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Sidebar />
            <div className="flex flex-col flex-1 md:ml-56">
                <Navbar onLogout={handleLogout} />
                <main className="p-5">
                    {children}
                </main>
            </div>
        </div>
    )
};

export default AppLayout;