<script setup>
//Vista principal de los usuarios regulares no bloqueados por el usuario Registrador.
import { storeToRefs } from "pinia";
import { useUsersStore, useAlertStore } from "@/stores";
import { useRoute } from "vue-router";
import { router } from "@/router";

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);
const alertStore = useAlertStore();
const route = useRoute();
usersStore.getUsers();
console.log("lista users store", usersStore);
console.log("lista users ", users);

async function statusUser(id, nombre, estado) {
  try {
    let status, word;
    if (estado) {
      status = "Desbloquear";
      word = "habilitado";
    } else {
      status = "Bloquear";
      word = "bloqueado";
    }
    let message;
    if (confirm(`${status} a ${nombre}?`) == true) {
      await usersStore.statusUser(id);
      await router.go("/users");
    } else {
      await router.push("/users");
      alertStore.error("Cancelado.");
    }
  } catch (error) {
    alertStore.error(error);
  }
}
$(document).ready(function () {
  $("#SearchFiscales").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#TablaFiscales tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
</script>

<template>
  <div id="titulosOpciones">
    <h1><b>FISCALES</b></h1>
    <h3><b>LISTA DE FISCALES REGISTRADOS</b></h3>
    <h4>TOTAL: {{ users.length || 0 }}</h4>
    <h5>REGISTRAR, BLOQUEAR O DESBLOQUEAR FISCALES REGISTRADOS.</h5>
    <router-link to="/users/add" class="btn btn-sm btn-success"
      >REGISTRAR FISCAL</router-link
    >
    <div class="form-inline">
      <label><b>Busqueda Rápida:</b></label>
      <input
        id="SearchFiscales"
        type="text"
        class="form-control"
        placeholder="Ingresar texto..."
      />
    </div>
  </div>
  <br />
  <div class="table-responsive">
    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th class="text-center align-middle">Nombre Completo:</th>
          <th class="text-center align-middle">Cédula:</th>
          <th class="text-center align-middle">Télefono:</th>
          <th class="text-center align-middle">Fecha Creación:</th>
          <th class="text-center align-middle">Fecha Modificación:</th>
          <th class="text-center align-middle">Última Modificación:</th>
          <th class="text-center align-middle">Opciones:</th>
        </tr>
      </thead>
      <tbody id="TablaFiscales">
        <template v-if="users.length">
          <tr v-for="user in users" :key="user.id_usuario">
            <td class="text-center align-middle">{{ user.nombre }}</td>
            <td class="text-center align-middle">{{ user.cedula }}</td>
            <td class="text-center align-middle">{{ user.telefono }}</td>
            <td class="text-center align-middle">{{ user.usuario_creado }}</td>
            <td class="text-center align-middle">
              {{ user.usuario_modificado }}
            </td>
            <td class="text-center align-middle">
              {{ user.rol_usuario_modificado_por }}
            </td>
            <td
              class="text-center align-middle"
              style="white-space: nowrap; text-align: center"
            >
              <router-link
                v-if="user.bloqueado == false"
                :to="`/users/edit/${user.id_usuario}`"
                class="btn btn-sm btn-primary mr-1"
                >EDITAR</router-link
              >
              <button
                v-if="user.bloqueado == false"
                @click="
                  statusUser(user.id_usuario, user.nombre, user.bloqueado)
                "
                class="btn btn-sm btn-danger"
                :disabled="user.isDeleting"
              >
                <span
                  v-if="user.isDeleting"
                  class="spinner-border spinner-border-sm"
                ></span>
                <span v-else>BLOQUEAR</span>
              </button>
              <button
                v-if="user.bloqueado == true"
                @click="
                  statusUser(user.id_usuario, user.nombre, user.bloqueado)
                "
                class="btn btn-sm btn-success"
                :disabled="user.isDeleting"
              >
                <span
                  v-if="user.isDeleting"
                  class="spinner-border spinner-border-sm"
                ></span>
                <span v-else>DESBLOQUEAR</span>
              </button>
            </td>
          </tr>
        </template>
        <tr v-if="users.loading">
          <td colspan="7" class="text-center">
            <span class="spinner-border spinner-border-lg align-center"></span>
          </td>
        </tr>
        <tr v-if="users.error">
          <td colspan="7">
            <div class="text-danger">
              Error al cargar Fiscales: {{ users.error }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
