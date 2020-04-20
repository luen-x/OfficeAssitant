const initialState = {
	list: [],
	isFetched: false
};

const flowInfo = [
	{
		title: '面试流程',
		intro: '面试流程信息，可进行面试人填写的面试记录表配置。',
		color: '#f39a58'
	},
	{
		title: '入职流程',
		intro: '入职流程信息，可进行上级填写的入职面谈单配置。',
		color: '#2e9df9'
	},
	{
		title: '转正流程',
		intro: '转正流程信息，包括申请人、审批人的配置以及申请单和面谈单的配置。',
		color: '#5dca4d'
	},
	{
		title: '转岗流程',
		intro: '转岗流程信息，包括申请人、审批人的配置以及申请单和面谈单的配置。',
		color: '#ec505b'
	},
	{
		title: '离职流程',
		intro: '离职流程信息，包括申请人、审批人的配置以及申请单和面谈单的配置。',
		color: '#505fec'
	}
];

const formatData = (data = []) => {
	return data.map((item, index) => {
		return {
			...item,
			...flowInfo[index]
		};
	});
};

const mutations = {
	HR_TOOL_WORKFLOW_GET_SUCCESS(state, { data, param }) {
		state.list = formatData(data);
		state.isFetched = true;
	},
	HR_TOOL_WORKFLOW_SAVE_POST_SUCCESS(state, { data, param }) {
		state.list = {
			...initialState.list
		};
		state.isFetched = false;
	}
};

export const hrToolWorkflow = {
	state: { ...initialState },
	mutations,
};
