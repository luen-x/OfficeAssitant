import API_ROOT from '@stores/apis/root';
import { initTreeData } from '@utils/utils';
import { createService, serviceObj, serviceCompare } from './utils';

const formatSubject = (arr) => {
	const target = arr.map(it => {
		const result = {
			label: it.subject_name || it.stage_name || it.echelon_name,
			value: it.subject_id || it.stage_id || it.echelon_id,
			children: [...(it.child || []), ...(it.stage || []), ...(it.subject || [])]
		};
		if (result.children.length > 0) {
			result.children = formatSubject(result.children);
		} else {
			delete result.children;
		}
		return result;
	});
	return target;

};
const formatStage = (arr, parent) => {
	const target = arr.map(it => {
		const result = {
			title: it.stage_name || it.echelon_name,
			value: it.stage_id ? 'stage-' + it.stage_id : it.echelon_id,
			checked: false,
			children: [...(it.child || []), ...(it.stage || [])],
			parent_id: it.stage_id ? parent.echelon_id : ''
		};
		if (result.children.length > 0) {
			result.children = formatStage(result.children, it);
		} else {
			delete result.children;
		}
		return result;
	});
	return target;

};

const formatPlan = (arr) => {
	const target = arr.map(it => {
		const result = {
			title: it.echelon_name,
			label: it.echelon_name,
			value: it.echelon_id,
			checked: false,
			children: [...(it.child || [])],

		};
		if (result.children.length > 0) {
			result.children = formatPlan(result.children);
		} else {
			delete result.children;
		}
		return result;
	});
	return target;

};
const formatPlanCa = (arr) => {
	arr.forEach(echelon => {
		if (echelon.child.length) {
			echelon.children = echelon.child;
			echelon.children.forEach(plan => {
				plan.label = plan.echelon_name;
				plan.value = plan.echelon_id;
			});
		} else {
			echelon.disabled = true;
		}
		echelon.label = echelon.echelon_name;
		echelon.value = echelon.echelon_id;
	});
	return arr;
};
const formatStageCa = (arr) => {
	arr.forEach(echelon => {
		if (echelon.child.length) {
			echelon.children = echelon.child;
			echelon.children.forEach(plan => {
				if (plan.stage.length) {
					plan.children = plan.stage;
					plan.children.forEach(stage => {
						stage.label = stage.stage_name;
						stage.value = stage.stage_id;
					});
				} else {
					plan.disabled = true;
				}
				plan.label = plan.echelon_name;
				plan.value = plan.echelon_id;
			});
		} else {
			echelon.disabled = true;
		}
		echelon.label = echelon.echelon_name;
		echelon.value = echelon.echelon_id;
	});
	return arr;
};
const formatDepart = (arr) => {
	const depart = arr.map(it => {
		const result = { value: it.depart_id, title: it.depart_name, checked: false };
		if (it.children && it.children.length > 0) {
			result.children = formatDepart(it.children);
		}
		return result;
	});
	return depart;

};
export const services = {
	// 公司下的所有部门
	...createService({
		key: "departAll",
		url: '_HR_DEPART_ALL_GET',
		parser: (data) => initTreeData(data, 'depart_id', 'depart_name', 'child')
	}),
	// 公司下的所有部门不需要token验证
	...createService({
		key: "noTokenDepartAll",
		url: '_HR_FORM_ALL_DEPARTS_GET',
		parser: (data) => initTreeData(data, 'depart_id', 'depart_name', 'child')
	}),
	// 除了营销中心别的部门只到二级部门
	...createService({
		key: "departPart",
		url: '_HR_DEPART_PART_GET',
		parser: (data) => initTreeData(data, 'depart_id', 'depart_name', 'child')
	}),

	// 我的下级部门
	...createService({
		key: "departMy",
		url: "_HR_DEPART_ALL_GET",
		parser: data => {
			if (Array.isArray(data)) {
				return initTreeData(data, "depart_id", "depart_name", "child");
			} else {
				return [];
			}
		},
		getParam: (instance) => ({ depart_id: instance.$global.staff.depart_id })
	}),
	// 业务跟踪-员工数据部门
	...createService({
		key: "businessDepart",
		url: "_HR_BUSINESS_DEPART_BY_STAFF_ID_GET",
		parser: data => {
			if (Array.isArray(data)) {
				return initTreeData(data, "depart_id", "depart_name", "child");
			} else {
				return [];
			}
		},
		getParam: (instance) => ({ staff_id: instance.$global.staff.staff_id })
	}),
	// 部门下的职位列表
	...createService({
		key: "departPosition",
		url: '_HR_DEPART_POSITION_GET',
		parser: (data) => initTreeData(initTreeData(data, 'depart_id', 'depart_name', 'positions'), 'position_id', 'position_name')
	}),
	// 部门下的全部职位列表
	...createService({
		key: "allPosition",
		url: '_HR_EMPLOYEE_SUMMARY_RESUME_POSITION_GET',
	}),
	// 招聘专用-部门下的职位列表
	...createService({
		key: "recruitDePosition",
		url: '_HR_DEPART_POSITION_GET',
		getParam: () => ({ is_applicant_use: 1 }),
		parser: (data) => initTreeData(initTreeData(data, 'depart_id', 'depart_name', 'positions'), 'position_id', 'position_name')
	}),
	// 招聘专用-部门下的全部职位列表
	...createService({
		key: "recruitAllPosition",
		url: '_HR_EMPLOYEE_SUMMARY_RESUME_POSITION_GET',
		getParam: () => ({ is_applicant_use: 1 })
	}),
	// 血型
	...createService({
		key: "bloodArray",
		url: '_HR_EMPLOYEE_SUMMARY_RESUME_BLOOD_GET'
	}),
	// 星座
	...createService({
		key: "constellation",
		url: '_HR_STAFF_CONSTELLATION_GET'
	}),
	// 民族
	...createService({
		key: "nations",
		url: '_HR_STAFF_NATIONS_GET',
		parser: (data) => initTreeData(data, 'nation_id', 'nation_name')
	}),
	...createService({
		key: "politics",
		url: '_HR_EMPLOYEE_SUMMARY_DETAILS_POLITICS_STATUS_GET',
		parser: (data) => initTreeData(data, 'value', 'label')
	}),

	// 学历
	...createService({
		key: "education",
		url: '_HR_STAFF_EDUCATION_GET',
		parser: (data) => initTreeData(data, 'status', 'name')
	}),
	// 技能等级
	...createService({
		key: "skillLevel",
		url: '_HR_STAFF_SKILL_LEVEL_GET'
	}),
	// 前台印象
	...createService({
		key: "impression",
		url: '_HR_STAFF_IMPRESSION_GET'
	}),
	// 角色
	...createService({
		key: "roleList",
		url: '_AUTH_ROLE_LIST_GET'
	}),
	// 户口
	...createService({
		key: "residence",
		url: '_HR_STAFF_RESIDENCE_GET'
	}),
	// 招聘渠道
	...createService({
		key: "ditches",
		url: '_HR_STAFF_DITCHES_GET',
		parser: (data) => initTreeData(data, 'status', 'name')
	}),
	// 试用期时长
	...createService({
		key: "signTime",
		url: '_HR_STAFF_PROBATION_SELECT_GET'
	}),
	// 底薪设置
	...createService({
		key: "baseSalary",
		url: '_HR_STAFF_BASE_SALARY_GET'
	}),
	// 提成设置
	...createService({
		key: "rateCase",
		url: '_HR_STAFF_RATE_CASE_GET'
	}),
	// 合同公司
	...createService({
		key: "contractCompany",
		url: '_HR_STAFF_CONTRACT_COMPANY_GET'
	}),
	// 社保公司
	...createService({
		key: "socialContractCompany",
		url: '_HR_STAFF_SOCIAL_CONTRACT_COMPANY_GET'
	}),
	// 底薪设置列表
	...createService({
		key: "baseSalaryList",
		url: '_HR_EMPLOYEE_SUMMARY_DETAILS_BASIC_SALARY_GET'
	}),
	// 提成设置列表
	...createService({
		key: "rateCaseList",
		url: '_HR_EMPLOYEE_SUMMARY_DETAILS_RATE_CASE_GET'
	}),
	// 户口性质下拉选择
	...createService({
		key: "residenceList",
		url: '_HR_EMPLOYEE_SUMMARY_DETAILS_RESIDENCE_GET'
	}),
	// 淘汰、离开类型
	...createService({
		key: "passDeparture",
		url: '_HR_PASS_TYPES_GET',
		parser: (data) => initTreeData(data, 'value', 'label')
	}),
	// 淘汰原因
	...createService({
		key: "passTypes",
		url: '_HR_PASS_REMARKS_TYPE_GET',
		parser: (data) => initTreeData(data, 'value', 'label')
	}),
	// 总监指派查看自己的部门
	...createService({
		key: "selfDepart",
		url: '_HR_RECRUIT_SCHOOL_SCENARIO_DEPART_GET',
		parser: (data) => initTreeData(data, 'depart_id', 'depart_name', 'child')
	}),
	// 招聘会年份
	...createService({
		key: "meetingYear",
		url: '_HR_RECRUIT_SCHOOL_JOBFAIR_YEAR_GET'
	}),
	// 招聘会季节
	...createService({
		key: "seasonType",
		url: '_HR_RECRUIT_SCHOOL_SEASON_TYPE_GET'
	}),
	// 人才来源
	...createService({
		key: "talentResource",
		url: '_HR_ACADEMY_TRANSFER_TALENT_RESOURCE_GET'
	}),
	// 晋升结果
	...createService({
		key: "upResult",
		url: '_HR_EMPLOYEE_UP_RESULT_GET'
	}),
	// 工龄类型下拉数据
	...createService({
		key: "standTypes",
		url: '_HR_EMPLOYEE_UP_STABDING_TYPES_GET'
	}),
	// 部门工龄类型下拉数据
	...createService({
		key: "departStandindTypes",
		url: '_HR_EMPLOYEE_UP_DEPART_STABDING_TYPES_GET'
	}),
	// 排名范围下拉数据
	...createService({
		key: "departRanking",
		url: '_HR_EMPLOYEE_UP_DEPART_RANKING_GET'
	}),
	// 积分学分周期下拉数据
	...createService({
		key: "statPeriods",
		url: '_HR_EMPLOYEE_UP_STAT_PERIODS_GET'
	}),
	// 课题树状
	...createService({
		key: "subjectTree",
		url: "_HR_TRAIN_ECHELON_SHOW_ECHELON_LIST_GET",
		parser: formatSubject
	}),
	// 课题树状-到阶段
	...createService({
		key: "stageTree",
		url: "_HR_TRAIN_ECHELON_SHOW_ECHELON_LIST_GET",
		parser: formatStage
	}),
	// 课题树状-到计划
	...createService({
		key: "planTree",
		url: "_HR_TRAIN_ECHELON_SHOW_ECHELON_LIST_GET",
		parser: formatPlan
	}),
	// 课题树状-到计划-级联-不带岗前培训
	...createService({
		key: "planCaTree",
		url: "_HR_TRAIN_ECHELON_SHOW_ECHELON_FIRST_LIST_GET",
		parser: formatPlanCa
	}),
	// 课题树状-到计划-级联-带岗前培训
	...createService({
		key: "planCaTreeAll",
		url: "_HR_TRAIN_ECHELON_SHOW_ECHELON_LIST_GET",
		parser: formatPlanCa
	}),
	// 课题树状-到课题-级联-带岗前培训
	...createService({
		key: "stageCaTreeAll",
		url: "_HR_TRAIN_ECHELON_SHOW_ECHELON_LIST_GET",
		parser: formatStageCa
	}),
	...createService({
		key: "echelon",
		url: "_HR_ACADEMY_ECHELON_LIST",
	}),
	// 所有部门 title value
	...createService({
		key: "departAllTree",
		url: "_HR_DEPART_ALL_GET",
		parser: formatDepart
	}),
	// 素材类型
	...createService({
		key: "materialType",
		url: "_HR_ACADEMY_COURSE_MATERIAL_TYPE_GET",
	}),
	// 素材类目-人事-不受权限控制
	...createService({
		key: "hrMaterialCategory",
		url: "_HR_ACADEMY_COURSE_MATERIAL_CATEGORY_GET",
		param: { is_control_role: 0 },
		parser: (data) => initTreeData(data, 'category_id', 'category_name')
	}),
	// 素材类目-销售-受权限控制
	...createService({
		key: "saleMaterialCategory",
		url: "_HR_ACADEMY_COURSE_MATERIAL_CATEGORY_GET",
		param: { is_control_role: 1 },
		parser: (data) => initTreeData(data, 'category_id', 'category_name')
	}),
	// 离职主因
	...createService({
		key: "leaveReason",
		url: '_HR_LEAVE_REASON_GET',
		parser: (data) => initTreeData(data, 'leave_reason', 'reason')
	}),
	// 离职类型
	...createService({
		key: "leaveType",
		url: '_HR_LEAVE_TYPE_GET',
		parser: (data) => initTreeData(data, 'leave_type', 'type')
	}),
	// 	一级部门id
	...createService({
		key: "topDepartId",
		url: '_HR_HUMAN_FIRST_DEPART_ID_GET',
	}),
};


