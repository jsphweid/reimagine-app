import { useLocation, useHistory } from "react-router-dom";

function parsed(params: URLSearchParams) {
  const res: { [key: string]: string } = {};
  for (const [key, value] of params) {
    res[key] = value;
  }
  return res;
}

export function useQueryParams() {
  const location = useLocation();
  const history = useHistory();
  const urlSearchParams = new URLSearchParams(location.search);
  function setParams(obj: { [key: string]: string }) {
    const update = {
      ...parsed(urlSearchParams),
      ...obj,
    };
    history.push({
      pathname: location.pathname,
      search: "?" + new URLSearchParams(update).toString(),
    });
  }

  return { setParams, params: new URLSearchParams(useLocation().search) };
}
