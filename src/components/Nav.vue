<script setup>
//Manejo de la barra de navegacion considerando el tipo de usuario.
import { useAuthStore } from "@/stores";
import { storeToRefs } from "pinia";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>
<template>
  <div v-if="user">
    <nav
      v-if="user.rol_usuario == 'Registrador'"
      class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark"
    >
      <a style="color: white">MENU:</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
              >PERFIL</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/conminatorias"
              class="nav-item nav-link"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
              >CONMINATORIAS</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/users"
              class="nav-item nav-link"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
              >FISCALES</router-link
            >
          </li>
          <li class="nav-item">
            <a @click="authStore.logout()" href="#" class="nav-item nav-link">
              CERRAR SESION
            </a>
          </li>
        </ul>
        <span class="navbar-text" style="color: white">
          Registrador: {{ user.nombre }}
        </span>
      </div>
    </nav>
    <nav
      v-if="user.rol_usuario == 'Fiscal'"
      class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark"
    >
      <a style="color: white">MENU:</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
              >PERFIL</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/regular"
              class="nav-item nav-link"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
              >CONMINATORIAS</router-link
            >
          </li>
          <li class="nav-item">
            <a @click="authStore.logout()" href="#" class="nav-item nav-link">
              CERRAR SESION
            </a>
          </li>
        </ul>
        <span class="navbar-text" style="color: white">
          Fiscal: {{ user.nombre }}
        </span>
      </div>
    </nav>
  </div>
</template>
