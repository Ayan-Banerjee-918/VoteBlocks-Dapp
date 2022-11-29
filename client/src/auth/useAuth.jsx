import {React,useState,createContext,useContext} from "react";

const authContext = createContext();

const useAuth=()=>{
    const [authedAdmin, setAuthedAdmin] = useState(false)
    const [authedUser, setAuthedUser] = useState(false)
    const [admin,setAdmin]=useState({name:""})
    const [adminAddress,setAddressAdmin]=useState("")
    const [user,setUser]=useState({name:""})
    const [userAddress,setAddressUser]=useState("")
    const [role,setRole]=useState(false)
    return {
        user,
        userAddress,
        admin,
        adminAddress,
        authedAdmin,
        authedUser,
        role,
        setRole,
        setUser,
        setAddressUser,
        setAdmin,
        setAddressAdmin,
        loginAdmin(address) {
            return new Promise((res) => {
                setAuthedAdmin(true);
                setAddressAdmin(address);
                res();
            });
        },
        logoutAdmin() {
            return new Promise((res) => {
                setAuthedAdmin(false);
                setAddressAdmin("");
                res();
            });
        },
        loginUser(address) {
            return new Promise((res) => {
                setAuthedUser(true);
                setAddressUser(address);
                res();
            });
        },
        logoutUser() {
            return new Promise((res) => {
                setAuthedUser(false);
                setAddressUser("");
                res();
            });
        },
        clear(){
            return new Promise((res)=>{
                setUser({name:""})
                setAddressUser("")
                res()
            });
        }
    };
}

export function AuthProvider({ children }) {
  const auth = useAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return useContext(authContext);
}