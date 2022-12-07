<script setup>
//Vista principal de las conminatorias por el usuario Registrador.
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
conminatoriasStore.getConminatorias();

const key = ref("");
const parametros = ref("");
const hideDenunciados = ref(false);
const hideDenunciantes = ref(false);
const hideDelitos = ref(false);
const hideMarcar = ref(false);

//Actualizar pagina
const reload = async () => {
  await router.go("/conminatorias");
};

//Peticiion a la BD
const busqueda = async () => {
  const idUsuario = key.value;
  const opcion = parametros.value;
  SearchConminatorias.value = "";
  await conminatoriasStore.getConminatorias(idUsuario, opcion);
};

//Marcar conminatoria
const doneConminatoria = async (
  id_conminatoria,
  codigo,
  fiscal,
  identifier
) => {
  try {
    if (
      confirm(`Conminatoria código: ${codigo}\n MARCAR COMO REALIZADO?`) == true
    ) {
      if (
        confirm(
          `Conminatoria código: ${codigo}\nFiscal: ${fiscal}\nESTA ACCION NO SE PUEDE REVERTIR, NO PODRA EDITAR LA CONMINATORIA.`
        ) == true
      ) {
        await conminatoriasStore.doneConminatoria(id_conminatoria, identifier);
        await router.go("/conminatorias");
      } else {
        alertStore.error("Cancelado.");
      }
    } else {
      alertStore.error("Cancelado.");
    }
  } catch (error) {
    alertStore.error(error);
  }
};

