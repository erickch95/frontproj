<script setup>
//Vista principal de todo usuario.
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores";
import { useUsersStore } from "@/stores";
const usersStore = useUsersStore();
const authStore = useAuthStore();
const { user } = storeToRefs(usersStore);
usersStore.getCurrentUser();
</script>

<template>
  <div class="container-fluid">
    <div id="titulosOpciones">
      <h1><b>INFORMACIÓN DEL USUARIO</b></h1>
      <h5>REVISAR O EDITAR LOS DATOS DEL USUARIO.</h5>
    </div>
    <br />
    <div v-if="user">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <th scope="row">Nombre Completo:</th>
            <td>{{ user.nombre }}</td>
          </tr>
          <tr>
            <th scope="row">Cédula de Identidad:</th>
            <td>{{ user.cedula }}</td>
          </tr>
          <tr>
            <th scope="row">Teléfono:</th>
            <td>{{ user.telefono }}</td>
          </tr>
          <tr>
            <th scope="row">Tipo de Usuario:</th>
            <td>{{ user.rol_usuario }}</td>
          </tr>
          <tr>
            <th scope="row">Última Modificación del Usuario:</th>
            <td>
              {{ user.usuario_modificado }},
              {{ user.rol_usuario_modificado_por }}
            </td>
          </tr>
        </tbody>
      </table>
      <div id="perfil">
        <h5><b> USE LA BARRA DE NAVEGACIÓN</b></h5>
        <router-link to="/profile" class="btn btn-sm btn-success"
          >EDITAR INFORMACIÓN</router-link
        >
      </div>
    </div>
  </div>
  <template v-if="user?.loading">
    <div class="text-center m-5">
      <span class="spinner-border spinner-border-lg align-center"></span>
    </div>
  </template>
  <template v-if="user?.error">
    <div class="text-center m-5">
      <div class="text-danger">Error al cargar usuario: {{ user.error }}</div>
    </div>
  </template>
</template>
<style scoped>
table,
#perfil {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}
</style>
