const initialState = {
	product_id: "",
	product_name: "", // 组合名称
	product_describe: "", // 介绍
	product_combine_data: [],
	attachment: Array,
};

const mutations = {
	CONTENT_PRODUCT_NEWGROUP_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	// 编辑ID
	SET_GROUP_PRODUCT_ID(state, val) {
		state.product_id = val;
	},

	SET_GROUP_PRODATA(state, val) {
		state.product_combine_data = val;
	},
	SET_GROUP_DATE(state) {
		state.product_name = "";
		state.product_describe = "";
		state.product_combine_data = [];
		state.attachment = [];
	},
	SET_GROUP_EDIT_COST(state, val) {
		let i = val.num;
		let type = val.Type;
		let cost = val.cost;
		state.product_combine_data[i].cost_type = type;
		state.product_combine_data[i].cost = cost;
	},
	// 添加附件
	SET_GROUP_ATTACHMENT(state, val) {
		val.forEach(it => {
			const index = state.attachment.findIndex(item => {
				return item.attachment_url == it.attachment_url;
			});
			if (index == -1) {
				state.attachment.push(it);
			}
		});
	},
	// 设置产品组合的成
	SET_GROUP_SELECT_SKU(state, res) {
		let i = res.i;
		state.product_combine_data[i].sku_id = res.sukId;
		let v = state.product_combine_data[i].sku.find(el => {
			return el.sku_id == res.sukId;
		});
		state.product_combine_data[i].price = v.price;
		state.product_combine_data[i].price_unit = v.price_unit;
		state.product_combine_data[i].cost_type = v.cost_type;
		state.product_combine_data[i].cost = v.cost;
		state.product_combine_data[i].sku_id = res.sukId;
	},

	UPDATE_GROUP_ATTACHMENT(state, val) {
		state.attachment = val;
	},

	CLEAR_GROUP_COMPONENT(state) {
		state.product_combine_data = [];
	},
	SET_GROUP_PRODUCT_NAME(state, val) {
		state.product_name = val;
	},
	SET_GROUP_PRODUCT_DESCRIBE(state, val) {
		state.product_describe = val;
	},
	ADD_GROUP_PRODUCT(state, list) {
		if (state.product_combine_data.length > 0) {
			for (let x in state.product_combine_data) {
				let del = 0;
				// eslint-disable-next-line no-loop-func
				if (list.length == 0) {
					state.product_combine_data = [];
				} else {
					list.forEach(item => {
						if (state.product_combine_data[x].product_id == item.product_id) {
							del = 1;
						}
					});
				}
				if (del != 1) {
					state.product_combine_data.splice(x, 1);
					// state.attachment.splice(x, 1);
				}
			}
		}

		let com0 = {
			product_id: "", // 子产品id
			product_name: "", // 产品名称
			// price_quantity: "", // 数量
			price: "", // 价格
			price_unit: "", // 单位
			cost_type: "", // 成本类型
			cost: "", // 成本比例或固定成本
			sku_id: '',
			sku: [],
			has_sku: "",
			stuffId: '',
		};

		if (list.length > 0) {
			let i = state.product_combine_data.length;
			if (i == 0) {
				for (let item in list) {
					const com = { ...com0 };
					com.product_id = list[item].product_id;
					com.product_name = list[item].product_name;
					com.sku = list[item].sku;
					com.has_sku = list[item].has_sku;
					if (list[item].has_sku == 0) {
						com.price = list[item].sku[0].price;
						com.price_unit = list[item].sku[0].price_unit;
						com.cost_type = list[item].sku[0].cost_type;
						com.cost = list[item].sku[0].cost;
						com.sku_id = list[item].sku[0].sku_id;
					}

					state.product_combine_data.push(com);
					list[item].attachment.forEach(el => {
						state.attachment.push(el);
					});
				}
			} else {
				for (let item in list) {
					let add = 0;
					state.product_combine_data.forEach(ele => {
						if (list[item].product_id == ele.product_id) {
							add = 1;
						}
					});
					if (add != 1) {
						const com = { ...com0 };
						com.product_id = list[item].product_id;
						com.product_name = list[item].product_name;
						com.sku = list[item].sku;
						com.has_sku = list[item].has_sku;
						if (list[item].has_sku == 0) {
							com.price = list[item].sku[0].price;
							com.price_unit = list[item].sku[0].price_unit;
							com.cost_type = list[item].sku[0].cost_type;
							com.cost = list[item].sku[0].cost;
							com.sku_id = list[item].sku[0].sku_id;
						}
						state.product_combine_data.push(com);
						list[item].attachment.forEach(el => {
							state.attachment.push(el);
						});
					}
				}
			}
		}
	},
	DEL_GROUP_PRODUCT(state, val) {
		state.product_combine_data.splice(val, 1);
	},
	DEL_GROUP_EDIT_PRICE(state, val) {
		let i = val.i;
		let res = val.res;
		state.product_combine_data[i].price = res;
	},
	Cancel_GROUP_PRODUCT(state) {
		state.product_id = "";
		state.product_name = ""; // 组合名称
		state.product_describe = ""; // 介绍
		state.product_combine_data = [];
		state.attachment = [];
	}
};

export const contentProductNewgroup = {
	state: { ...initialState },
	mutations
};
