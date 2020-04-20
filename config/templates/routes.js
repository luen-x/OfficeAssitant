const routes = (opts = {}) => {
	const { modules } = opts;
	let contents = '';
	contents += `import Vue from 'vue';\n`;
	contents += `import layout from '@components/layout/layout';\n`;
	contents += `import { PRE_ROUTER_URL } from '../constants/constants';\n`;
	contents += `import { loginConfig } from '../containers/login/app';\n`;
	contents += `import { otherConfig } from '../containers/other/app';\n`;
	modules.forEach((item) => {
		contents += `import { ${item}Config, ${item}OtherConfig } from '../containers/${item}/app';\n`;
	});
	contents += `\n`;
	contents += `export default {\n`;
	contents += `	base: PRE_ROUTER_URL,\n`;
	contents += `	mode: 'history',\n`;
	contents += `	routes: [\n`;
	contents += `		...loginConfig,\n`;
	contents += `		...otherConfig,\n`;
	modules.forEach((item) => {
		contents += `		...(${item}OtherConfig || {}),\n`;
	});
	contents += `		{\n`;
	contents += `			path: '/',\n`;
	contents += `			component: layout,\n`;
	contents += `			redirect: '/${modules.includes('sale') ? 'sale' : modules[0] || 'login'}',\n`;
	contents += `			children: [\n`;
	modules.forEach((item, index) => {
		contents += `				...${item}Config${index === modules.length - 1 ? '' : ','}\n`;
	});
	contents += `			]\n`;
	contents += `		},\n`;
	contents += `		{\n`;
	contents += `			path: '*',\n`;
	contents += `			redirect: (to) => {\n`;
	contents += `				return '/404';\n`;
	contents += `			}\n`;
	contents += `		}\n`;
	contents += `	]\n`;
	contents += `};\n`;
	return contents;
};
module.exports = {
	routes
};



