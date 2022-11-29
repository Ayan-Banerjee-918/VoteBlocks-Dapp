import { Outlet,Navigate, useLocation } from "react-router-dom"
import AuthConsumer from './useAuth'

const UserLoginAuth = () => {
  const {authedUser}=AuthConsumer()
  const location=useLocation()
  return (
    authedUser?<Outlet/>:
    location.pathname!=="/userApp/unverified"?<Navigate to="../login" state={{from:location}} replace/>:<Navigate to="../login"/>
  )
}

export default UserLoginAuth