import 'babel-polyfill';

/**
 * Vue
 */
import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import { Vc, DebounceClick } from 'wya-vc';
import { sync } from 'vuex-router-sync';
import { locale, Message, Modal, Button, Form } from 'iview';
import lang from 'iview/dist/locale/zh-CN';

// configure language 
locale(lang);

/**
 * 配置
 */
import SetTitle from '@common/set-title/set-title';
import LimitWords from '@common/limit-words/limit-words';
import Loading from '@common/loading/loading';
import emitter from '@extends/mixins/emitter';
import request from '@extends/plugins/request';
import VcConfig from './vc.config';

/**
 * 全局变量 _global
 */
import _global from './_global';

/**
 * vue-router Config
 */
let routeConfig;
if (process.env.NODE_ENV !== "production") {
	routeConfig = require('./routes.dev').default;
} else {
	routeConfig = require('./routes.dist').default;
}
// 导出所有的路由
// let routesArr = []; 
// function statisticsRoutes(routes) {
// 	for (let index = 0; index < routes.length; index++) {
// 		routesArr.push(routes[index].path);
// 		if (routes[index].children && routes[index].children.length) {
// 			statisticsRoutes(routes[index].children);
// 		}
// 	}
// }
// statisticsRoutes(routeConfig.routes);
import { beforeEach, afterEach } from './hooks';

/**
 * Vuex Config
 */
import { storeConfig } from '../stores/root';

Vue.config.productionTip = false;

// - 全局组件
Vue.component(SetTitle.name, SetTitle);
Vue.component(LimitWords.name, LimitWords);
Vue.component(Loading.name, Loading);
DebounceClick.props = {
	...DebounceClick.props, ...Button.props
};
Vue.component('vc-debounce-click', DebounceClick);

// - 全局mixins
Vue.mixin(emitter);

// - 全局plugins
Vue.use(request);

// - 全局global对象
Vue.use(_global);

// - 路由
Vue.use(Router);
const router = new Router(routeConfig);
router.beforeEach(beforeEach);
router.afterEach(afterEach);

// - Vuex
Vue.use(Vuex);
const store = new Vuex.Store(storeConfig);

// - 全局wya-vc实例
Vue.use(Vc, VcConfig({ store, router }));


// - 同步
sync(store, router);

// - 实例
const app = new Vue({
	el: "#pages",
	router,
	store,
	render(h) {
		return (
			<div id="pages" style="overflow: hidden">
				<router-view></router-view>
			</div>
		);
	}
});

// form 校验并滚动到第一个出错元素
Form.methods.validateAndScroll = function (callback) {
	return new Promise((resolve, reject) => {
		let valid = true;
		let count = 0;
		this.errorList = [];
		if (this.fields.length) {
			this.fields.forEach(field => {
				field.validate('', errors => {
					if (errors) {
						if (valid) {
							field.$el.scrollIntoView({
								behavior: 'smooth'
							});
						}
						valid = false;
						this.errorList.push(field);
					}
					if (++count === this.fields.length) {
						// all finish
						resolve(valid);
						if (typeof callback === 'function') {
							callback(valid);
						}
					}
				});
			});
		} else {
			resolve(valid);
			if (typeof callback === 'function') {
				callback(valid);
			}
		}
	});
};
Form.methods.validate = function (callback) {
	return new Promise((resolve, reject) => {
		let valid = true;
		let count = 0;
		this.errorList = [];
		if (this.fields.length) {
			this.fields.forEach(field => {
				field.validate('', errors => {
					if (errors) {
						valid = false;
						this.errorList.push(field);
					}
					if (++count === this.fields.length) {
						// all finish
						resolve(valid);
						if (typeof callback === 'function') {
							callback(valid);
						}
					}
				});
			});
		} else {
			resolve(valid);
			if (typeof callback === 'function') {
				callback(valid);
			}
		}
	});
};
// 先不考虑服务端渲染情况
router.onReady(() => {
	app.$mount();
});
router.onError((error) => {
	if (error.message.match(/Loading chunk (\d)+ failed/g)) {
		location.reload();
	}
});
// 覆写router的go方法，为了解决返回时，localStorage里的history与vue-router的history不一致的问题
router.go = (n) => {
	if (n < 0) {
		const histortStr = localStorage.getItem('history_' + window._global.version);
		if (histortStr) {
			const historyArr = JSON.parse(histortStr);
			historyArr.splice(0, -n + 1);
			localStorage.setItem('history_' + window._global.version, JSON.stringify(historyArr));
		}
	}
	router.history.go(n);
};
window.app = app;

// Message Modal 全局注册
Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;
Vue.prototype.$Message.config({
	top: 50,
	duration: 3
});
