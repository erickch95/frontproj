//Definimos las rutas para los usuarios regulares (Fiscales)
import { ConminatoriasUser, Layout } from "@/views/regular";
export default {
  path: "/regular",
  component: Layout,
  children: [{ path: "", component: ConminatoriasUser }],
};
