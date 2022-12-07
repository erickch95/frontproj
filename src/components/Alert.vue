<!-- Componente de alerta que utiliza Vue -->
<script setup>
import { storeToRefs } from "pinia";
import { useAlertStore } from "@/stores";

const alertStore = useAlertStore();
const { alert } = storeToRefs(alertStore);
</script>

<template>
  <div v-if="alert" class="container-fluid">
    <div class="m-2">
      <div class="alert alert-dismissable" :class="alert.type">
        <button @click="alertStore.clear()" class="btn btn-link close">
          &times;
        </button>
        RESPUESTA: {{ alert.message }}
      </div>
    </div>
  </div>
</template>
