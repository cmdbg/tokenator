import { AuthConfig } from "./auth.config";

export type AuthConfigFactory = () => AuthConfig;
export type TokenEndpointFactory = () => string;
