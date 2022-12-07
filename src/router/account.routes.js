//Definimos rutas hacia las vistas para el login
import { Layout, Login } from "@/views";
export default {
  path: "/account",
  component: Layout,
  children: [
    { path: "", redirect: "login" },
    { path: "login", component: Login },
  ],
};
