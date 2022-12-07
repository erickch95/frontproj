<script setup>
//Vista principal para la administracion de conminatorias por el usuario Registrador.
import { storeToRefs } from "pinia";
import {
  useConminatoriasStore,
  useUsersStore,
  useAlertStore,
  useAuthStore,
} from "@/stores";
import { router } from "@/router";
import { ref } from "vue";
const authStore = useAuthStore();
const usersStore = useUsersStore();
const conminatoriasStore = useConminatoriasStore();
const alertStore = useAlertStore();

const { user } = storeToRefs(authStore);
const { users } = storeToRefs(usersStore);
const { conminatorias } = storeToRefs(conminatoriasStore);

usersStore.getUsers();
conminatoriasStore.getAllConminatorias();

const key = ref("");
const parametros = ref("");

const reload = async () => {
  await router.go("/conminatorias/list");
};

//Peticiion a la BD
const busqueda = async () => {
  const idUsuario = key.value;
  const opcion = parametros.value;
  SearchAllConminatorias.value = "";
  await conminatoriasStore.getAllConminatorias(idUsuario, opcion);
};

//Busqueda rapida
$(document).ready(function () {
  $("#SearchAllConminatorias").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#TablaAllConminatorias tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

//Ordenar
let sortAsc = true;
const sortList = (columna) => {
  {
    if (sortAsc === true) {
      conminatoriasStore.conminatorias.sort(function (a, b) {
        return (
          (a[columna] === null) - (b[columna] === null) ||
          +(a[columna] > b[columna]) ||
          -(a[columna] < b[columna])
        );
      });
      sortAsc = false;
    } else {
      conminatoriasStore.conminatorias.sort(function (a, b) {
        return (
          (a[columna] === null) - (b[columna] === null) ||
          -(a[columna] > b[columna]) ||
          +(a[columna] < b[columna])
        );
      });
      sortAsc = true;
    }
  }
};
</script>

<template>
  <div id="titulosOpciones">
    <h1><b>CONMINATORIAS</b></h1>
    <h3><b>ADMINISTRAR CONMINATORIAS</b></h3>
    <h4>TOTAL: {{ conminatorias.length || 0 }}</h4>
    <h5>
      VER DETALLES DE LAS CONMINATORIAS, CREAR O EDITAR CONMINATORIAS, LAS
      CUALES NO ESTEN REALIZADAS O VENCIDAS. UTILICE LAS OPCIONES DISPONIBLES
      PARA FILTRAR.
    </h5>
    <div class="form-inline">
      <router-link to="/conminatorias" class="btn btn-sm btn-primary"
        >VOLVER</router-link
      >
    </div>
    <div class="form-inline">
      <label> <b>MOSTRAR: </b> </label>
      <div class="form-check form-check-inline">
        <button class="btn btn-sm btn-info" @click="reload()">RESET</button>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          @change="busqueda()"
          v-model="parametros"
          value="1"
        />
        <label>REALIZADOS</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          @change="busqueda()"
          v-model="parametros"
          value="0"
        />
        <label>NO REALIZADOS</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          @change="busqueda()"
          v-model="parametros"
          value=""
        />
        <label>TODOS</label>
      </div>
      <label><b>FISCAL:</b></label>
      <select
        v-model="key"
        class="form-control form-control-sm"
        @change="busqueda()"
      >
        <option selected="selected" value="">TODOS LOS FISCALES</option>
        <option
          v-for="user in users"
          :key="user.id_usuario"
          :value="user.id_usuario"
        >
          {{ user.nombre }}
        </option>
      </select>
      <label><b>Busqueda Rápida:</b></label
      ><input
        id="SearchAllConminatorias"
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
          <th
            class="text-center align-middle"
            id="ordenador"
            @click="sortList('codigo')"
          >
            Código:
          </th>
          <th
            class="text-center align-middle"
            id="ordenador"
            @click="sortList('nombre')"
          >
            Fiscal:
          </th>
          <th class="text-center align-middle">Denunciado(s):</th>
          <th class="text-center align-middle">Denunciante(s):</th>
          <th class="text-center align-middle">Delito(s):</th>
          <th
            class="text-center align-middle"
            id="ordenador"
            @click="sortList('fecha_cd')"
          >
            Fecha Ciudadanía Digital:
          </th>
          <th
            class="text-center align-middle"
            id="ordenador"
            @click="sortList('fecha_fiscal')"
          >
            Fecha Notificación Fiscal:
          </th>
          <th
            class="text-center align-middle"
            id="ordenador"
            @click="sortList('fecha_limite')"
          >
            Fecha Límite Conminatoria:
          </th>
          <th class="text-center align-middle">Documento:</th>
          <th class="text-center align-middle">Realizado?:</th>
          <th
            class="text-center align-middle"
            id="ordenador"
            @click="sortList('fecha_realizado')"
          >
            Fecha Realizado:
          </th>
          <th class="text-center align-middle">Marcado Por:</th>
          <th
            class="text-center align-middle"
            id="ordenador"
            @click="sortList('conminatoria_creado')"
          >
            Creado:
          </th>
          <th
            class="text-center align-middle"
            id="ordenador"
            @click="sortList('conminatoria_modificado')"
          >
            Modificado:
          </th>
          <th class="text-center align-middle">Modificado Por:</th>
          <th class="text-center align-middle">Opciones:</th>
        </tr>
      </thead>
      <tbody id="TablaAllConminatorias">
        <template v-if="conminatorias.length">
          <tr
            v-for="conminatoria in conminatorias"
            :key="conminatoria.id_conminatoria"
          >
            <td class="text-center align-middle">{{ conminatoria.codigo }}</td>
            <td class="text-center align-middle">{{ conminatoria.nombre }}</td>
            <td class="text-center align-middle">
              {{ conminatoria.denunciados }}
            </td>
            <td class="text-center align-middle">
              {{ conminatoria.denunciantes }}
            </td>
            <td class="text-center align-middle">{{ conminatoria.delitos }}</td>
            <td class="text-center align-middle">
              {{ conminatoria.fecha_cd }}
            </td>
            <td class="text-center align-middle">
              {{ conminatoria.fecha_fiscal }}
            </td>
            <td class="text-center align-middle">
              {{ conminatoria.fecha_limite }}
            </td>
            <td class="text-center align-middle">
              <a
                class="btn btn-sm btn-info"
                v-bind:href="`${conminatoria.directorio_pdf}`"
                target="_blank"
                >ABRIR</a
              >
            </td>
            <td
              class="text-center align-middle"
              v-if="conminatoria.realizado == true"
              style="background-color: green; color: white"
            >
              SI
            </td>
            <td
              class="text-center align-middle"
              v-else
              style="background-color: red; color: white"
            >
              NO
            </td>

            <td class="text-center align-middle">
              {{ conminatoria.fecha_realizado }}
            </td>
            <td class="text-center align-middle">
              {{ conminatoria.rol_usuario_marcado_por }}
            </td>
            <td class="text-center align-middle">
              {{ conminatoria.conminatoria_creado }}
            </td>
            <td class="text-center align-middle">
              {{ conminatoria.conminatoria_modificado }}
            </td>
            <td class="text-center align-middle">
              {{ conminatoria.rol_usuario_conminatoria_modificado_por }}
            </td>
            <td
              class="text-center align-middle"
              style="white-space: nowrap; text-align: center"
            >
              <router-link
                v-if="conminatoria.realizado == false"
                :to="`/conminatorias/edit/${conminatoria.id_conminatoria}`"
                class="btn btn-sm btn-primary mr-1"
                >EDITAR</router-link
              >
              <button
                v-if="conminatoria.realizado == false"
                @click="
                  conminatoriasStore.deleteConminatoria(
                    conminatoria.id_conminatoria,
                    identifier
                  )
                "
                class="btn btn-sm btn-danger btn-delete-conminatoria"
                :disabled="conminatoria.isDeleting"
              >
                <span
                  v-if="conminatoria.isDeleting"
                  class="spinner-border spinner-border-sm"
                ></span>
                <span v-else>ELIMINAR</span>
              </button>
              <b v-else>REALIZADO</b>
            </td>
          </tr>
        </template>
        <tr v-if="conminatorias.loading">
          <td colspan="17" class="text-center">
            <span class="spinner-border spinner-border-lg align-center"></span>
          </td>
        </tr>
        <tr v-if="conminatorias.error">
          <td colspan="17">
            <div class="text-danger">
              Error al cargar conminatorias: {{ conminatorias.error }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
