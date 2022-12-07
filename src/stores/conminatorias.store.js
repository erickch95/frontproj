//Definimos el store utilizado por pinia para las conminatorias
import { defineStore } from "pinia";
import { fetchWrapper } from "@/helpers";
import { useAuthStore } from "@/stores";
const baseUrl = `${import.meta.env.VITE_API_URL}/conminatorias`;
export const useConminatoriasStore = defineStore({
  id: "conminatorias",
  state: () => ({
    conminatorias: {},
    conminatoria: {},
  }),
  actions: {
    async insertConminatoria(conminatoria) {
      console.log("insertar", conminatoria);
      await fetchWrapper.post(`${baseUrl}/insert`, conminatoria);
    },
    async getConminatorias(userId, option) {
      //identifier es usado para verificar usuario tipo registrador
      //current es usado para verificar usuario tipo fiscal
      this.conminatorias = { loading: true };
      if (userId || option) {
        try {
          this.conminatorias = await fetchWrapper.get(
            `${baseUrl}/get?` +
              new URLSearchParams({
                userId: userId,
                option: option,
              })
          );
        } catch (error) {
          this.conminatorias = { error };
        }
      } else {
        try {
          this.conminatorias = await fetchWrapper.get(`${baseUrl}/get`);
        } catch (error) {
          this.conminatorias = { error };
        }
      }
    },
    async getAllConminatorias(userId, option) {
      //identifier es usado para verificar usuario tipo registrador
      //current es usado para verificar usuario tipo fiscal
      this.conminatorias = { loading: true };
      if (userId || option) {
        try {
          this.conminatorias = await fetchWrapper.get(
            `${baseUrl}/getall?` +
              new URLSearchParams({
                userId: userId,
                option: option,
              })
          );
        } catch (error) {
          this.conminatorias = { error };
        }
      } else {
        try {
          this.conminatorias = await fetchWrapper.get(`${baseUrl}/getall`);
        } catch (error) {
          this.conminatorias = { error };
        }
      }
    },
    async getConminatoriaById(id) {
      this.conminatoria = { loading: true };
      try {
        this.conminatoria = await fetchWrapper.get(`${baseUrl}/get/${id}`);
        console.log("DATA", this.conminatoria);
      } catch (error) {
        this.conminatoria = { error };
      }
    },
    async updateConminatoria(id, params) {
      console.log("update conmi", id, params);
      await fetchWrapper.patch(`${baseUrl}/update/${id}`, params);
    },
    async doneConminatoria(id) {
      // add isDeleting prop to conminatoria being deleted
      this.conminatorias.find(
        (x) => x.id_conminatoria === id
      ).isDeleting = true;
      await fetchWrapper.put(`${baseUrl}/done/${id}`);

      console.log("DONE conmi", id);
    },
    async doneFiscalConminatoria(id) {
      console.log("DONE conmi fisal", id);
      // add isDeleting prop to conminatoria being deleted
      this.conminatorias.find(
        (x) => x.id_conminatoria === id
      ).isDeleting = true;
      await fetchWrapper.put(`${baseUrl}/fiscal/done/${id}`);
      console.log("DONE conmi", id);
    },
    async deleteConminatoria(id, identifier) {
      // add isDeleting prop to conminatoria being deleted
      this.conminatorias.find(
        (x) => x.id_conminatoria === id
      ).isDeleting = true;

      await fetchWrapper.delete(`${baseUrl}/delete/${id}`, {
        identifier: identifier,
      });

      // remove conminatoria from list after deleted
      this.conminatorias = this.conminatorias.filter(
        (x) => x.id_conminatoria !== id
      );
    },
    async getConminatoriasFiscal(option) {
      this.conminatorias = { loading: true };
      if (option) {
        try {
          this.conminatorias = await fetchWrapper.get(
            `${baseUrl}/fiscal/get?` +
              new URLSearchParams({
                option: option,
              })
          );
        } catch (error) {
          this.conminatorias = { error };
        }
      } else {
        try {
          this.conminatorias = await fetchWrapper.get(`${baseUrl}/fiscal/get`);
        } catch (error) {
          this.conminatorias = { error };
        }
      }
    },
  },
});
