import { useState,useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import { useNavigate,Link } from "react-router-dom";

const Login = () => {
    const [email,setEmail] =useState("");
    const [password,setPassword] = useState("");
    const [loading ,setLoading] = useState(false);
    const [err, setErr] = useState("");

    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try{
            const res = await API.post("/auth/login", {email,password});
            login(res.data.user,res.data.token);
            navigate("/dashboard");
        }catch(errs){
            console.error("login error:",errs)
            setErr(errs.response?.data?.message || "Login failed ");
        }finally{
            setLoading(false);
        }
    };

    return(
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
          <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome back
            </h2>

        {err && (
          <div className="mb-3 text-sm text-red-700 bg-red-100 border border-red-200 p-2 rounded">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full p-3 rounded-lg border border-gray-200 bg-white/70 outline-none"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            name="email"
          />

          <input
            className="w-full p-3 rounded-lg border border-gray-200 bg-white/70 outline-none"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            name="password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:scale-[1.01] transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-700">
          New here?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}


export default Login;