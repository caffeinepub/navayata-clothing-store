import { useInternetIdentity } from "./hooks/useInternetIdentity";

export interface AuthContextValue {
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  login: () => void;
  logout: () => void;
  principal: string | null;
}

export function useAuth(): AuthContextValue {
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const isLoggedIn = loginStatus === "success" && !!identity;
  // Only show loading during the actual II popup flow, not during initial client setup
  const isLoggingIn = loginStatus === "logging-in";
  const principal = identity?.getPrincipal().toString() ?? null;

  return {
    isLoggedIn,
    isLoggingIn,
    login,
    logout: clear,
    principal,
  };
}
