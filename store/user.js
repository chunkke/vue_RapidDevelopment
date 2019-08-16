import Vue from 'vue'

// export const USER_SIGNIN = 'USER_SIGNIN' //登录成功
// export const USER_SIGNOUT = 'USER_SIGNOUT' //退出登录

export default {
	namespaced: true,
	state: JSON.parse(sessionStorage.getItem('user')) || {},
	mutations: {
		//登录成功
		USER_SIGNIN(state, user) {
			sessionStorage.setItem('user', JSON.stringify(user))
			Object.assign(state, user)
		},
		//退出登录
		USER_SIGNOUT(state) {
			sessionStorage.removeItem('user')
			Object.keys(state).forEach(k => Vue.delete(state, k))
		}
	},
	actions: {
		//登录成功
		USER_SIGNIN({
			commit
		}, user) {
			commit(USER_SIGNIN, user)
		},
		//退出登录
		USER_SIGNOUT({
			commit
		}) {
			commit(USER_SIGNOUT)
		}
	}
}