/**
 * 获取公司一级部门
 */
export const stairDepart = (opts) => {
	let { param = {} } = opts || {};
	return {
		created() {
			this.loadStairDepart();
		},
		methods: {
			loadStairDepart() {
				this.request({
					url: 'HR_STAIR_DEPART_GET',
					type: 'GET',
					param
				}).then((res) => {
					
				}).catch((error) => {
					console.error(error);
				});
			}
		}
	};
};

/**
 * 获取晋级体系
 */
export const promoSys = {
	created() {
		// this.loadPromoSys();
	},
	methods: {
		loadPromoSys(id, type) {
			this.request({
				url: 'HR_SALARY_RANK_SYS_GET',
				type: 'GET',
				param: {
					depart_id: id,
					type
				},
				loading: false
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
			});
		}
	}
};

export const createSearch = (opts = {}) => {
	const {
		key,
	} = opts;
	const strFn = key.charAt(0).toUpperCase() + key.slice(1);
	const loadKey = `load${strFn}`;

	return {
		data() {
			return {
				[`${key}Loading`]: false,
				[`${key}Data`]: [],
			};
		},
		mounted() {
			this[`${key}Mounted`] = true;
		},
		methods: {
			[loadKey](query) {
				if (this[`${key}Mounted`]) {
					query = String(this[key]) || query;
				}

				if (query !== '') {
					this[`${key}Loading`] = true;
					this.$request({
						url: (key && key === 'introducer') ? API_ROOT._HR_INTRODUCER_GET : API_ROOT._HR_STAFF_GET,
						type: 'GET',
						param: {
							name: query.trim().replace(/\(.*?\)/g, '').replace(/（.*?）/g, '')
						},
						loading: false
					}).then((res) => {
						this[`${key}Loading`] = false;
						this[`${key}Data`] = initTreeData(res.data, 'value', 'text');
					}).catch((error) => {
						this[`${key}Loading`] = false;
					}).finally(() => {
						this[`${key}Mounted`] = false;
					});
				} else {
					this[`${key}Data`] = [];
				}
			}
		}
	};
};