//Busqueda rapida
$(document).ready(function () {
  $("#SearchConminatorias").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#TablaConminatorias tr").filter(function () {
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

//Generar PDF
const generarPDF = () => {
  var sTable = document.getElementById("tablaSearch").innerHTML;
  var style = `
  <style>
  @page { size: letter landscape; }
    * {
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 0.9em;
      color: black !important;
      background-color: white !important;
      }
    table {
      width: 100%;
      }
    table, th, td {
      border: solid 1px black;
      border-collapse: collapse;
      padding: 2px 3px;
      text-align: center;
      }
      </style>`;

  //Utilizamos window Object
  const mensajeParametro = ["No Realizados", "Realizados"];
  const nombreUsuario =
    usersStore.users.find((usuario) => usuario.id_usuario == key.value) ||
    "Todos los Fiscales";
  var win = window.open("a", "", "height = 700, width = 700");
  win.document.write("<html><head>");
  win.document.write("<title> </title>");
  win.document.write(style);
  win.document.write("</head>");
  win.document.write(
    `<body>
        <h2 style = "text-align: center">REPORTE DE CONMINATORIAS</h2>
        <p><b>Usuario: </b>${user.value.nombre}</p>
        <p><b>Rol Usuario: </b>${user.value.rol_usuario}</p>
        <p><b>Fecha: </b>${new Date()}</p>
        <p><b>Total Conminatorias: </b>${
          conminatoriasStore.conminatorias.length
        }</p>
        <p><b>Parámetros: </b>${
          mensajeParametro[parametros.value] || "Realizados y No Realizados"
        }.</p>
      <p><b>Fiscal: </b>${nombreUsuario.nombre || "Todos los Fiscales"}.</p>`
  );
  win.document.write(sTable);
  win.document
    .write(`<p>Yo, <b>${user.value.nombre}</b> como usuario <b>${user.value.rol_usuario}</b>,
      mediante la presente, doy a conocer el estado de las <b>CONMINATORIAS</b> registradas en el Sistema.</p>
      </body></html>`);
  win.document.close();
  win.print();
  win.close();
};
</script>

<template>
  <div id="titulosOpciones">
    <h1><b>CONMINATORIAS</b></h1>
    <h3><b>LISTA DE CONMINATORIAS</b></h3>
    <h4>TOTAL: {{ conminatorias.length || 0 }}</h4>
    <h5>
      REVISE LAS CONMINATORIAS REGISTRADAS, REALIZADAS O VENCIDAS. UTILICE LAS
      OPCIONES DISPONIBLES PARA GENERAR UN REPORTE.
    </h5>
    <div class="form-inline">
      <router-link to="/conminatorias/add" class="btn btn-sm btn-success"
        >CREAR CONMINATORIA</router-link
      >
      <router-link to="/conminatorias/list" class="btn btn-sm btn-primary"
        >ADMINISTRAR CONMINATORIAS
      </router-link>
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
        id="SearchConminatorias"
        type="text"
        class="form-control"
        placeholder="Ingresar texto..."
      />
    </div>
    <div class="form-inline">
      <label> <b>Ocultar Columnas:</b></label>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="hideDenunciados"
          value="false"
        />
        <label class="form-check-label" for="inlineCheckbox1"
          >DENUNCIADOS</label
        >
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="hideDenunciantes"
          value="false"
        />
        <label class="form-check-label" for="inlineCheckbox1"
          >DENUNCIANTES</label
        >
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="hideDelitos"
          value="false"
        />
        <label class="form-check-label" for="inlineCheckbox1">DELITOS</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="hideMarcar"
          value="false"
        />
        <label class="form-check-label" for="inlineCheckbox1">MARCAR</label>
      </div>
      <button
        class="btn btn-sm btn-primary"
        data-toggle="modal"
        data-target="#pdfModal"
      >
        GENERAR PDF
      </button>
    </div>
  </div>
  <br />
  <div class="table-responsive" id="tablaSearch">
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
          <th v-if="hideDenunciados === false" class="text-center align-middle">
            Denunciado(s):
          </th>
          <th
            v-if="hideDenunciantes === false"
            class="text-center align-middle"
          >
            Denunciante(s):
          </th>
          <th v-if="hideDelitos === false" class="text-center align-middle">
            Delito(s):
          </th>
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
          <th v-if="hideMarcar === false" class="text-center align-middle">
            Marcar:
          </th>
          <th
            class="text-center align-middle"
            id="ordenador"
            @click="sortList('fecha_realizado')"
          >
            Fecha Realizado:
          </th>
          <th class="text-center align-middle">Marcado Por:</th>
        </tr>
      </thead>
      <tbody id="TablaConminatorias">
        <template v-if="conminatorias.length">
          <tr
            v-for="conminatoria in conminatorias"
            :key="conminatoria.id_conminatoria"
          >
            <td class="text-center align-middle">{{ conminatoria.codigo }}</td>
            <td class="text-center align-middle">{{ conminatoria.nombre }}</td>
            <td
              v-if="hideDenunciados === false"
              class="text-center align-middle"
            >
              {{ conminatoria.denunciados }}
            </td>
            <td
              v-if="hideDenunciantes === false"
              class="text-center align-middle"
            >
              {{ conminatoria.denunciantes }}
            </td>
            <td v-if="hideDelitos === false" class="text-center align-middle">
              {{ conminatoria.delitos }}
            </td>
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
            <template v-if="hideMarcar === false">
              <td
                class="text-center align-middle"
                v-if="conminatoria.realizado == false"
                style="white-space: nowrap; text-align: center"
              >
                <button
                  @click="
                    doneConminatoria(
                      conminatoria.id_conminatoria,
                      conminatoria.codigo,
                      conminatoria.nombre
                    )
                  "
                  class="btn btn-sm btn-primary btn-delete-conminatoria"
                  :disabled="conminatoria.isDeleting"
                >
                  <span
                    v-if="conminatoria.isDeleting"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  Marcar
                </button>
              </td>
              <td class="text-center align-middle" v-else><b>MARCADO</b></td>
            </template>
            <td class="text-center align-middle">
              {{ conminatoria.fecha_realizado }}
            </td>
            <td class="text-center align-middle">
              {{ conminatoria.rol_usuario_marcado_por }}
            </td>
          </tr>
        </template>
        <tr v-if="conminatorias.loading">
          <td colspan="14" class="text-center">
            <span class="spinner-border spinner-border-lg align-center"></span>
          </td>
        </tr>
        <tr v-if="conminatorias.error">
          <td colspan="14">
            <div class="text-danger">
              Error al cargar conminatorias: {{ conminatorias.error }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Modal -->
  <div
    class="modal fade"
    id="pdfModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="pdfModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="pdfModalLabel"><b> GENERAR PDF</b></h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <h5>
            - Utilice los <b>buscadores</b>. <br />
            - El reporte es generado por la <b>tabla mostrada</b>. <br />
            - No olvide ocultar la columna <b>marcación</b>. <br />
            Continuar?
          </h5>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-sm btn-danger"
            data-dismiss="modal"
          >
            Cerrar
          </button>
          <button
            type="button"
            class="btn btn-sm btn-success"
            @click="generarPDF()"
            data-toggle="modal"
            data-target="#pdfModal"
          >
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
