//Importamos las rutas de /router
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore, useAlertStore } from "@/stores";
import { Home, EditProfile } from "@/views";
import accountRoutes from "./account.routes";
import usersRoutes from "./users.routes";
import conminatoriasRoutes from "./conminatorias.routes";
import regularRoutes from "./regular.routes";
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: [
    { path: "/", component: Home },
    { path: "/profile", component: EditProfile },
    { ...accountRoutes },
    { ...usersRoutes },
    { ...conminatoriasRoutes },
    { ...regularRoutes },
    //Redireccion hacia la pagina home
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});
router.beforeEach(async (to) => {
  //Vaciamos el estado de la alerta en el cambio de ruta
  const alertStore = useAlertStore();
  alertStore.clear();
  //Redireccionamos al login, en caso de entrar directamente a una ruta
  const publicPages = ["/account/login"];
  const authRequired = !publicPages.includes(to.path);
  console.log("auth", authRequired);
  console.log("publo", publicPages);
  const authStore = useAuthStore();

  if (authRequired && !authStore.user) {
    authStore.returnUrl = to.fullPath;
    alert("Inicie Sesion");
    return "/account/login";
  }
});