export const selectCourse = {
	data() {
		return {
			courseData: [],
		};
	},
	created() {
		this.loadCourse();
	},
	methods: {
		loadCourse() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_PROJECT_COURSE_SEARCH_GET,
				type: 'GET',
				param: {
					project_id: this.project_id,
				},
				loading: false
			}).then((res) => {
				this.courseData = res.data;
				
			}).catch((error) => {
				console.error(error);
			});
		}
	}
};

/**
 * 远程搜索获取项目下课程
 */
export const searchCourse = {
	data() {
		return {
			courseLoading: false,
			courseData: [],
		};
	},
	mounted() {
		this.isMounted = true;
	},
	methods: {
		loadCourse(query) {
			if (this.isMounted) {
				query = this.search	 || query;
			}
			if (query !== '') {
				this.courseLoading = true;
				this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_PROJECT_COURSE_SEARCH_GET,
					type: 'GET',
					param: {
						project_id: this.project_id,
						search: query.trim().replace(/\(.*?\)/g, '').replace(/（.*?）/g, '')
					},
					loading: false
				}).then((res) => {
					this.courseLoading = false;
					this.courseData = initTreeData(res.data, 'value', 'text');
				}).catch((error) => {
					this.courseLoading = false;
					console.error(error);
				}).finally(() => {
					this.isMounted = false;
				});
			} else {
				this.courseData = [];
			}

		},
	}
};

