// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

import { AbortSignal } from "./AbortController";
import { AbortError, HttpError, TimeoutError } from "./Errors";
import { ILogger, LogLevel } from "./ILogger";

export type ResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text";

/** Represents an HTTP request. */
export interface HttpRequest {
    /** The HTTP method to use for the request. */
    method?: string;

    /** The URL for the request. */
    url?: string;

    /** The body content for the request. May be a string or an ArrayBuffer (for binary data). */
    content?: string | ArrayBuffer;

    /** An object describing headers to apply to the request. */
    headers?: { [key: string]: string };

    /** The ResponseType to apply to the request. */
    responseType?: ResponseType;

    /** An AbortSignal that can be monitored for cancellation. */
    abortSignal?: AbortSignal;

    /** The time to wait for the request to complete before throwing a TimeoutError. Measured in milliseconds. */
    timeout?: number;
}

/** Represents an HTTP response. */
export class HttpResponse {
    /** Constructs a new instance of {@link HttpResponse} with the specified status code.
     *
     * @param {number} statusCode The status code of the response.
     */
    constructor(statusCode: number);

    /** Constructs a new instance of {@link HttpResponse} with the specified status code and message.
     *
     * @param {number} statusCode The status code of the response.
     * @param {string} statusText The status message of the response.
     */
    constructor(statusCode: number, statusText: string);

    /** Constructs a new instance of {@link HttpResponse} with the specified status code, message and string content.
     *
     * @param {number} statusCode The status code of the response.
     * @param {string} statusText The status message of the response.
     * @param {string} content The content of the response.
     */
    constructor(statusCode: number, statusText: string, content: string);

    /** Constructs a new instance of {@link HttpResponse} with the specified status code, message and binary content.
     *
     * @param {number} statusCode The status code of the response.
     * @param {string} statusText The status message of the response.
     * @param {ArrayBuffer} content The content of the response.
     */
    constructor(statusCode: number, statusText: string, content: ArrayBuffer);
    constructor(
        public readonly statusCode: number,
        public readonly statusText?: string,
        public readonly content?: string | ArrayBuffer) {
    }
}

/** Abstraction over an HTTP client.
 *
 * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
 */
export abstract class HttpClient {
    /** Gets a value indicating if this HttpClient supports binary messages */
    public get supportsBinary(): boolean {
        return true;
    }

    /** Issues an HTTP GET request to the specified URL, returning a Promise that resolves with an {@link HttpResponse} representing the result.
     *
     * @param {string} url The URL for the request.
     * @returns {Promise<HttpResponse>} A Promise that resolves with an {@link HttpResponse} describing the response, or rejects with an Error indicating a failure.
     */
    public get(url: string): Promise<HttpResponse>;

    /** Issues an HTTP GET request to the specified URL, returning a Promise that resolves with an {@link HttpResponse} representing the result.
     *
     * @param {string} url The URL for the request.
     * @param {HttpRequest} options Additional options to configure the request. The 'url' field in this object will be overridden by the url parameter.
     * @returns {Promise<HttpResponse>} A Promise that resolves with an {@link HttpResponse} describing the response, or rejects with an Error indicating a failure.
     */
    public get(url: string, options: HttpRequest): Promise<HttpResponse>;
    public get(url: string, options?: HttpRequest): Promise<HttpResponse> {
        return this.send({
            ...options,
            method: "GET",
            url,
        });
    }

    /** Issues an HTTP POST request to the specified URL, returning a Promise that resolves with an {@link HttpResponse} representing the result.
     *
     * @param {string} url The URL for the request.
     * @returns {Promise<HttpResponse>} A Promise that resolves with an {@link HttpResponse} describing the response, or rejects with an Error indicating a failure.
     */
    public post(url: string): Promise<HttpResponse>;

    /** Issues an HTTP POST request to the specified URL, returning a Promise that resolves with an {@link HttpResponse} representing the result.
     *
     * @param {string} url The URL for the request.
     * @param {HttpRequest} options Additional options to configure the request. The 'url' field in this object will be overridden by the url parameter.
     * @returns {Promise<HttpResponse>} A Promise that resolves with an {@link HttpResponse} describing the response, or rejects with an Error indicating a failure.
     */
    public post(url: string, options: HttpRequest): Promise<HttpResponse>;
    public post(url: string, options?: HttpRequest): Promise<HttpResponse> {
        return this.send({
            ...options,
            method: "POST",
            url,
        });
    }

    /** Issues an HTTP DELETE request to the specified URL, returning a Promise that resolves with an {@link HttpResponse} representing the result.
     *
     * @param {string} url The URL for the request.
     * @returns {Promise<HttpResponse>} A Promise that resolves with an {@link HttpResponse} describing the response, or rejects with an Error indicating a failure.
     */
    public delete(url: string): Promise<HttpResponse>;

    /** Issues an HTTP DELETE request to the specified URL, returning a Promise that resolves with an {@link HttpResponse} representing the result.
     *
     * @param {string} url The URL for the request.
     * @param {HttpRequest} options Additional options to configure the request. The 'url' field in this object will be overridden by the url parameter.
     * @returns {Promise<HttpResponse>} A Promise that resolves with an {@link HttpResponse} describing the response, or rejects with an Error indicating a failure.
     */
    public delete(url: string, options: HttpRequest): Promise<HttpResponse>;
    public delete(url: string, options?: HttpRequest): Promise<HttpResponse> {
        return this.send({
            ...options,
            method: "DELETE",
            url,
        });
    }

    /** Issues an HTTP request to the specified URL, returning a {@link Promise} that resolves with an {@link HttpResponse} representing the result.
     *
     * @param {HttpRequest} request An {@link HttpRequest} describing the request to send.
     * @returns {Promise<HttpResponse>} A Promise that resolves with an HttpResponse describing the response, or rejects with an Error indicating a failure.
     */
    public abstract send(request: HttpRequest): Promise<HttpResponse>;
}
