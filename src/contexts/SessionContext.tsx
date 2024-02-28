import {AppDispatch} from "@/App";
import {supabase} from "@database/supabase";
import {setLoginStatus} from "@redux_store/user";
import {Session} from "@supabase/supabase-js";
import {supabaseCall} from "@util/apis/supabase/supabase.util";
import {addUserMetadata} from "@util/apis/users/users.api.util";
import React, {createContext, useEffect, useState} from "react";
import {useDispatch} from "react-redux";

type CustomSessionStatus = "loading" | "loaded";

type CustomSession = {
    status: CustomSessionStatus;
    session: Session | null;
    profileId: number;
};

export const SessionContext = createContext<CustomSession | null>(null);

type SessionProviderProps = {
    children: React.ReactNode;
};

export const SessionProvider = ({children}: SessionProviderProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [status, setStatus] = useState<CustomSessionStatus>("loading");
    const [session, setSession] = useState<Session | null>(null);
    const [profileId, setProfileID] = useState<number>();

    //Get the user's session first and set if its successful, update session and login status on state change
    useEffect(() => {
        supabase.auth
            .getSession()
            .then(async ({data: {session}}) => {
                //After session retrieval is successful
                if (session) dispatch(setLoginStatus(true));
                setSession(session);
                setStatus("loaded");
            })
            .catch((err) => {
                dispatch(setLoginStatus(false));
                console.error("Sessionx context error", err);
            });

        supabase.auth.onAuthStateChange(async (_event, session) => {
            if (_event === "SIGNED_IN") {
                dispatch(setLoginStatus(true));
                addUserMetadata(session.user.id);
            }
            setSession(session);
        });
    }, []);

    useEffect(() => {
        if (!session || !session.user) {
            setProfileID(null);
            return;
        }

        supabaseCall("get_profile_id", {input_user_id: session.user.id}).then(
            (profileId) => {
                setProfileID(profileId);
            }
        );
    }, [session]);

    return (
        <SessionContext.Provider
            value={{session: session, profileId: profileId, status: status}}
        >
            {children}
        </SessionContext.Provider>
    );
};