/**
 * 搜索人员
 */
export const searchStaff = {
	data() {
		return {
			staffLoading: false,
			staffData: [],
		};
	},
	mounted() {
		this.isMounted = true;
	},
	methods: {
		loadStaff(query) {
			if (this.isMounted) {
				query = this.initName || query;
			}
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._HR_STAFF_GET,
					type: 'GET',
					param: {
						name: query && query.trim().replace(/\(.*?\)/g, '').replace(/（.*?）/g, '')
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'value', 'text');
				}).catch((error) => {
					this.staffLoading = false;
					console.error(error);
				}).finally(() => {
					this.isMounted = false;
				});
			} else {
				this.staffData = [];
			}

		}
	}
};

/**
 * 搜索人员
 */
export const searchTechStaff = {
	data() {
		return {
			staffTechLoading: false,
			staffTechData: [],
		};
	},
	mounted() {
		this.isMounted = true;
	},
	methods: {
		loadTechStaff(query) {
			if (this.isMounted) {
				query = this.initName || query;
			}
			if (query !== '') {
				this.staffTechLoading = true;
				this.$request({
					url: API_ROOT._WORKSHEET_CONTROL_TECH_STAFF_GET,
					type: 'GET',
					param: {
						search: query && query.trim().replace(/\(.*?\)/g, '').replace(/（.*?）/g, '')
					},
					loading: false
				}).then((res) => {
					this.staffTechLoading = false;
					this.staffTechData = initTreeData(res.data, 'value', 'text');
				}).catch((error) => {
					this.staffTechLoading = false;
					console.error(error);
				}).finally(() => {
					this.isMounted = false;
				});
			} else {
				this.staffTechData = [];
			}

		}
	}
};

