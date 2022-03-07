import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

function getPermissions(jwt: string): string[] {
  return JSON.parse(atob(jwt.split(".")[1])).permissions;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isAuthenticated } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then((data) => {
      const permissions = getPermissions(data);
      setPermissions(permissions);
      setIsAdmin(permissions.includes("reimagine:admin"));
    });
  }, [getAccessTokenSilently, isAuthenticated]);

  if (!isAuthenticated) {
    return { permissions, isAdmin };
  }

  return { permissions, isAdmin };
}
