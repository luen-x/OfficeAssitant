import { getLocationStr } from '../_common/util';
import { OverrideCustomerInfo } from '../_common/customer/override-customer-info';

const format = (arr, str) => {
	return (arr && arr[0] && arr[0].replace(str, '').trim()) || '-';
};

const getCompanyName = (text) => {
	if (text.includes('企查查')) {

		text = text.substr(text.indexOf('浏览量'), 300);
		let name = text.split(/\r?\n/)[1] || '';
		name = name.trim();
		const arr = name.match(/[\u4e00-\u9fa5()（）]+/g);
		if (arr) {
			return arr.join('');
		} else return name.trim();
	} else {
		text = text.substr(text.indexOf('浏览量'), 300);
		let name = text.split(/\r?\n/)[2] || '';
		// const end = name.indexOf('我要认证');
		// if (end > -1) {
		// 	name = name.substring(0, end);
		// }
		name = name.replace('我要认证', '').replace('下载报告', '').replace('风险监控', '');
		name = name.replace(/([0-9]+人)?已监控/, '');
		name = name.trim();
		const arr = name.match(/[\u4e00-\u9fa5()（）]+/g);
		if (arr) {
			return arr.join('');
		} else return name.trim();
		// text = text.substr(text.indexOf('VIP会员') || text.indexOf('百宝箱') || text.indexOf('合作通道'), 300);
	}

	// const names = text.match(/[\u4e00-\u9fa5a-zA-Z0-9()（）]+((公司)|(店)|(集团)|(股份))/g) || [];

	// return names[0] && names[0].name;

};
const getTel = (text) => {
	if (text.includes('企查查')) {
		const tels = text.match(/r?\n电话： [ ]?[0-9-*]+/g);
		return format(tels, '电话： ');
	} else {
		const tels = text.match(/\r?\n电话：[ ]?[0-9-*]+/g);
		// tels && tels[0].includes('400-871-6266') && (tels[0] = '');
		return format(tels, '电话：');
	}
};
const getEmail = (text) => {
	let emails;
	if (text.includes('企查查')) {
		emails = text.match(/邮箱： [A-Za-z0-9-.@_*]+/g);
	} else {
		emails = text.match(/邮箱：[A-Za-z0-9-.@_*]+/g);
	}
	
	emails && emails[0].includes('jubao@tianyancha.com') && (emails[0] = '');
	if (emails && emails[0]) {
		emails = emails[0].match(/.{1,80}@.{1,20}/g);
		if (emails[0]) {
			while (emails[0].length > 0 && emails[0].endsWith('.')) {
				emails[0] = emails[0].substr(0, emails[0].length - 1);	
			}
		}
	}
	return format(emails, '邮箱：');
	// if (text.includes('企查查')) {
	// 	let emails = text.match(/邮箱： [A-Za-z0-9-.@_*]+/g);
	// 	if (emails && emails[0]) {
	// 		emails = emails[0].match(/.{1,80}@.{1,20}/);
	// 	}
	// 	return format(emails, '邮箱： ');
	// } else {
	// 	let emails = text.match(/邮箱：[A-Za-z0-9-.@_*]+/g);
	// 	emails && emails[0].includes('jubao@tianyancha.com') && (emails[0] = '');
	// 	if (emails && emails[0]) {
	// 		emails = emails[0].match(/.{1,80}@.{1,20}/);
	// 		if (emails[0]) {
	// 			while (emails[0].length > 0 && emails[0].endsWith('.')) {
	// 				emails[0] = emails[0].substr(0, emails[0].length - 1);
					
	// 			}
	// 		}
	// 	}

	// 	return format(emails, '邮箱：');
	// }
};
const getPageUrl = (text) => {
	if (text.includes('企查查')) {
		const urls = text.match(/官网： [a-zA-Z0-9-._:/]+/g);
		// if (urls && urls[0] == '暂无') {
		// 	urls[0] = '';
		// }
		return format(urls, '官网： '); 
	} else {
		const urls = text.match(/网址：[a-zA-Z0-9-.:/]+/g);
		// if (urls && urls[0] == '暂无') {
		// 	urls[0] = '';
		// }
		return format(urls, '网址：');

	}

}; 
const getOwner = (text) => {
	if (text.includes('企查查')) {
		const names = text.match(/法定代表人\t\r?\n(\r?\n)?[\u4e00-\u9fa5a-zA-Z]+/g); // todo 经营者
		return format(names, /法定代表人\t\r?\n(\r?\n)?/);
	} else {
	// /法定代表人	企业架构图	股权结构图\r\n[\u4e00-\u9fa5a-zA-Z]{2,8}\r\n[\u4e00-\u9fa5a-zA-Z]{2,8}/
		const names = text.match(/法定代表人\t企业架构图\t股权结构图\r?\n[\u4e00-\u9fa5a-zA-Z]{1,10}\r?\n[\u4e00-\u9fa5a-zA-Z]{0,20}/g); 
		if (names && names[0]) {
			names[0] = names[0].replace('\r', '');
			let arr_ = names[0].split('\n');
			return arr_[arr_.length - 1];
		}
	// return names &&names[0] && names.split('\r\n')  // format(names,'法定代表人\t	企业架构图	股权结构图\r\n')
	} 
};