/**
 * 搜索公司
 */
export const searchCompany = {
	data() {
		return {
			companyLoading: false,
			companyData: [],
		};
	},
	mounted() {
		this.isMounted = true;
	},
	methods: {
		loadCompany(query) {
			if (this.isMounted) {
				query = this.initName || query;
			}
			if (query !== '') {
				this.companyLoading = true;
				this.$request({
					url: API_ROOT._WORKSHEET_CONTROL_COMPANY_BUG_GET,
					type: 'GET',
					param: {
						keyword: query && query.trim().replace(/\(.*?\)/g, '').replace(/（.*?）/g, '')
					},
					loading: false
				}).then((res) => {
					this.companyLoading = false;
					this.companyData = initTreeData(res.data, 'value', 'text');
				}).catch((error) => {
					this.companyLoading = false;
					console.error(error);
				}).finally(() => {
					this.isMounted = false;
				});
			} else {
				this.companyData = [];
			}

		}
	}
};

/**
 * 搜索课程
 */
export const searchCourseName = {
	data() {
		return {
			courseLoading: false,
			courseData: [],
		};
	},
	mounted() {
		this.isMounted = true;
	},
	methods: {
		loadCourse(query) {
			if (this.isMounted) {
				query = this.initName || query;
			}
			if (query !== '') {
				this.courseLoading = true;
				this.$request({
					url: API_ROOT._ACADEMY_SUPPORT_COURSE_NAME_GET,
					type: 'POST',
					param: {
						course_name: query && query.trim().replace(/\(.*?\)/g, '').replace(/（.*?）/g, '')
					},
					loading: false
				}).then((res) => {
					this.courseLoading = false;
					this.courseData = initTreeData(res.data, 'course_id', 'course_name');
				}).catch((error) => {
					this.courseLoading = false;
					console.error(error);
				}).finally(() => {
					this.isMounted = false;
				});
			} else {
				this.courseData = [];
			}

		}
	}
};

