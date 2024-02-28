import {AxiosError, AxiosInstance} from "axios";
import {
    AxiosCacheInstance,
    CacheAxiosResponse,
    CacheRequestConfig,
    setupCache
} from "axios-cache-interceptor";

/**
 * Possible API methods to be used when doing requests
 */
export enum RequestMethod {
    Delete = "DELETE",
    Get = "GET",
    Patch = "PATCH",
    Post = "POST",
    Put = "PUT"
}

export interface RequestData {
    headers?: Record<string, string>;
    data?: object;
    config?: CacheRequestConfig;
}

export interface InternalRequest extends RequestData {
    fullRoute: RouteLike;
    method: RequestMethod;
}

export interface InternalResponse {
    success: boolean;
    data: any;
    request: any;
}

export type RouteLike = `${string}`;

export class RestClient {
    private readonly axiosInstance: AxiosCacheInstance;

    public constructor(axios: AxiosInstance) {
        this.axiosInstance = setupCache(axios);
    }

    /**
     * Runs a get request from the api
     *
     * @param fullRoute - The full route to query
     * @param options - Optional request options
     */
    public async get(fullRoute: RouteLike, options: RequestData = {}) {
        return this.request({...options, fullRoute, method: RequestMethod.Get});
    }

    /**
     * Runs a delete request from the api
     *
     * @param fullRoute - The full route to query
     * @param options - Optional request options
     */
    public async delete(fullRoute: RouteLike, options: RequestData = {}) {
        return this.request({
            ...options,
            fullRoute,
            method: RequestMethod.Delete
        });
    }

    /**
     * Runs a post request from the api
     *
     * @param fullRoute - The full route to query
     * @param options - Optional request options
     */
    public async post(fullRoute: RouteLike, options: RequestData = {}) {
        return this.request({
            ...options,
            fullRoute,
            method: RequestMethod.Post
        });
    }

    /**
     * Runs a put request from the api
     *
     * @param fullRoute - The full route to query
     * @param options - Optional request options
     */
    public async put(fullRoute: RouteLike, options: RequestData = {}) {
        return this.request({...options, fullRoute, method: RequestMethod.Put});
    }

    /**
     * Runs a patch request from the api
     *
     * @param fullRoute - The full route to query
     * @param options - Optional request options
     */
    public async patch(fullRoute: RouteLike, options: RequestData = {}) {
        return this.request({
            ...options,
            fullRoute,
            method: RequestMethod.Patch
        });
    }

    /**
     * Runs a request from the api
     *
     * @param options - Request options
     */
    public async request(options: InternalRequest): Promise<InternalResponse> {
        let request: CacheAxiosResponse;
        try {
            request = await this.raw(options);
        } catch (err: any) {
            const error = err as AxiosError;
            if (error.response) {
                // console.error(`Unable to make a ${options.method.toString()} request to ${options.fullRoute.toString()}: ${error.response.data}`, err)
                return {
                    success: false,
                    data: error.response.data,
                    request: request
                };
            }
            // console.error(`Unable to make a ${options.method.toString()} request to ${options.fullRoute.toString()}: ${error.message}`, err)
            return {success: false, data: error.message, request: request};
        }
        // console.log(`Request to ${options.fullRoute} was cached:`, request.cached)
        return {success: true, data: request.data, request: request};
    }

    /**
     * Runs a request from the API, yielding the raw Response object
     *
     * @param options - Request options
     */
    async raw(options: InternalRequest) {
        const config: CacheRequestConfig = {
            ...options.config,
            url: options.fullRoute,
            method: options.method
        };

        config.headers = options.headers;

        if (options.method == RequestMethod.Post) config.data = options.data;
        else
            config.params = {
                ...((config.params as object) || {}),
                ...options.data
            };

        return await this.axiosInstance.request(config);
    }
}
