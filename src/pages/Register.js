import { useState,useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import { useNavigate ,Link } from "react-router-dom";

const Register =() => {

    const [ username,setName ] = useState("");
    const [ email,setEmail] = useState("");
    const [ password,setPassword] = useState("");
    const [ loading,setLoading ] = useState(false);
    const [ err,setErr] = useState("");

    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try{
            const res = await API.post("/auth/register", { username ,email,password});
            console.log("register response:",res.data);
            login(res.data.user,res.data.token);
            navigate("/dashboard");
        }catch(errs){
            console.error("Register failed: ", errs);
            setErr(errs.response?.data?.message || "Registration failed ");
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                create your account
            </h2>

        {err && (
          <div className="mb-3 text-sm text-red-700 bg-red-100 border border-red-200 p-2 rounded">
            {err}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
            <input 
            type="text"
            className="w-full p-3 rounded-lg border border-gray-200 bg-white/70 outline-none" 
            placeholder="Full name"
            value={username}
            onChange={(e) => setName(e.target.value)}
            required
            name="name"
            />
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
            placeholder="Password (min 6 chars)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            name="password"
          />
          <button 
          type="submit"
          disabled={loading}
          className="">
            { loading ? "creating account ...." : " create account "}
          </button> 
        </form>
              <div className="mt-4 text-center text-sm text-gray-700">
                Already have an account?{" "}
               <Link to="/login" className="text-blue-600 hover:underline">
                 Login
               </Link>
              </div>
            </div>
        </div>
    );
}

export default Register;