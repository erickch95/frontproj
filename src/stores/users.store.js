import { defineStore } from "pinia";
import { fetchWrapper } from "@/helpers";
import { useAuthStore } from "@/stores";
import { useAlertStore } from "@/stores";
import { useStorage } from "@vueuse/core";
import jwt_decode from "jwt-decode";
const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useUsersStore = defineStore({
  id: "users",
  state: () => ({
    users: {},
    user: {},
  }),
  actions: {
    async registerUser(user) {
      await fetchWrapper.post(`${baseUrl}/register`, user);
    },
    async getUsers() {
      this.users = { loading: true };
      try {
        this.users = await fetchWrapper.get(`${baseUrl}/get`);
      } catch (error) {
        this.users = { error };
      }
    },
    async getAllUsers() {
      this.users = { loading: true };
      try {
        this.users = await fetchWrapper.get(`${baseUrl}/getall`);
      } catch (error) {
        this.users = { error };
      }
    },
    async getUserById(id) {
      this.user = { loading: true };
      try {
        this.user = await fetchWrapper.get(`${baseUrl}/get/${id}`);
      } catch (error) {
        this.user = { error };
      }
    },
    async getCurrentUser() {
      this.user = { loading: true };
      try {
        this.user = await fetchWrapper.get(`${baseUrl}/current`);
      } catch (error) {
        this.user = { error };
      }
    },
    async getRegularUser(id) {
      this.user = { loading: true };
      try {
        this.user = await fetchWrapper.get(`${baseUrl}/fiscal/get/${id}`);
      } catch (error) {
        this.user = { error };
      }
    },
    async updateRegularUser(id, params) {
      alert("regular");
      await fetchWrapper.patch(`${baseUrl}/fiscal/update/${id}`, params);

      // update stored user if the logged in user updated their own record
      const authStore = useAuthStore();
      var decoded = jwt_decode(authStore.user.token);
      if (id === decoded.id) {
        const user = {
          nombre: params.nombre,
          rol_usuario: authStore.user.rol_usuario,
          token: authStore.user.token,
        };
        // update local storage
        localStorage.setItem("user", JSON.stringify(user));

        // update auth user in pinia state
        authStore.user = user;
      }
    },
    async updateUser(id, params) {
      await fetchWrapper.patch(`${baseUrl}/update/${id}`, params);

      // update stored user if the logged in user updated their own record
      const authStore = useAuthStore();
      var decoded = jwt_decode(authStore.user.token);

      if (id === decoded.id) {
        // update local storage
        const user = {
          nombre: params.nombre,
          rol_usuario: authStore.user.rol_usuario,
          token: authStore.user.token,
        };
        localStorage.setItem("user", JSON.stringify(user));

        // update auth user in pinia state
        authStore.user = user;
      }
    },
    async statusUser(id) {
      this.users.find((x) => x.id_usuario === id).isDeleting = true;
      await fetchWrapper.put(`${baseUrl}/status/${id}`);
      this.users = this.users.filter((x) => x.id_usuario !== id);
    },
    async deleteUser(id) {
      // add isDeleting prop to user being deleted
      this.users.find((x) => x.id_usuario === id).isDeleting = true;

      await fetchWrapper.delete(`${baseUrl}/delete/${id}`);

      // remove user from list after deleted
      this.users = this.users.filter((x) => x.id_usuario !== id);

      // auto logout if the logged in user deleted their own record
      const authStore = useAuthStore();
      if (id === authStore.user.id_usuario) {
        authStore.logout();
      }
    },
  },
});
