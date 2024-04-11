import { reactive } from 'vue';

export const store = reactive({
	nivelLimite: 3,
	nivelMax: 0,
	user: "",
	token: "",

	setNuevoNivel(nuevoNivel) {
		this.nivelMax = nuevoNivel;
	},
	setUser(user) {
		user = user;
	},
	setToken(token) {
		token = token;
	},
})