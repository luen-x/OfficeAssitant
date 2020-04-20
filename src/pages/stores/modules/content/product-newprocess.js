const initialState = {
	process: {
		process_id: "",
		process_name: "",
		describe: "",
		product_process_step: []
	}
};

const mutations = {
	CONTENT_PRODUCT_NEWPROCESS_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	// 编辑流程
	GET_PRODUCT_PROCESS_STEP(state, val) {
		state.process.product_process_step = val;
	},
	// 编辑流程Id
	GET_PRODUCT_PROCESS_ID(state, val) {
		state.process.process_id = val;
	},
	// 添加姓名
	SET_PROCESS_NAME(state, val) {
		state.process.process_name = val;
	},
	// 添加备注
	SET_DESCRIBE(state, val) {
		state.process.describe = val;
	},

	// 添加流程名称
	ADD_PROCESS(state, name) {
		state.process.product_process_step.push({
			step_name: name,
			sort: state.process.product_process_step.length - 0 + 1,
			step_id: state.process.product_process_step.length,
			product_component: [],
			product_component_num: 0
		});
	},
	CLEAR_PROCESS_COMPONENT(state, list) {
		let i = list.num;
		state.process.product_process_step[i].product_component = [];
	},
	// 添加步骤名称
	// 编辑步骤名字
	EDIT_STEP_NAME(state, res) {
		let num = res.num;
		state.process.product_process_step[num].step_name = res.input;
	},
	// 删除步骤
	DEL_PROCESS_STEP(state, i) {
		state.process.product_process_step.splice(i, 1);
	},
	// 修改推送
	SET_PROJECT_PROCESS_STEP_PUSH(state, res) {
		state.process.product_process_step[res.i].is_push = res.val;
	},
	// 移动步骤
	MOVE_PROCESS_STEP(state, i) {
		if (i > 0) {
			state.process.product_process_step[i].sort = i;
			state.process.product_process_step[i - 1].sort = i - 0 + 1;
			state.process.product_process_step[i] = state.process.product_process_step.splice(i - 1, 1, state.process.product_process_step[i])[0];
		}
	},
	// 删除元件名称
	DEl_STEP(state, res) {
		let num = res.num; // 当前流程
		let i = res.i; // 当前步骤
		state.process.product_process_step[num].product_component.splice(i, 1);
		state.process.product_process_step[num].product_component_num = state.process.product_process_step[num].product_component.length;
	},
	// 上移
	MOVE_PRO_STEP(state, res) {
		let num = res.num; // 当前流程
		let i = res.i; // 当前步骤
		if (i > 0) {
			state.process.product_process_step[num].product_component[i].sort = i;
			state.process.product_process_step[num].product_component[i - 1].sort = i - 0 + 1;
			state.process.product_process_step[num].product_component[i] = state.process.product_process_step[num].product_component.splice(
				i - 1,
				1,
				state.process.product_process_step[num].product_component[i]
			)[0];
		}
	},
	// 保存编辑流程
	SAVE_PRODUCT_PROCESS_STEP(state, res) {
		let i = res.num;
		let data = res.data;
		if (res.data.product_component.length > 0) {
			for (let n in res.data.product_component) {
				res.data.product_component[n].sort = n;
			}
		}
		state.process.product_process_step.splice(i, 1, data);
	},
	// 保存排序
	SET_PROCESS_STEP_SORT(state) {
		if (state.process.product_process_step.length > 0) {
			for (let n in state.process.product_process_step) {
				state.process.product_process_step[n].sort = n;
			}
		}
	},
	// 修改元件信息
	EDIT_STEP_ELEMENT(state, res) {
		let num = res.num; // 当前流程
		let i = res.i; // 当前步骤
		let data = res.data;
		state.process.product_process_step[num].product_component.splice(i, 1, data);
	},
	// 取消
	DEL_PROCESS(state) {
		state.process.process_id = "";
		state.process.process_name = "";
		state.process.describe = "";
		state.process.product_process_step = [];
	}
};

export const contentProductNewprocess = {
	state: { ...initialState },
	mutations
};
