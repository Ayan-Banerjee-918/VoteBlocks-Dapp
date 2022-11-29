import { Outlet,Navigate,useLocation } from "react-router-dom"
import AuthConsumer from './useAuth'

const UserValidateAuth = () => {
  const {user}=AuthConsumer()
  const location=useLocation()
  return (
    user.isValidated?
    <Outlet/>:
    <Navigate to="./unverified" state={{from:location}} replace/>
  )
}

export default UserValidateAuth