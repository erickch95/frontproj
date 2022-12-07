<script setup>
//Vista principal del login.
import { Form, Field } from "vee-validate";
import * as Yup from "yup";

import { useAuthStore } from "@/stores";

const schema = Yup.object().shape({
  cedula: Yup.string().required("EL C.I. es requerido."),
  clave: Yup.string().required("La contraseña es requerida."),
});

async function onSubmit(values) {
  const authStore = useAuthStore();
  const { cedula, clave } = values;
  await authStore.login(cedula, clave);
}
</script>

<template>
  <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
    <span class="navbar-text" style="color: white">CONMINATORIAS</span>
  </nav>
  <div class="card m-3">
    <h4 class="card-header"><b>INGRESAR</b></h4>
    <div class="card-body">
      <Form
        @submit="onSubmit"
        :validation-schema="schema"
        v-slot="{ errors, isSubmitting }"
      >
        <div class="form-group">
          <label><b>Cédula de Identidad:</b></label>
          <Field
            name="cedula"
            type="text"
            class="form-control"
            placeholder="Ej: 12345678, 24681012-1P."
            :class="{ 'is-invalid': errors.cedula }"
          />
          <div class="invalid-feedback">{{ errors.cedula }}</div>
        </div>
        <div class="form-group">
          <label><b>Contraseña:</b></label>
          <Field
            name="clave"
            type="password"
            placeholder="Introduzca su contraseña."
            class="form-control"
            :class="{ 'is-invalid': errors.clave }"
          />
          <div class="invalid-feedback">{{ errors.clave }}</div>
        </div>
        <div class="form-group">
          <button class="btn btn-primary" :disabled="isSubmitting">
            <span
              v-show="isSubmitting"
              class="spinner-border spinner-border-sm mr-1"
            ></span>
            INGRESAR
          </button>
        </div>
      </Form>
      <p>
        Si olvido su contraseña o tiene problemas, contactarse con el
        administrador.
      </p>
    </div>
  </div>
</template>
