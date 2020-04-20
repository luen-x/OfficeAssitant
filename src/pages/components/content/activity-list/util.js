const CUSTOMWE_TYPE = {
	'1': '已合作客户',
	'2': '自己的未合作客户',
	'3': '非自己未合作客户'
};
export const getActivityStatus = (type) => {
	switch (type) {
		case 1:  
			return '待报名';
		case 2:  
			return '报名中';
		case 3:  
			return '报名结束';
		case 4:  
			return '进行中';
		case 5:  
			return '已结束';
		default: 
			// throw Error('类型错误');
			return; 
	}
};

export const switchCustomerType = string => {
	const result = [];
	string.split(',').forEach(v => result.push(CUSTOMWE_TYPE[v]));	
	return 	result.join(',');		
};