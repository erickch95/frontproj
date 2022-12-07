//Helper que ayuda a controlar las operaciones REST

import { useAuthStore } from "@/stores";
export const fetchWrapper = {
  get: request("GET"),
  post: request("POST"),
  patch: request("PATCH"),
  put: request("PUT"),
  delete: request("DELETE"),
};

function request(method) {
  return async (url, body) => {
    const requestOptions = {
      method,
      headers: authHeader(url),
    };
    if (body) {
      if (body.documento) {
        const newBody = new FormData();
        for (const name in body) {
          newBody.append(name, body[name]);
        }
        requestOptions.body = newBody;
        console.log("docum", newBody);
      } else {
        requestOptions.headers["Content-Type"] = "application/json";
        requestOptions.body = JSON.stringify(body);
      }
    }
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  };
}
function authHeader(url) {
  //Pregunta y retorna "auth" header con JWT, si el usuario esta logeado.
  const { user } = useAuthStore();
  const isLoggedIn = !!user?.token;
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
}

async function handleResponse(response) {
  const isJson = response.headers
    ?.get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  //Manejo de errores
  if (!response.ok) {
    const { user, logout } = useAuthStore();
    if ([401, 403].includes(response.status) && user) {
      //Ciere de sesion automatico en caso de respuesta con codigo 401 Unauthorized o 403 Forbidden
      alert("Sesion caducada o no tiene permisos, ingrese nuevamente.");
      logout();
    }
    //Verifica si el error tiene mensaje propio, caso contrario lo pone el por defecto
    const error = (data && data.message) || response.status;
    return Promise.reject(error);
  }
  console.log("FETCH", data);
  return data;
}
