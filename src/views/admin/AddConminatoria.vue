<script setup>
//Vista principal para el registro de conminatorias usuario Registrador.
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUsersStore, useConminatoriasStore, useAlertStore } from "@/stores";
import { router } from "@/router";

const conminatoriasStore = useConminatoriasStore();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const route = useRoute();
const id = route.params.id;
const { users } = storeToRefs(usersStore);
console.log(id);
let conminatoria = null;

usersStore.getUsers();
console.log("ADD/EDIT CONMI STORE", conminatoriasStore);
console.log("ADD/EDIT CONMI ALERT", alertStore);
console.log("ADD/EDIT", conminatoria);

const formats = ["application/pdf"];
const schema = Yup.object().shape({
  codigo: Yup.string().required("El CUD o NUREJ es requerido."),
  id_usuario_conminatoria: Yup.string().required("Fiscal es requerido."),
  denunciados: Yup.string().required("Denunciado(s) es requerido."),
  denunciantes: Yup.string().required("Denunciante(s) es requerido."),
  delitos: Yup.string().required("Delito(s) es requerido."),
  fecha_cd: Yup.date().required("Seleccione la fecha de notificación por C.D."),
  fecha_fiscal: Yup.date().required(
    "Seleccione la fecha de notificación al Fiscal."
  ),
  fecha_limite: Yup.date().required("Seleccione la fecha límite."),
  documento: Yup.mixed()
    .required("Debe agregar un documento de respaldo.")
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

async function onSubmit(values) {
  console.log("add conmi", values);
  try {
    let message;
    await conminatoriasStore.insertConminatoria(values);
    message = `Conminatoria codigo: ${values.codigo} creada.`;
    await router.push("/conminatorias");
    alertStore.success(message);
  } catch (error) {
    alertStore.error(error);
  }
}
</script>

<template>
  <div id="titulosOpciones">
    <h1><b> CONMINATORIAS</b></h1>
    <h3><b> CREAR CONMINATORIA</b></h3>
    <h5>CREAR CONMINATORIA, REVISAR CON DETALLE LOS DATOS ENVIADOS.</h5>
  </div>
  <br />
  <template v-if="!(conminatoria?.loading || conminatoria?.error)">
    <Form
      @submit="onSubmit"
      :validation-schema="schema"
      :initial-values="conminatoria"
      v-slot="{ errors, isSubmitting }"
    >
      <div class="form-row">
        <div class="form-group col">
          <label><b>Código Único:</b></label>
          <Field
            name="codigo"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.codigo }"
          />
          <div class="invalid-feedback">{{ errors.codigo }}</div>
        </div>

        <div class="form-group col">
          <label><b>Fiscal Asignado:</b></label>
          <Field
            name="id_usuario_conminatoria"
            as="select"
            class="form-control"
            :class="{ 'is-invalid': errors.id_usuario_conminatoria }"
            ><option disabled value="">
              ---ESCOJA DE LA LISTA DE FISCALES REGISTRADOS---
            </option>
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
          <label><b>Denunciado(s):</b></label>
          <Field
            name="denunciados"
            type="text"
            as="textarea"
            class="form-control"
            maxlength="254"
            :class="{ 'is-invalid': errors.denunciados }"
          />
          <div class="invalid-feedback">{{ errors.denunciados }}</div>
        </div>
        <div class="form-group col">
          <label><b>Denunciante(s):</b></label>
          <Field
            name="denunciantes"
            type="text"
            as="textarea"
            class="form-control"
            maxlength="254"
            :class="{ 'is-invalid': errors.denunciantes }"
          />
          <div class="invalid-feedback">{{ errors.denunciantes }}</div>
        </div>
        <div class="form-group col">
          <label><b>Delito(s):</b></label>
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
          <label><b>Fecha Notificacion C.D.:</b></label>
          <Field
            name="fecha_cd"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': errors.fecha_cd }"
          />
          <div class="invalid-feedback">{{ errors.fecha_cd }}</div>
        </div>
        <div class="form-group col">
          <label><b>Fecha Notificacion Fiscal:</b></label>
          <Field
            name="fecha_fiscal"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': errors.fecha_fiscal }"
          />
          <div class="invalid-feedback">{{ errors.fecha_fiscal }}</div>
        </div>
        <div class="form-group col">
          <label><b>Fecha Limite:</b></label>
          <Field
            name="fecha_limite"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': errors.fecha_limite }"
          />
          <div class="invalid-feedback">{{ errors.fecha_limite }}</div>
        </div>
        <div class="form-group col">
          <label><b>Documento:</b></label>
          <Field
            name="documento"
            type="file"
            class="form-control"
            :class="{ 'is-invalid': errors.documento }"
          />
          <div class="invalid-feedback">{{ errors.documento }}</div>
        </div>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" :disabled="isSubmitting">
          <span
            v-show="isSubmitting"
            class="spinner-border spinner-border-sm mr-1"
          ></span>
          GUARDAR
        </button>
        <router-link to="/conminatorias" class="btn btn-danger"
          >CANCELAR</router-link
        >
      </div>
    </Form>
  </template>
  <template v-if="conminatoria?.loading">
    <div class="text-center m-12">
      <span class="spinner-border spinner-border-lg align-center"></span>
    </div>
  </template>
</template>
