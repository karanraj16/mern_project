import { createContext, useState, useEffect } from "react";
import { useNavigate  } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [token, setToken] = useState(localStorage.getItem("token") || null );

  // load from localStorage on refresh
  useEffect(() => {
    if (token) localStorage.setItem("token",token);
      else localStorage.removeItem("token");
    if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
  }, [token,user]);

  const login = (userObj, jwt) => {
    setUser(userObj);
    setToken(jwt);
    localStorage.setItem("userName", userObj?.name || userObj?.username || "User");
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("userName");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


