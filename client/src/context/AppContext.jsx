import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();


export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || "VND";
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();

    // State variables
    const [isOwner, setIsOwner] = useState(false)
    const [showHotelReg, setShowHotelReg] = useState(false)
    const [searchedCities, setSearchedCities] = useState([]) // store maximum 3 cities name

    const fetchUser = async () => {
        try {
            const { data } = await axios.get(
                "/api/user", 
                { headers: {Authorization: `Bearer ${await getToken()}`} }
            );

            if (data.success) {
                setIsOwner(data.role === "hotelOwner");
                setSearchedCities(data.recentSearchedCities)
            } else {
                // Retry fetching user details after 5 seconds
                setTimeout(() => {
                    fetchUser()
                }, 5000)
            };

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Execute fetchUser function by using useEffect
    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user])

    // Object variable
    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner, setIsOwner,
        axios,
        showHotelReg, setShowHotelReg,
        searchedCities, setSearchedCities,
    }

    return (
        <AppContext.Provider value={ value }>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);
