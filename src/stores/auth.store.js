//Definimos el store utilizado por pinia para la autenticacion
import { defineStore } from "pinia";
import { fetchWrapper } from "@/helpers";
import { router } from "@/router";
import { useAlertStore } from "@/stores";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;
export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    //Iniciamos el estado del usuario en el local storage para seguir logueado
    user: JSON.parse(localStorage.getItem("user")),
    returnUrl: null,
  }),
  actions: {
    async login(cedula, clave) {
      try {
        const user = await fetchWrapper.post(`${baseUrl}/login`, {
          cedula,
          clave,
        });

        //Actualizamos el estado de pinia
        console.log("pinia auth", user);
        this.user = user;

        //Almacenamos el JWT y los datos en caso de refrescar la pagina
        localStorage.setItem("user", JSON.stringify(user));

        //Redireccionamos a la pagina home en caso de autenticacion correcta
        router.push("/");
      } catch (error) {
        const alertStore = useAlertStore();
        alertStore.error(error);
      }
    },
    //Eliminamos la informacion del local storage en caso de logout
    logout() {
      console.log("pinia logout", this.user);
      this.user = null;
      localStorage.clear();
      router.push("/account/login");
      console.log("pinia logout", this.user);
    },
  },
});
