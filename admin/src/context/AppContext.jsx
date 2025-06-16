import { createContext } from "react";
import dayjs from 'dayjs'
export const AppContext = createContext();
const AppContextProvider = (props) => {
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // If birthday hasn't occurred yet this year, subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };
  
  const formatDate = (dateStr) => {
    const formatted = dateStr.split("_").reverse().join("-");
    return dayjs(formatted).format("DD MMM YYYY");
  };
  const value = {
    calculateAge,
    formatDate,
  
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
