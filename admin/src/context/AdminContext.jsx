import { useState } from "react";
import { createContext } from "react";

export const AdminContext = createContext();
const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
  const backendUrl = import.meta.env.BACKEND_URL|| "http://localhost:7000"
  const value = {
    aToken,setAToken,backendUrl
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
