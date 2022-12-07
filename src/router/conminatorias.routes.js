//Definimos las rutas hacia las vistas para las conminatorias
import {
  Layout,
  ListConminatorias,
  AddConminatoria,
  EditConminatoria,
  HomeConminatorias,
} from "@/views/admin";

export default {
  path: "/conminatorias",
  component: Layout,
  children: [
    { path: "", component: HomeConminatorias },
    { path: "list", component: ListConminatorias },
    { path: "add", component: AddConminatoria },
    { path: "edit/:id", component: EditConminatoria },
  ],
};
