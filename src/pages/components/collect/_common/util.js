export const addBrowseNum = (caseId) => {
	app.$request({
		url: "_COLLECT_MAIN_COLLECT_ADD_BROWSE_NUM_POST",
		type: "POST",
		param: {
			case_id: caseId
		},
		loading: false,
	}).then(res => {
	
	}).catch((res) => {
		console.error(res);
		// app.$Message.error(res.msg);
	});

}; 