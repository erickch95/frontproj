<script setup>
//Vista principal para editar conminatorias por el usuario Registrador.
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUsersStore, useConminatoriasStore, useAlertStore } from "@/stores";
import { router } from "@/router";
const usersStore = useUsersStore();
const { users, infoUser } = storeToRefs(usersStore);
const conminatoriasStore = useConminatoriasStore();
const { currentUser } = storeToRefs(usersStore);
const alertStore = useAlertStore();
const route = useRoute();
const id = route.params.id;
usersStore.getUsers();

let conminatoria = null;
if (id) {
  ({ conminatoria } = storeToRefs(conminatoriasStore));
  conminatoriasStore.getConminatoriaById(id);
}

function format_date(value) {
  if (value) {
    console.log("sdas", moment(String(value)).format("YYYY-MM-DD"));
    return moment(String(value)).format("YYYY-MM-DD");
  }
}
const formats = ["application/pdf"];
const schema = Yup.object().shape({
  codigo: Yup.string().required("El CUD o NUREJ es requerido."),
  id_usuario_conminatoria: Yup.string().required("El Fiscal es requerido."),
  denunciados: Yup.string().required("Denunciado(s) es requerido."),
  denunciantes: Yup.string().required("Denunciante(s) es requerido."),
  delitos: Yup.string().required("Delito(s) es requerido."),
  fecha_cd: Yup.date().required("Seleccione la fecha de notificación por C.D."),
  fecha_fiscal: Yup.date().required(
    "Seleccione la fecha de notificación al Fiscal."
  ),
  fecha_limite: Yup.date().required("Seleccione la fecha límite."),
  documento: Yup.mixed()
    .optional()
    .test("fileSize", "Tamaño maximo 3MB.", (value) => {
      if (value) {
        return value.size <= 3000000;
      } else {
        return true;
      }
    })
    .test("fileType", "Solo archivos PDF.", (value) => {
      if (value) {
        return formats.includes(value.type);
      } else {
        return true;
      }
    }),
});
console.log("YIP", schema);

async function onSubmit(values) {
  console.log("funcion editar conmi", values);
  try {
    let message;
    await conminatoriasStore.updateConminatoria(id, values);
    message = "Conminatoria actualizada.";
    await router.push("/conminatorias/list");
    alertStore.success(message);
  } catch (error) {
    alertStore.error(error);
    console.log(error);
  }
}
console.log("conminatoria", conminatoria);
</script>

<template>
  <h1>CONMINATORIAS</h1>
  <h3>EDITAR CONMINATORIA</h3>
  <template v-if="!(conminatoria?.loading || conminatoria?.error)">
    <Form
      @submit="onSubmit"
      :validation-schema="schema"
      :initial-values="conminatoria"
      v-slot="{ errors, isSubmitting }"
    >
      <div class="form-row">
        <div class="form-group col">
          <label>Código:</label>
          <Field
            name="codigo"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.codigo }"
          />
          <div class="invalid-feedback">{{ errors.codigo }}</div>
        </div>

        <div class="form-group col">
          <label>Fiscal Asignado:</label>
          <Field
            name="id_usuario_conminatoria"
            as="select"
            class="form-control"
            :class="{ 'is-invalid': errors.id_usuario_conminatoria }"
          >
            <option
              v-for="user in users"
              :key="user.id_usuario"
              :value="user.id_usuario"
            >
              {{ user.nombre }}
            </option>
          </Field>
          <div class="invalid-feedback">
            {{ errors.id_usuario_conminatoria }}
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col">
          <label>Denunciado(s):</label>
          <Field
            name="denunciados"
            type="text"
            as="textarea"
            class="form-control"
            :class="{ 'is-invalid': errors.denunciados }"
          />
          <div class="invalid-feedback">{{ errors.denunciados }}</div>
        </div>
        <div class="form-group col">
          <label>Denunciante(s):</label>
          <Field
            name="denunciantes"
            type="text"
            as="textarea"
            class="form-control"
            :class="{ 'is-invalid': errors.denunciados }"
          />
          <div class="invalid-feedback">{{ errors.denunciados }}</div>
        </div>
        <div class="form-group col">
          <label>Delito(s):</label>
          <Field
            name="delitos"
            type="text"
            as="textarea"
            class="form-control"
            :class="{ 'is-invalid': errors.delitos }"
          />
          <div class="invalid-feedback">{{ errors.delitos }}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col">
          <label>Fecha Notificación C.D.:</label>
          <Field
            name="fecha_cd"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': errors.fecha_cd }"
          />
          <div class="invalid-feedback">{{ errors.fecha_cd }}</div>
        </div>
        <div class="form-group col">
          <label>Fecha Notificación Fiscal:</label>
          <Field
            name="fecha_fiscal"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': errors.fecha_fiscal }"
          />
          <div class="invalid-feedback">{{ errors.fecha_fiscal }}</div>
        </div>
        <div class="form-group col">
          <label>Fecha Límite:</label>
          <Field
            name="fecha_limite"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': errors.fecha_limite }"
          />
          <div class="invalid-feedback">{{ errors.fecha_limite }}</div>
        </div>
        <div class="form-group col-md-4">
          <label
            >Documento actual:-
            <a v-bind:href="`${conminatoria.directorio_pdf}`" target="_blank"
              >ABRIR</a
            >
            -Seleccione para reemplazar:</label
          >
          <Field
            name="documento"
            type="file"
            class="form-control"
            :class="{ 'is-invalid': errors.documento }"
          />
          <div class="invalid-feedback">{{ errors.documento }}</div>
          <div class="invalid-feedback">{{ errors.directorio_pdf }}</div>
        </div>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" :disabled="isSubmitting">
          <span
            v-show="isSubmitting"
            class="spinner-border spinner-border-sm mr-1"
          ></span>
          ACTUALIZAR
        </button>
        <router-link to="/conminatorias" class="btn btn-danger"
          >CANCELAR</router-link
        >
      </div>
    </Form>
  </template>
  <template v-if="conminatoria?.loading">
    <div class="text-center m-5">
      <span class="spinner-border spinner-border-lg align-center"></span>
    </div>
  </template>
  <template v-if="conminatoria?.error">
    <div class="text-center m-5">
      <div class="text-danger">
        Error al cargar conminatoria: {{ conminatoria.error }}
      </div>
    </div>
  </template>
</template>
<style scoped>
a {
  font-weight: bold;
}
</style>