/**
 * 搜索招聘会
 */
export const searchMeeting = {
	data() {
		return {
			meetingLoading: false,
			meetingData: [],
		};
	},
	methods: {
		loadMeeting(query) {
			if (query !== '') {
				this.meetingLoading = true;
				this.$request({
					url: API_ROOT._HR_RECRUIT_SCHOOL_SUMMARY_SEARCH_MEETING_POST,
					type: 'GET',
					param: {
						search: query.trim()
					},
					loading: false
				}).then((res) => {
					this.meetingLoading = false;
					this.meetingData = initTreeData(res.data, 'college_id', 'college');
				}).catch((error) => {
					this.meetingLoading = false;
				});
			} else {
				this.meetingData = [];
			}

		}
	}
};

/**
 * 根据姓名，手机号搜索员工
 */
export const staffByNameOrPhone = {
	data() {
		return {
			staffLoading: false,
			staffData: [],
		};
	},
	methods: {
		loadStaff(query) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._HR_NAME_OR_PHONE_STAFF_GET,
					type: 'GET',
					param: {
						search: query.trim()
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				}).catch((error) => {
					this.staffLoading = false;
				});
			} else {
				this.staffData = [];
			}

		}
	}
};

/**
 * 根据姓名，手机号搜索员工
 */
export const staffByMutiTerm = {
	data() {
		return {
			staffLoading: false,
			staffData: [],
		};
	},
	methods: {
		loadStaff(query) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._HR_MUTI_TERM_STAFF_GET,
					type: 'GET',
					param: {
						search: query.trim()
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				}).catch((error) => {
					this.staffLoading = false;
				});
			} else {
				this.staffData = [];
			}

		}
	}
};

/**
 * 根据姓名，手机号搜索包含离职的员工
 */
export const staffByRemove = {
	data() {
		return {
			staffLoading: false,
			staffData: [],
		};
	},
	methods: {
		loadStaff(query) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._HR_MUTI_TERM_STAFF_GET,
					type: 'GET',
					param: {
						search: query.trim(),
						type: 2
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				}).catch((error) => {
					this.staffLoading = false;
				});
			} else {
				this.staffData = [];
			}

		}
	}
};

/**
 * 根据姓名，部门搜索不包含离职的员工
 */
export const staffByNormal = {
	data() {
		return {
			staffNormalLoading: false,
			staffNormalData: [],
		};
	},
	methods: {
		loadNormalStaff(query) {
			if (query !== '') {
				this.staffNormalLoading = true;
				this.$request({
					url: API_ROOT._HR_MUTI_TERM_STAFF_DEPART_GET,
					type: 'GET',
					param: {
						search: query.trim(),
					},
					loading: false
				}).then((res) => {
					this.staffNormalLoading = false;
					this.staffNormalData = initTreeData(res.data, 'staff_id', 'staff_name');
				}).catch((error) => {
					this.staffNormalLoading = false;
				});
			} else {
				this.staffNormalData = [];
			}

		}
	}
};


export const remoteStaffByMutiTerm = {
	data() {
		return {
			staffLoading: false,
			staffData: [],
		};
	},
	methods: {
		loadStaff(query) {
			this.staffLoading = true;
			this.$request({
				url: API_ROOT._HR_MUTI_TERM_STAFF_GET,
				type: 'GET',
				param: {
					search: (query && query.trim()) || ''
				},
				loading: false
			}).then((res) => {
				this.staffLoading = false;
				this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
			}).catch((error) => {
				this.staffLoading = false;
			});
		}
	}
};

