//Definimos las rutas para el manejo de usuarios por parte de un Registrador
import { Layout, ListUser, AddEditUser } from "@/views/admin";
export default {
  path: "/users",
  component: Layout,
  children: [
    { path: "", component: ListUser },
    { path: "add", component: AddEditUser },
    { path: "edit/:id", component: AddEditUser },
  ],
};
