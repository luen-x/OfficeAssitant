const initialState = {
	data: "",
	// 客户信息
	process_id: "",
	process_name: "",
	describe: "",
	product_component: []
};

const mutations = {
	CONTENT_PRODUCT_NEWCUSTOMER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	// 取消数据
	SET_CUS_DATA(state, val) {
		state.process_id = "";
		state.process_name = "";
		state.describe = "";
		state.product_component = [];
	},
	// 设置id
	SET_CUSTOMER_PROCESS_ID(state, val) {
		state.process_id = val;
	},
	//
	ADD_CUS_COMPONENT(state, list) {
		if (state.product_component.length > 0) {
			for (let x in state.product_component) {
				let del = 0;
				// eslint-disable-next-line no-loop-func
				if (list.length == 0) {
					state.product_component = [];
				} else {
					list.forEach(item => {
						if (state.product_component[x].component_field == item.field) {
							del = 1;
						}
					});
				}
				if (del != 1) {
					state.product_component.splice(x, 1);
				}
			}
		}
		let com0 = {
			component_label: "企业地址", // 元件名称
			component_field: "boss_name", // 元件字段
			component_type: "2", // 元件类型
			sort: "1", // 排序
			placeholder: "", // 元件提示
			input_limit: 20, // 输入限制 最大值
			check_type: 1, //  选择类型 1单选  2多选
			has_other: 0, // 有无其他 0无 1 有
			time_type: 1, // 时间类型 1固定时间 2 起始时间
			data: [], // 元件限制内容（存json数据）
			required: 1, // 是否必填  1-必填，0-选填
			upload_limit: 10,
			component_type_name: "" // 元件类型名称
		};
		if (list.length > 0) {
			let i = state.product_component.length + 1;
			if (i == 0) {
				for (let item in list) {
					const com = { ...com0 };
					com.component_label = list[item].label;
					com.component_field = list[item].field;
					com.component_type = list[item].type;
					com.component_type_name = list[item].type_name;
					com.data = list[item].default.data;
					com.error_tip = list[item].default.error_tip;
					com.input_limit = list[item].default.input_limit;
					com.placeholder = list[item].default.placeholder;
					com.required = list[item].default.required;
					com.check_type = list[item].default.check_type;
					com.has_other = list[item].default.has_other;
					com.time_type = list[item].default.time_type;
					com.has_other = list[item].default.has_other;
					com.check_type = list[item].default.check_type;
					com.time_type = list[item].default.time_type;
					com.upload_limit = list[item].default.upload_limit;
					com.upload_example = list[item].default.upload_example;
					com.sort = i++;
					state.product_component.push(com);
				}
			} else {
				for (let item in list) {
					let add = 0;
					state.product_component.forEach(ele => {
						if (list[item].field == ele.component_field) {
							add = 1;
						}
					});
					if (add != 1) {
						const com = { ...com0 };
						com.component_label = list[item].label;
						com.component_field = list[item].field;
						com.component_type = list[item].type;
						com.component_type_name = list[item].type_name;
						com.data = list[item].default.data;
						com.error_tip = list[item].default.error_tip;
						com.input_limit = list[item].default.input_limit;
						com.placeholder = list[item].default.placeholder;
						com.required = list[item].default.required;
						com.has_other = list[item].default.has_other;
						com.check_type = list[item].default.check_type;
						com.time_type = list[item].default.time_type;
						com.upload_limit = list[item].default.upload_limit;
						com.upload_example = list[item].default.upload_example;
						com.sort = i++;
						state.product_component.push(com);
					}
				}
			}
		}

	},
	SET_CUS_PROCESS_NAME(state, val) {
		state.process_name = val;
	},
	SET_CUS_DESCRIBE(state, val) {
		state.describe = val;
	},

	SET_CUS_COMPONENT(state, val) {
		state.product_component = val;
	},
	// 删除
	DEL_CUS_COMPONENT(state, val) {
		state.product_component.splice(val, 1);
	},
	// 清除
	clear_CUS_COMPONENT(state, val) {
		state.product_component = [];
	},
	// 上移
	MOVE_CUS_COMPONENT(state, val) {
		if (val > 0) {
			state.product_component[val].sort = val;
			state.product_component[val - 1].sort = val + 1;
			state.product_component[val] = state.product_component.splice(val - 1, 1, state.product_component[val])[0];
			return state.product_component;
		}
	},
	// 修改
	EDIT_CUS_COMPONENT(state, com) {
		let v = com.num;
		let data = com.data;
		state.product_component.splice(v, 1, data);
	},
	// 排序
	SET_NEWCUSTOMER_COM_SORT(state) {
		if (state.product_component.length > 0) {
			for (let n in state.product_component) {
				state.product_component[n].sort = n;
			}
		}

	}
};

export const contentProductNewcustomer = {
	state: { ...initialState },
	mutations
};
