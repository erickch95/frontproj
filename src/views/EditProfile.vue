<script setup>
//Vista principal para la edicion de datos de todo usuario.
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUsersStore, useAlertStore, useAuthStore } from "@/stores";
import { router } from "@/router";
const authStore = useAuthStore();
const usersStore = useUsersStore();
const alertStore = useAlertStore();
const { user } = storeToRefs(usersStore);
usersStore.getCurrentUser();

const schema = Yup.object().shape({
  cedula: Yup.string().required("C.I. es requerido."),
  nombre: Yup.string().required("Nombre completo es requerido."),
  telefono: Yup.string().required("Teléfono es requerido."),
  clave: Yup.string()
    .transform((x) => (x === "" ? undefined : x))
    // clave opcional en edicion de usuario
    .concat(user ? null : Yup.string().required("La contraseña es requerida."))
    .min(8, "Al menos 8 caracteres."),
});

async function onSubmit(values) {
  if (user.value.rol_usuario == "Registrador") {
    console.log("funcion editar usuario registrador.");
    try {
      let message;
      await usersStore.updateUser(user.value.id_usuario, values);
      message = `Perfil ${values.nombre} actualizado.`;
      await router.push("/");
      alertStore.success(message);
    } catch (error) {
      alertStore.error(error);
    }
  }
  if (user.value.rol_usuario == "Fiscal") {
    console.log("funcion editar usuario fiscal");
    try {
      let message;
      await usersStore.updateRegularUser(user.value.id_usuario, values);
      message = `Perfil ${values.nombre} actualizado.`;
      await router.push("/");
      alertStore.success(message);
    } catch (error) {
      alertStore.error(error);
    }
  }
}
</script>

<template>
  <div id="titulosOpciones">
    <h1><b>EDITAR PERFIL:</b></h1>
    <h5>
      EDITAR INFORMACIÓN DEL USUARIO, REVISAR CON DETALLE LOS DATOS ENVIADOS.
    </h5>
  </div>
  <br />
  <template v-if="!(user?.loading || user?.error)">
    <Form
      @submit="onSubmit"
      :validation-schema="schema"
      :initial-values="user"
      v-slot="{ errors, isSubmitting }"
    >
      <div class="form-row">
        <div class="form-group col">
          <label><b>Cédula de Identidad:</b></label>
          <Field
            name="cedula"
            type="text"
            class="form-control"
            placeholder="Ej: 12345678, 24681012-IR"
            :class="{ 'is-invalid': errors.cedula }"
          />
          <div class="invalid-feedback">{{ errors.cedula }}</div>
        </div>
        <div class="form-group col">
          <label><b>Nombre Completo:</b></label>
          <Field
            name="nombre"
            type="text"
            class="form-control"
            placeholder="Introducir el nombre completo."
            :class="{ 'is-invalid': errors.nombre }"
          />
          <div class="invalid-feedback">{{ errors.nombre }}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col">
          <label><b>Teléfono:</b></label>
          <Field
            name="telefono"
            type="text"
            class="form-control"
            placeholder="Introducir télefono."
            :class="{ 'is-invalid': errors.telefono }"
          />
          <div class="invalid-feedback">{{ errors.telefono }}</div>
        </div>
        <div class="form-group col">
          <label>
            <b>Contraseña:</b>
            <em v-if="user"> Dejar en blanco para mantener.</em>
          </label>
          <Field
            name="clave"
            type="password"
            class="form-control"
            placeholder="Al menos 8 caracteres."
            :class="{ 'is-invalid': errors.clave }"
          />
          <div class="invalid-feedback">{{ errors.clave }}</div>
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
        <router-link to="/" class="btn btn-danger">CANCELAR</router-link>
      </div>
    </Form>
  </template>
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
