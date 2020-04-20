/**
 * 强化项目的读写能力
 */
const { resolve } = require('path');
const { prompt, Separator } = require('inquirer');
const fs = require('fs-extra');
const { routes } = require('./templates/routes');

const directory = resolve(__dirname, '../src/pages/containers/');
const targetModules = [];
fs.readdirSync(directory).forEach((file) => {

	const fullpath = resolve(directory, file);
	// 获取文件信息
	const stat = fs.statSync(fullpath);
	if (!['__tpl__', 'login', 'other'].includes(file) 
		&& stat.isDirectory()
	) {
		targetModules.push(file);
	}

});
if (!fs.existsSync('./config/user.config.js')) {
	fs.outputFileSync(
		'./config/user.config.js', 
		'const obj = {"port":"8082","env":"dev","modules":[]};module.exports = obj; // eslint-disable-line'
	);
}
const userConfig = require('./user.config.js');

const allModuleStr = targetModules.join(',');
const choices = [allModuleStr, 'no'];
if (userConfig.modules && userConfig.modules.length) {
	const lastModuleStr = userConfig.modules.join(',');
	if (lastModuleStr !== allModuleStr) {
		choices.unshift(lastModuleStr);
	}
}
const question = [
	{
		type: 'input',
		name: 'port',
		message: 'port:',
		default: '8082'
	},
	{
		type: 'list',
		name: 'isSelectAll',
		message: 'Select all modules:',
		choices
	},
	{
		type: 'checkbox',
		name: 'modules',
		when: (answers) => answers.isSelectAll === 'no',
		message: 'Select modules:',
		pageSize: targetModules.length + 1,
		choices: targetModules,
		validate: (answer) => {
			if (answer.length < 1) {
				return '至少选择一个模块, 使用Space键选中';
			}
			return true;
		}
	},
	{
		type: 'list',
		name: 'env',
		message: 'Select env:',
		choices: ['dev', 'dev-test', 'pre', 'master'],
		default: 'dev'
	}
];
prompt(question).then((result = {}) => {
	let { isSelectAll, modules, ...rest } = result;

	modules = isSelectAll === 'no' ? modules : isSelectAll.split(',');

	let contents = '';
	const strObj = JSON.stringify({ ...(rest || {}), modules });

	// 输出
	contents = `const obj = ${strObj};module.exports = obj; // eslint-disable-line`;
	fs.outputFileSync('./config/user.config.js', contents);
	fs.outputFileSync('./src/pages/routers/routes.dev.js', routes({ modules }));

}).catch((res) => {
	console.log(res);
});
