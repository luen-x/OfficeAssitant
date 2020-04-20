const APP_ROOT = process.cwd();
const path = require('path');
const iviewReset = ['cascader','select','option','page','anchor','anchor-link', 'tabs','tab-pane']
const vcReset = ['paging','editor','expand']

let percent=0;
module.exports = {
	cacheDirectory: true, // 启用编译缓存
	presets: [
		"env",
		"stage-0"
	],
	plugins: [
		[
			"transform-vue-jsx"
		],
		// [
		// 	"transform-decorators-legacy"
		// ],
		[
			"import",
			[
				{
					"libraryName": "wya-vc",
					"libraryDirectory": "lib",
					"customName": (name) => {
						if(vcReset.includes(name)) {
							// console.log(name)
							if(process.env.NODE_ENV === 'production' && name ==='paging') {
								console.log(`building... ${(++percent/3.0).toFixed(2)}%`);
							}
							return path.resolve(APP_ROOT, `src/pages/components/_common/vc-reset/${name}`)
						}else {
							return `wya-vc/lib/${name}`;
						}
					}
				},
				{
					"libraryName": "iview",
					"customName": (name) => {
						if (iviewReset.includes(name)) {
							// console.log(name)
							return path.resolve(APP_ROOT, `src/pages/components/_common/iview-reset/${name}`)
						}else return `iview/src/components/${name}`;
					}
				},
				
			]
		]
	]
};