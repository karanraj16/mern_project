import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, User } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/boards", label: "Boards", icon: <ClipboardList size={18} /> },
    { to: "/profile", label: "Profile", icon: <User size={18} /> },
  ];

  return (
    <aside className="bg-gray-900 text-gray-100 w-60 min-h-screen p-4">
      <h2 className="text-lg font-semibold mb-6 text-blue-400">Menu</h2>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                location.pathname === link.to
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;