export const pkStaffByMutiTerm = {
	data() {
		return {
			staffLoading: false,
			staffData: [],
		};
	},
	methods: {
		loadStaff(query) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._HR_MUTI_TERM_STAFF_DEPART_GET,
					type: 'GET',
					param: {
						search: query.trim(),
						type: 2
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				}).catch((error) => {
					this.staffLoading = false;
				});
			} else {
				this.staffData = [];
			}

		}
	}
};
export const staffByMutiTermNew = {
	data() {
		return {
			staffLoading: false,
			staffData: [],
		};
	},
	methods: {
		loadStaffNew(query) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._HR_MUTI_TERM_STAFF_NEW_GET,
					type: 'GET',
					param: {
						search: query.trim()
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				}).catch((error) => {
					this.staffLoading = false;
				});
			} else {
				this.staffData = [];
			}

		}
	}
};
export const staffByOwn = {
	data() {
		return {
			staffLoading: false,
			staffData: [],
		};
	},
	methods: {
		loadStaffNew(query) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._HR_ARCHIVES_ACHIE_TREND_SEARCH_STAFF_GET,
					type: 'GET',
					param: {
						search: query.trim()
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				}).catch((error) => {
					this.staffLoading = false;
				});
			} else {
				this.staffData = [];
			}

		}
	}
};
export const staffByPhoneSearch = { // 行政部添加话机时选择人员
	data() {
		return {
			staffLoading: false,
			staffData: [],
		};
	},
	methods: {
		loadStaffNew(query) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._ADMINISTRATION_PHONE_STAFF_NEW_GET,
					type: 'GET',
					param: {
						search: query.trim()
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				}).catch((error) => {
					this.staffLoading = false;
				});
			} else {
				this.staffData = [];
			}

		}
	}
};
/**
 * 搜索模板样式
 */
export const searchOffer = (userOptions = {}) => {
	let { type } = userOptions;
	return {
		data() {
			return {
				offerLoading: false,
				offerData: [],
			};
		},
		methods: {
			loadOffer(query) {
				if (query !== '') {
					this.offerLoading = true;
					this.$request({
						url: API_ROOT['_HR_MODULE_GET'],
						type: 'GET',
						param: {
							offer_name: query.trim(),
							type
						},
						loading: false
					}).then((res) => {
						this.offerLoading = false;
						this.offerData = initTreeData(res.data, 'offer_id', 'offer_name');
					}).catch((error) => {
						this.offerLoading = false;
					});
				} else {
					this.offerData = [];
				}
			}
		}
	};
};


/**
 * 邀约类型
 */
export const inviteType = {
	data() {
		return {
			inviteType: [
				{ label: '全部邀约', value: 1 },
				{ label: '我的邀约', value: 0 }
			]
		};
	}
};

/**
 * 工作年限
 */
export const workTime = {
	data() {
		return {
			workTime: [
				{ label: '应届生', value: 0 },
				{ label: '1年以内', value: 1 },
				{ label: '1-3年', value: 2 },
				{ label: '3-5年', value: 3 },
				{ label: '5-10年', value: 4 },
				{ label: '10年以上', value: 5 }
			]
		};
	}
};

/**
 * 面试结果
 */
export const interResultList = {
	data() {
		return {
			interResultList: [
				{ label: 'A+', value: 1 },
				{ label: 'A', value: 2 },
				{ label: 'A-', value: 3 },
				{ label: 'B+', value: 4 },
				{ label: 'B', value: 5 },
				{ label: 'B-', value: 6 },
				{ label: 'C+', value: 7 },
				{ label: 'C', value: 8 },
				{ label: 'C-', value: 9 }
			]
		};
	}
};

/**
 * 有无车票信息
 */
export const hasTicketlist = {
	data() {
		return {
			hasTicketlist: [
				{ label: '无', value: 0 },
				{ label: '有', value: 1 }
			]
		};
	}
};

/**
 * 是否添加备注
 */
export const isRemarkList = {
	data() {
		return {
			isRemarkList: [
				{ label: '否', value: 0 },
				{ label: '是', value: 1 }
			]
		};
	}
};

/**
 * 淘汰类型
 */
export const passList = {
	data() {
		return {
			passList: [
				{ label: "主动淘汰", value: 1 },
				{ label: "被动淘汰", value: 2 }
			]
		};
	}
};
