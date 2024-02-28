import axios from "axios";
import {RestClient} from "../rest.util";

/**
 * The Base URL for all user API requests
 */
const BASE_URL = `${process.env.BACKEND_API_URL}/api/email`;

/**
 * The rest client used to execute the API requests
 */
const restClient = new RestClient(
    axios.create({
        baseURL: BASE_URL
    })
);

/**
 * Delete a user's account
 *
 * @param session The user's current session
 */
export const sendWelcomeEmail = async (
    email: string,
    username: string
): Promise<boolean> => {
    const request = await restClient.post("/welcome", {
        data: {
            email: email,
            username: username
        },
        headers: {
            "Content-Type": "application/json"
        }
    });

    return request.data.success;
};

/**
 * Allow a user to send an email to company email
 *
 * @param session The user's current session
 */
export const sendSupportEmail = async (
    email: string,
    subject: string,
    text: string
): Promise<boolean> => {
    const request = await restClient.post("/support", {
        data: {
            email: email,
            subject: subject,
            text: text
        },
        headers: {
            "Content-Type": "application/json"
        }
    });

    return request.data.success;
};
