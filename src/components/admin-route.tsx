import { Route } from "react-router-dom";

import { usePermissions } from "../hooks/use-permissions";

function AdminRoute({ children, ...restOfProps }: any) {
  const { isAdmin } = usePermissions();

  return isAdmin ? (
    <Route {...restOfProps}>{children}</Route>
  ) : (
    <div>You must be an Admin to see this page...</div>
  );
}

export default AdminRoute;