const getRegistMoney = (text) => {
	if (text.includes('企查查')) {
		const moneys = text.match(/注册资本\t[0-9]+([.][0-9]{1,2})?/g);
		return format(moneys, '注册资本');
	} else {
		const moneys = text.match(/注册资本\t\r?\n[0-9]+([.][0-9]{1,2})?/g);
		return format(moneys, '注册资本');
	}
};
const getActualMoney = (text) => {
	const moneys = text.match(/实缴资本\t[[0-9]+([.][0-9]{1,2})?/g);
	return format(moneys, '实缴资本\t');
};
const getCreateDate = (text) => { 
	if (text.includes('企查查')) {
		const date = text.match(/成立日期\t[年月日0-9-]+/g);
		return format(date, '成立日期\t');
	} else {
		const date = text.match(/成立日期\t\r?\n[年月日0-9-]+/g);
		return format(date, /成立日期\t\r?\n/);

	}
};
const getComStatus = (text) => {
	const names = text.match(/经营状态\t[\u4e00-\u9fa5a-zA-Z]+/g);
	names && names[0].includes('关联产品') && (names[0] = '');
	return format(names, '经营状态\t');

};
const getSocialCode = (text) => {
	const names = text.match(/统一社会信用代码\t[0-9a-zA-Z-]+/g);
	return format(names, '统一社会信用代码\t');
};
const getRegistCode = (text) => {
	let names = text.match(/注册号\t[0-9a-zA-Z-]+/g);
	return format(names, '注册号\t');

};
const getPersonCode = (text) => {
	let names = text.match(/纳税人识别号\t[0-9A-Z-]+/g);
	return format(names, '纳税人识别号\t');

};
const getOrgnizeCode = (text) => {
	let names = text.match(/组织机构代码\t[0-9A-Z-]+/g);
	return format(names, '组织机构代码\t');

};
const getComType = (text) => {
	if (text.includes('企查查')) {
		let names = text.match(/企业类型\t[\u4e00-\u9fa5()、]+/g);
		return format(names, '企业类型\t');
	} else {
		let names = text.match(/公司类型\t[\u4e00-\u9fa5()、]+/g);
		return format(names, '公司类型\t');
	}

};
const getIndustry = text => {
	if (text.includes('企查查')) { 
		let names = text.match(/所属行业\t[\u4e00-\u9fa5()、，,]+/g);
		return format(names, '所属行业\t');
	} else {
		let names = text.match(/行业\t[\u4e00-\u9fa5()]+/g);
		return format(names, '行业\t');
	}
};
const getSureDate = text => {
	let names = text.match(/核准日期\t[0-9-]+/g);
	return format(names, '核准日期\t');
};
const getUsedName = text => {
	let names = text.match(/曾用名\t[\u4e00-\u9fa5a-zA-Z（）()、， ]+/g);
	return format(names, '曾用名\t');
};
const getStaffNum = text => {
	let names = text.match(/人员规模\t[\u4e00-\u9fa50-9-]+人/g);
	return format(names, '人员规模\t');
};
const getAddress = text => {
	let names = text.match(/地址\t.+\r?\n/g);
	names && (names = names.map(i => i.replace('附近企业', '').replace('附近公司', '').replace('查看地图', '')));
	return format(names, '地址\t');
	// if (text.includes('企查查')) {
	// 	let names = text.match(/地址\t.+\r?\n/g);
	// 	names && (names = names.map(i => i.replace('附近企业', '')));
	// 	return format(names, '地址\t');
	// } else {
	// 	let names = text.match(/地址\t.+\r?\n/g);
	// 	// let names = text.match(/注册地址\t[\u4e00-\u9fa5a-zA-Z0-9（）()、，-,'"“”‘’]+/g);
	// 	names && (names = names.map(i => i.replace('附近公司', '')));
	// 	return format(names, '注册地址\t');
	// }
};
const getSignAddress = text => {
	let names = text.match(/登记机关\t.+\r?\n/g);
	names && (names = names.map(i => i.replace('监督管理局', '')));
	return format(names, '登记机关\t');
	// if (text.includes('企查查')) {
	// 	let names = text.match(/地址\t.+\r?\n/g);
	// 	names && (names = names.map(i => i.replace('附近企业', '')));
	// 	return format(names, '地址\t');
	// } else {
	// 	let names = text.match(/地址\t.+\r?\n/g);
	// 	// let names = text.match(/注册地址\t[\u4e00-\u9fa5a-zA-Z0-9（）()、，-,'"“”‘’]+/g);
	// 	names && (names = names.map(i => i.replace('附近公司', '')));
	// 	return format(names, '注册地址\t');
	// }
};
const getSaleField = text => {
	let names = text.match(/经营范围\t(\r?\n)?.+\r?\n/g);
	return format(names, '经营范围\t');
};
const getIntellectualRight = text => {
	let names = text.match(/知识产权[ ]?[0-9]{1,3}[+]?/g);
	return format(names, '知识产权');

};

export const getInfo = (text) => {
	return {
		company_name: getCompanyName(text),
		tel: getTel(text),
		email: getEmail(text),
		url: getPageUrl(text),
		customer_name: getOwner(text),
		capital: getRegistMoney(text),
		paid_in_capital: getActualMoney(text),
		establishment_date: getCreateDate(text),
		manage_state: getComStatus(text),
		credit_code: getSocialCode(text),
		registration_number: getRegistCode(text),
		taxpayer_number: getPersonCode(text),
		organization_code: getOrgnizeCode(text),
		company_type: getComType(text),
		industry: getIndustry(text),
		approval_date: getSureDate(text),
		used_name: getUsedName(text),
		scale: getStaffNum(text),
		address: getAddress(text),
		manage_range: getSaleField(text),
		sign_address: getSignAddress(text),
		intellectual_property_right: getIntellectualRight(text)
	};
};
const unCheckKeys = ['customer_name', 'tel', 'remarks']; // 不用比对的字段
const keyName = {
	company_name: '公司名称', // 公司名
	url: "官网", // 官网
	email: "邮箱", // email
	// "province": 110000, // 省code
	// "city": 110100, // 市code
	// "area": 110101, // 区code
	address: "详细地址", // 详细地址
	capital: '注册资本', // 注册资本
	paid_in_capital: '实缴资本', // 实缴资本
	manage_state: "经营状态", // 经营状态
	establishment_date: "成立日期", // 成立日期
	approval_date: "核准日期", // 核准日期
	credit_code: "社会信用代码", // 
	taxpayer_number: "纳税人识别号", // 纳税人识别号
	registration_number: "注册号", // 注册号
	organization_code: "组织机构代码", // 组织机构代码
	company_type: "企业类型", // 企业类型
	industry: "所属行业", // 所属行业
	scale: '人员规模',
	// scale_min: 100, // 人员规模（小）
	// scale_max: 999, // 人员规模（大）
	used_name: "曾用名", // 曾用名
	manage_range: "经营范围", // 经营范围
	tel: '电话',
	// update_type: 1,
	location: '地区',
	intellectual_property_right: '知识产权'

};
const getNeedDiffKeys = (editConfig, customerType) => {
	const config = customerType == 1 ? editConfig.private_fields : editConfig.normal_fields;
	const result = [];	
	for (let key in config) {
		if (!unCheckKeys.includes(key) && config[key].show) {
			result.push(key);
		}
	}

	return result;
};
// 比对数据获得最终的表单数据
export const getCustomerFormData = async ({
	newData, // 抓取到的数据，可以提交给后端的数据 ，， 是最终要输出的表单数据
	oldData, // 后端直接返回的表单数据，未处理的数据
	editConfig, // 客户信息编辑的配置
	customerType, // 客户类型 1 - 意向，关联，成交， 2-公海，黑名单
	region3, // 三级地址
}) => {
	newData = JSON.parse(JSON.stringify(newData));
	oldData = JSON.parse(JSON.stringify(oldData));
	const needDiffKeys = getNeedDiffKeys(editConfig, customerType);
	const diffInfo = [];
	needDiffKeys.forEach(key => {
		if (key == 'scale') {
			if (oldData.scale_max == null && oldData.scale_min == null) {
				// 如果旧数据没有，直接用新数据
				return;
			} else if (newData.scale_max == null && newData.scale_min == null) {
				// 如果旧数据有数据，新数据没数据，则使用旧数据
				newData.scale_max = oldData.scale_max;
				newData.scale_min = oldData.scale_min;
			} else if (oldData.scale_max !== newData.scale_max || oldData.scale_min !== newData.scale_min) {
				// 如果新旧数据都有值，比对是否存在不同的,如果存在不同则推入diffInfo
				let oldDataStr;
				if (oldData.scale_max && oldData.scale_min) {
					oldDataStr = oldData.scale_min + '-' + oldData.scale_max + '人';
				} else if (oldData.scale_min) {
					oldDataStr = '大于' + oldData.scale_min + '人';
				} else if (oldData.scale_max) {
					oldDataStr = '小于' + oldData.scale_max + '人';
				} else {
					oldDataStr = '-';
				}
				diffInfo.push({
					key,
					label: keyName[key],
					oldData: [oldData.scale_min, oldData.scale_max],
					oldDataStr
				});
			}
		} else if (key == 'location') {
			if (!oldData.province && !oldData.city && !oldData.area) {
				// 如果旧数据没有，直接用新数据
				return;
			} else if (!newData.province && !newData.city && !newData.area) {
				// 如果旧数据有数据，新数据没数据，则使用旧数据
				newData.province = oldData.province;
				newData.city = oldData.city;
				newData.area = oldData.area;
			} else if (oldData.province !== newData.province || oldData.city !== newData.city || oldData.area !== newData.area) {
				let oldDataStr = getLocationStr(region3, [oldData.province, oldData.city, oldData.area]);
				console.log('sss', [oldData.province, oldData.city, oldData.area], oldDataStr);
				diffInfo.push({
					key,
					label: keyName[key],
					oldData: [oldData.province, oldData.city, oldData.area],
					oldDataStr
				});	
			}
		} else if (oldData[key] != newData[key]) {
			// 如果字符串数据不同
			if (!oldData[key]) {
				// 如果旧数据没值直接用新数据
				return;
			} else if (!newData[key]) {
				// 如果新数据没有值，用旧值
				newData[key] = oldData[key];
			} else {
				// 如果都有值
				diffInfo.push({
					key,
					label: keyName[key],
					oldData: oldData[key],
				});
			}
		}
	});
	if (diffInfo.length) {
		return OverrideCustomerInfo.popup({
			data: diffInfo
		}).then(keys => {
		// 返回的需要覆盖的key，需要将不需要覆盖的key用oldData替换
			diffInfo.forEach(item => {
				if (!keys.includes(item.key)) {
					if (item.key == 'scale') {
						newData.scale_min = item.oldData[0];
						newData.scale_max = item.oldData[1];
					} else if (item.key == 'location') {
						newData.province = item.oldData[0];
						newData.city = item.oldData[1];
						newData.area = item.oldData[2];
					} else {
						newData[item.key] = item.oldData;
					}
					
				}
			});
			return newData;
		}).catch(e => e && console.error(e));
	} else {
		return newData;
	}


		

};








