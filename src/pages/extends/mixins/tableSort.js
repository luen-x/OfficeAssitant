
/**
 * 根据a.b.c的字符串获取一个对象下的属性
 * @param {Object} obj 
 * @param {String} prop  
 */
const getPropValue = (obj, prop) => {
	const propArr = prop.split(',');
	let value;
	propArr.forEach(p => {
		value = obj[p];
	});
};
export const tableSort = (option = {}) => {
	const { callback = "handleResetFirst", // 刷新列表的函数名 默认为resetFirst
		// keyMap, // 暂时不考虑查询的键和colum的key不匹配的问题
		columnName // tabs的情况才需要传，tab的columns的key名字 例如 columns:{1:[{title,key}],2:[{title,key}]}时传字符串"columns",colums也可以是数组
	 } = option;

	return {
		methods: {
			handleSortChange({ key, order }) {
				const { path, query } = this.$route;
				const _query = { ...query };
				if (order == 'normal') {
					delete _query.sort_field;
					delete _query.sort_order;
				} else {
					// if (keyMap && keyMap[key]) {
					// 	_query.sort_field = keyMap[key];
					// } else {
					// 	_query.sort_field = key;
					// }
					_query.sort_field = key;
					_query.sort_order = order;
				}

				this.$router.replace({
					path,
					query: _query,
				});
				
				if (this[callback]) {
					this[callback]();
				}
				if (columnName) {
					if (Array.isArray(this[columnName])) {
						this.setColumnSortType(this[columnName], { sort_field: key, sort_order: order });
						this[columnName] = [...this[columnName]];

					} else if (typeof this[columnName] === 'object') {
						Object.keys(this[columnName]).forEach(k => {
							if (Array.isArray(this[columnName][k])) {
								this.setColumnSortType(this[columnName][k], { sort_field: key, sort_order: order });
								this[columnName][k] = [...this[columnName][k]];
							}
						});
					}
				}
			},
			setColumnSortType(columns, opt) {
				const { sort_field, sort_order } = (opt || this.$route.query);
				columns.forEach(it => {
					if (it.sortable == 'custom' && it.key == sort_field) {
						it.sortType = sort_order;
					} else {
						delete it.sortType;
					}
				});
			},
		},
	};
};