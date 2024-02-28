import {SessionContext} from "@contexts/SessionContext";
import {useContext} from "react";

/**
 * Custom hook to get supabase session instance
 */
export const useSession = () => {
    return useContext(SessionContext);
};
