import {makeRedirectUri} from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import {supabase} from "../../../database/supabase";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

export const createSessionFromUrl = async (url: string) => {
    const {params, errorCode} = QueryParams.getQueryParams(url);

    if (errorCode) throw new Error(errorCode);
    const {access_token, refresh_token} = params;

    if (!access_token) return;

    const {data, error} = await supabase.auth.setSession({
        access_token,
        refresh_token
    });
    if (error) throw error;
    return data.session;
};

export const performOAuth = async (
    provider: "google" | "apple"
): Promise<boolean> => {
    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo,
            skipBrowserRedirect: true
        }
    });

    if (error) throw error;

    // TODO Use backend URL instead, then have it redirect so the supabase url is hidden.
    const res = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo
    );

    if (res.type === "success") {
        const {url} = res;
        await createSessionFromUrl(url);
        return true;
    }
    return false;
};

export const sendMagicLink = async (email: string) => {
    const {error} = await supabase.auth.signInWithOtp({
        email: email,
        options: {
            emailRedirectTo: redirectTo
        }
    });

    if (error) throw error;
    // Email sent.
};
