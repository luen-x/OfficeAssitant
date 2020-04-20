import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getHRRoutes } from '@components/layout/left/hr';

export const hrOtherConfig = [
	{
		path: '/draw',
		name: 'hr-draw',
		component: () => import('./modules/hr-academy-train-detail-draw-full-screen.vue')
	},
	{
		path: '/hr/academy/course/exam',
		name: 'hr-academy-course-exam',
		component: () => import('./modules/hr-academy-course-exam.vue')
	},
	{
		path: '/hr/academy/course/exam/view',
		name: 'hr-academy-course-exam-view',
		component: () => import('./modules/hr-academy-course-exam-view.vue')
	},
	{
		path: '/hr/recruit/social/entry',
		name: 'hr-recruit-social-entry',
		component: () => import('./modules/hr-recruit-social-entry.vue')
	},
	{
		path: '/hr/recruit/social/interview',
		name: 'hr-recruit-social-interview',
		component: () => import('./modules/hr-recruit-social-interview.vue')
	}

];

export const hrConfig = [
	/**
	 * 首页
	 */
	{
		path: '/hr',
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getHRRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	{
		path: '/hr/consultation',
		name: 'hr-consultation',
		component: () => import('./modules/hr-consultation.vue')
	},
	{
		path: '/hr/main',
		name: 'hr-main',
		component: () => import('./modules/hr-main.vue')
	},
	{
		path: '/hr/main/information',
		name: 'hr-main-information',
		component: () => import('./modules/hr-main-information.vue')
	},
	{
		path: '/hr/main/schedule',
		name: 'hr-main-schedule',
		component: () => import('./modules/hr-main-schedule.vue')
	},

	/**
	 * 招聘管理
	 */
	{
		path: '/hr/recruit/school/summary',
		name: 'hr-recruit-school-summary',
		component: () => import('./modules/hr-recruit-school-summary.vue')
	},
	// 录入信息
	{
		path: '/hr/recruit/school/summary/add',
		name: 'hr-recruit-school-summary-add',
		component: () => import('./modules/hr-recruit-school-summary-add.vue')
	},
	// 批量编辑
	{
		path: '/hr/recruit/school/summary/edit',
		name: 'hr-recruit-school-summary-edit',
		component: () => import('./modules/hr-recruit-school-summary-edit.vue')
	},
	// 发offer预览页
	{
		path: '/hr/recruit/school/summary/offer',
		name: 'hr-recruit-school-summary-offer',
		component: () => import('./modules/hr-recruit-school-summary-offer.vue')
	},
	// 发邮件
	{
		path: '/hr/recruit/school/summary/email',
		name: 'hr-recruit-school-summary-email',
		component: () => import('./modules/hr-recruit-school-summary-email.vue')
	},
	// 邮件列表
	{
		path: '/hr/recruit/school/summary/elists',
		name: 'hr-recruit-school-summary-elists',
		component: () => import('./modules/hr-recruit-school-summary-elists.vue')
	},
	// 查看邮件
	{
		path: '/hr/recruit/school/summary/elook',
		name: 'hr-recruit-school-summary-elook',
		component: () => import('./modules/hr-recruit-school-summary-elook.vue')
	},
	// 查看入职面谈
	{
		path: '/hr/recruit/school/summary/entry',
		name: 'hr-recruit-school-summary-entry',
		component: () => import('./modules/hr-recruit-entry-detail.vue')
	},
	// 查看详情
	{
		path: '/hr/recruit/school/jobfair',
		name: 'hr-recruit-school-jobfair',
		component: () => import('./modules/hr-recruit-school-jobfair.vue')
	},
	{
		path: '/hr/recruit/school/statistics',
		name: 'hr-recruit-school-statistics',
		component: () => import('./modules/hr-recruit-school-statistics.vue')
	},
	{
		path: '/hr/recruit/school/statistics/info',
		name: 'hr-recruit-school-statistics-info',
		component: () => import('./modules/hr-recruit-school-statistics-info.vue')
	},
	{
		path: '/hr/recruit/school/jobfair/info',
		name: 'hr-recruit-school-jobfair-info',
		component: () => import('./modules/hr-recruit-school-jobfair-info.vue')
	},
	{
		path: '/hr/recruit/school/jobfair/add',
		name: 'hr-recruit-school-jobfair-add',
		component: () => import('./modules/hr-recruit-school-jobfair-add.vue')
	},
	{
		path: '/hr/recruit/school/jobfair/edit',
		name: 'hr-recruit-school-jobfair-edit',
		component: () => import('./modules/hr-recruit-school-jobfair-edit.vue')
	},
	{
		path: '/hr/recruit/school/jobfair/school',
		name: 'hr-recruit-school-jobfair-school',
		component: () => import('./modules/hr-recruit-school-jobfair-school.vue')
	},
	// 识别简历
	{
		path: '/hr/recruit/school/identify',
		name: 'hr-recruit-school-identify',
		component: () => import('./modules/hr-recruit-school-identify.vue')
	},
	// 查看简历图片
	{
		path: '/hr/recruit/school/resume/img',
		name: 'hr-recruit-school-resume-img',
		component: () => import('./modules/hr-recruit-resume-img.vue')
	},

	{
		path: '/hr/recruit/school/tryassign',
		name: 'hr-recruit-school-tryassign',
		component: () => import('./modules/hr-recruit-school-tryassign.vue')
	},
	{
		path: '/hr/recruit/school/tryassign/random',
		name: 'hr-recruit-school-tryassign/random',
		component: () => import('./modules/hr-recruit-school-tryassign-random.vue')
	},
	{
		path: '/hr/recruit/school/tryassign/chief',
		name: 'hr-recruit-school-tryassign/chief',
		component: () => import('./modules/hr-recruit-school-tryassign-chief.vue')
	},
	{
		path: '/hr/recruit/school/assigndetails',
		name: 'hr-recruit-school-assigndetails',
		component: () => import('./modules/hr-recruit-school-assigndetails.vue')
	},
	{
		path: '/hr/recruit/school/organization',
		name: 'hr-recruit-school-organization',
		component: () => import('./modules/hr-recruit-school-organization.vue')
	},
	{
		path: '/hr/recruit/school/paper',
		name: 'hr-recruit-school-paper',
		component: () => import('./modules/hr-recruit-school-paper.vue')
	},
	{
		path: '/hr/recruit/school/paper/edit',
		name: 'hr-recruit-school-paper-edit',
		component: () => import('./modules/hr-recruit-school-paper-edit.vue')
	},
	{
		path: '/hr/recruit/school/paper/preview',
		name: 'hr-recruit-school-paper-preview',
		component: () => import('./modules/hr-recruit-school-paper-preview.vue')
	},
	{
		path: '/hr/recruit/school/paper/result',
		name: 'hr-recruit-school-paper-result',
		component: () => import('./modules/hr-recruit-school-paper-result.vue')
	},
	{
		path: '/hr/recruit/school/:type/:id',
		name: 'hr-recruit-school-summary-detail',
		component: () => import('./modules/hr-recruit-school-summary-detail.vue')
	},
	{
		path: '/hr/recruit/social/summary',
		name: 'hr-recruit-social-summary',
		component: () => import('./modules/hr-recruit-social-summary.vue')
	},
	{
		path: '/hr/recruit/social/summary/add',
		name: 'hr-recruit-social-summary-add',
		component: () => import('./modules/hr-recruit-social-summary-add.vue')
	},
	{
		path: '/hr/recruit/social/summary/offer',
		name: 'hr-recruit-social-summary-offer',
		component: () => import('./modules/hr-recruit-social-summary-offer.vue')
	},
	// 发邮件
	{
		path: '/hr/recruit/social/summary/email',
		name: 'hr-recruit-social-summary-email',
		component: () => import('./modules/hr-recruit-school-summary-email.vue')
	},
	// 邮件列表
	{
		path: '/hr/recruit/social/summary/elists',
		name: 'hr-recruit-social-summary-elists',
		component: () => import('./modules/hr-recruit-school-summary-elists.vue')
	},
	// 查看邮件
	{
		path: '/hr/recruit/social/summary/elook',
		name: 'hr-recruit-social-summary-elook',
		component: () => import('./modules/hr-recruit-school-summary-elook.vue')
	},
	// 查看入职面谈
	{
		path: '/hr/recruit/social/summary/entry',
		name: 'hr-recruit-social-summary-entry',
		component: () => import('./modules/hr-recruit-entry-detail.vue')
	},
	{
		path: '/hr/recruit/social/summary/interview-read-only',
		name: 'hr-recruit-school-summary-interview-read-only',
		component: () => import('./modules/hr-form.vue')
	},
	// 批量编辑
	{
		path: '/hr/recruit/social/summary/edit',
		name: 'hr-recruit-social-summary-edit',
		component: () => import('./modules/hr-recruit-social-summary-edit.vue')
	},
	{
		path: '/hr/recruit/social/resume',
		name: 'hr-recruit-social-resume',
		component: () => import('./modules/hr-recruit-social-resume.vue')
	},
	// 识别简历
	{
		path: '/hr/recruit/social/identify',
		name: 'hr-recruit-social-identify',
		component: () => import('./modules/hr-recruit-social-identify.vue')
	},
	// 查看简历图片
	{
		path: '/hr/recruit/social/resume/img',
		name: 'hr-recruit-social-resume-img',
		component: () => import('./modules/hr-recruit-resume-img.vue')
	},
	{
		path: '/hr/recruit/social/:type/:id',
		name: 'hr-recruit-social-details',
		component: () => import('./modules/hr-recruit-social-details.vue')
	},
	{
		path: '/hr/recruit/talent/detail/:type/:id',
		name: 'hr-recruit-talent-details',
		component: () => import('./modules/hr-recruit-social-details.vue')
	},
	{
		path: '/hr/recruit/talent/obsolete',
		name: 'hr-recruit-social-talent',
		component: () => import('./modules/hr-recruit-social-talent.vue')
	},
	{
		path: '/hr/recruit/talent/leave',
		name: 'hr-recruit-talent-leave',
		component: () => import('./modules/hr-recruit-talent-leave.vue')
	},
	{
		path: '/hr/recruit/talent/invite/obsolete',
		name: 'hr-recruit-talent-invite-obsolete',
		component: () => import('./modules/hr-recruit-talent-invite-obsolete.vue')
	},
	{
		path: '/hr/recruit/talent/invite/leave',
		name: 'hr-recruit-talent-invite-leave',
		component: () => import('./modules/hr-recruit-talent-invite-leave.vue')
	},
	{
		path: '/hr/recruit/social/statistics',
		name: 'hr-recruit-social-transform',
		component: () => import('./modules/hr-recruit-social-transform.vue')
	},
	{
		path: '/hr/recruit/social/statistics/position/details',
		name: 'hr-recruit-social-statistics-position-details',
		component: () => import('./modules/hr-recruit-social-statistics-position-details.vue')
	},
	{
		path: '/hr/recruit/social/blacklist',
		name: 'hr-recruit-social-blacklist',
		component: () => import('./modules/hr-recruit-social-blacklist.vue')
	},
	{
		path: '/hr/recruit/social/social-transform-details',
		name: 'hr-recruit-social-transform-details',
		component: () => import('./modules/hr-recruit-social-social-transform-details.vue')
	},
	{
		path: '/hr/recruit/social/social-statistics-details',
		name: 'hr-recruit-social-statistics-details',
		component: () => import('./modules/hr-recruit-social-statistics-details.vue')
	},
	{
		path: '/hr/recruit/school/identify-detail',
		name: 'hr-recruit-school-identify-detail',
		component: () => import('./modules/hr-recruit-school-identify-detail.vue')
	},
	{
		path: '/hr/recruit/social/identify-detail',
		name: 'hr-recruit-social-identify-detail',
		component: () => import('./modules/hr-recruit-social-identify-detail.vue')
	},
	/**
	 * 员工管理
	 */
	{
		path: '/hr/employee/summary',
		name: '总表首页',
		component: () => import('./modules/hr-employee-summary.vue')
	},
	{
		path: '/hr/employee/relation/try',
		name: '试用转正',
		component: () => import('./modules/hr-employee-relation-try.vue')
	},
	{
		path: '/hr/employee/relation/pact',
		name: '员工合同',
		component: () => import('./modules/hr-employee-relation-pact.vue')
	},
	{
		path: '/hr/employee/relation/tran',
		name: '员工转岗',
		component: () => import('./modules/hr-employee-relation-tran.vue')
	},
	{
		path: '/hr/employee/relation/leave',
		name: '离职管理',
		component: () => import('./modules/hr-employee-relation-leave.vue')
	},
	{
		path: '/hr/employee/relation/try/invoice',
		name: 'hr-employee-relation-try-invoice',
		component: () => import('./modules/hr-employee-relation-try-invoice.vue')
	},
	{
		path: '/hr/employee/relation/leave/invoice',
		name: 'hr-employee-relation-leave-invoice',
		component: () => import('./modules/hr-employee-relation-leave-invoice.vue')
	},
	{
		path: '/hr/employee/summary/resume',
		name: 'hr-employee-summary-resume',
		component: () => import('./modules/hr-employee-summary-resume.vue')
	},
	{
		path: '/hr/employee/summary/profile',
		name: 'hr-employee-summary-profile',
		component: () => import('./modules/hr-employee-summary-profile.vue')
	},
	{
		path: '/hr/employee/summary/entry',
		name: 'hr-employee-summary-entry',
		component: () => import('./modules/hr-employee-summary-entry.vue')
	},
	{
		path: '/hr/employee/data/basic',
		name: 'hr-employee-data-basic',
		component: () => import('./modules/hr-employee-data-basic.vue')
	},
	{
		path: '/hr/employee/data/emdata',
		name: 'hr-employee-data-emdata',
		component: () => import('./modules/hr-employee-data-emdata.vue')
	},
	{
		path: '/hr/employee/summary/details',
		name: 'hr-employee-summary-details',
		component: () => import('./modules/hr-employee-summary-details.vue')
	},
	{
		path: '/hr/employee/rank/promo',
		name: '级称体系',
		component: () => import('./modules/hr-employee-rank-promo.vue')
	},
	{
		path: '/hr/employee/rank/title',
		name: '称号体系',
		component: () => import('./modules/hr-employee-rank-title.vue')
	},
	// 级称体系-操作历史
	{
		path: '/hr/employee/rank/promo/record',
		name: 'hr-employee-rank-promo-record',
		component: () => import('./modules/hr-employee-rank-promo-record.vue')
	},
	// 晋升体系
	{
		path: '/hr/employee/rank/up',
		name: 'hr-employee-rank-up',
		component: () => import('./modules/hr-employee-rank-up.vue')
	},
	{
		path: '/hr/employee/rank/up/rule',
		name: 'hr-employee-rank-up-rule',
		component: () => import('./modules/hr-employee-rank-up-rule.vue')
	},
	{
		path: '/hr/employee/rank/up/store',
		name: 'hr-employee-rank-up-store',
		component: () => import('./modules/hr-employee-rank-up-store.vue')
	},
	// 转岗
	{
		path: '/hr/employee/transfer',
		name: 'hr-employee-transfer',
		component: () => import('./modules/hr-employee-transfer.vue')
	},
	// 离职
	{
		path: '/hr/employee/dimission',
		name: 'hr-employee-dimission',
		component: () => import('./modules/hr-employee-dimission.vue')
	},
	// 校招分配
	{
		path: '/hr/employee/allocation',
		name: 'hr-employee-allocation',
		component: () => import('./modules/hr-employee-allocation.vue')
	},

	/**
	 * 薪资补贴
	 */
	{
		path: '/hr/salary/wage/monthly',
		name: '每月薪资',
		component: () => import('./modules/hr-salary-wage-monthly.vue')
	},
	{
		path: '/hr/salary/wage/history',
		name: '调整历史',
		component: () => import('./modules/hr-salary-wage-history.vue')
	},
	{
		path: '/hr/salary/subsidy/traffic',
		name: '交通补贴',
		component: () => import('./modules/hr-salary-subsidy-traffic.vue')
	},
	{
		path: '/hr/salary/base',
		name: 'hr-salary-base',
		component: () => import('./modules/hr-salary-base.vue')
	},
	{
		path: '/hr/salary/per',
		name: 'hr-salary-per',
		component: () => import('./modules/hr-salary-per.vue')
	},
	{
		path: '/hr/salary/team',
		name: 'hr-salary-team',
		component: () => import('./modules/hr-salary-team.vue')
	},

	/**
	 * 服务积分
	 */
	{
		path: '/hr/points',
		name: 'hr-points',
		component: () => import('./modules/hr-points.vue')
	},
	{
		path: '/hr/points/confirm',
		name: 'hr-points-confirm',
		component: () => import('./modules/hr-points-confirm.vue')
	},
	{
		path: '/hr/points/complaint',
		name: 'hr-points-complaint',
		component: () => import('./modules/hr-points-complaint.vue')
	},

	/**
	 * 组织架构
	 */
	{
		path: '/hr/organization',
		name: 'hr-organization',
		component: () => import('./modules/hr-organization.vue')
	},

	/**
	 * 职位管理
	 */
	{
		path: '/hr/position',
		name: 'hr-position',
		component: () => import('./modules/hr-position.vue')
	},

	/**
	 * 级称设置
	 */
	{
		path: '/hr/rank',
		name: 'hr-rank',
		component: () => import('./modules/hr-rank.vue')
	},
	{
		path: '/hr/rank/info',
		name: 'hr-rank-info',
		component: () => import('./modules/hr-rank-info.vue')
	},
	{
		path: '/hr/rank/setting',
		name: 'hr-rank-setting',
		component: () => import('./modules/hr-rank-setting.vue')
	},

	/**
	 * 工具管理
	 */
	{
		path: '/hr/tool/workflow',
		name: 'hr-tool-workflow',
		component: () => import('./modules/hr-tool-workflow.vue')
	},
	{
		path: '/hr/tool/modules/offer',
		name: 'hr-tool-modules-offer',
		component: () => import('./modules/hr-tool-modules-offer.vue')
	},
	{
		path: '/hr/tool/modules/offer/add',
		name: 'hr-tool-modules-offer-add',
		component: () => import('./modules/hr-tool-modules-offer-add.vue')
	},
	{
		path: '/hr/tool/modules/upload',
		name: 'hr-tool-modules-upload',
		component: () => import('./modules/hr-tool-modules-upload.vue')
	},
	{
		path: '/hr/tool/modules/edit',
		name: 'hr-tool-modules-edit',
		component: () => import('./modules/hr-tool-modules-edit.vue')
	},
	/**
	 * 表单
	 */
	{
		path: '/hr/form/:type',
		name: 'hr-form',
		component: () => import('./modules/hr-form.vue')
	},
	{
		path: '/hr/recruit/school/war',
		name: 'hr-recruit-school-war',
		component: () => import('./modules/hr-recruit-school-war.vue')
	},
	{
		path: '/hr/recruit/school/depart',
		name: 'hr-recruit-school-depart',
		component: () => import('./modules/hr-recruit-school-depart.vue')
	},
	{
		path: '/hr/employee/score/integration',
		name: 'hr-employee-score-integration',
		component: () => import('./modules/hr-employee-score-integration.vue')
	},
	{
		path: '/hr/employee/score/credit',
		name: 'hr-employee-score-credit',
		component: () => import('./modules/hr-employee-score-credit.vue')
	},
	{
		path: '/hr/employee/score/integration/audit',
		name: 'hr-employee-score-integration-audit',
		component: () => import('./modules/hr-employee-score-integration-audit.vue')
	},
	{
		path: '/hr/employee/score/credit/audit',
		name: 'hr-employee-score-credit-audit',
		component: () => import('./modules/hr-employee-score-credit-audit.vue')
	},
	{
		path: '/hr/employee/score/credit/leadin',
		name: 'hr-employee-score-credit-leadin',
		component: () => import('./modules/hr-employee-score-credit-leadin.vue')
	},
	{
		path: '/hr/employee/score/service/examine',
		name: 'hr-employee-score-service-examine',
		component: () => import('./modules/hr-employee-score-service-examine.vue')
	},
	{
		path: '/hr/employee/score/service/complaints',
		name: 'hr-employee-score-service-complaints',
		component: () => import('./modules/hr-employee-score-service-complaints.vue')
	},
	{
		path: '/hr/employee/rank/statistics',
		name: 'hr-employee-rank-statistics',
		component: () => import('./modules/hr-employee-rank-statistics.vue')
	},
	{
		path: '/hr/employee/check',
		name: 'hr-employee-check',
		component: () => import('./modules/hr-employee-check.vue')
	},
	{
		path: '/hr/employee/mentor/select',
		name: 'hr-employee-mentor-select',
		component: () => import('./modules/hr-employee-mentor-select.vue')
	},
	{
		path: '/hr/employee/mentor/relation',
		name: 'hr-employee-mentor-relation',
		component: () => import('./modules/hr-employee-mentor-relation.vue')
	},
	{
		path: '/hr/employee/mentor/rule',
		name: 'hr-employee-mentor-rule',
		component: () => import('./modules/hr-employee-mentor-rule.vue')
	},
	{
		path: '/hr/salary/social/subsidy',
		name: 'hr-salary-social-subsidy',
		component: () => import('./modules/hr-salary-social-subsidy.vue')
	},
	{
		path: '/hr/salary/social/history',
		name: 'hr-salary-social-history',
		component: () => import('./modules/hr-salary-social-history.vue')
	},
	{
		path: '/hr/salary/social/setting',
		name: 'hr-salary-social-setting',
		component: () => import('./modules/hr-salary-social-setting.vue')
	},
	{
		path: '/hr/academy/transfer/transfer',
		name: 'hr-academy-transfer-transfer',
		component: () => import('./modules/hr-academy-transfer-transfer.vue')
	},
	{
		path: '/hr/academy/transfer/statistic',
		name: 'hr-academy-transfer-statistic',
		component: () => import('./modules/hr-academy-transfer-statistic.vue')
	},
	{
		path: '/hr/academy/transfer/try/detail',
		name: 'hr-academy-transfer-try-detail',
		component: () => import('./modules/hr-academy-transfer-try-detail.vue')
	},
	{
		path: '/hr/academy/transfer/teacher/detail',
		name: 'hr-academy-transfer-teacher-detail',
		component: () => import('./modules/hr-academy-transfer-teacher-detail.vue')
	},
	{
		path: '/hr/academy/transfer/demand/detail',
		name: 'hr-academy-transfer-demand-detail',
		component: () => import('./modules/hr-academy-transfer-demand-detail.vue')
	},
	{
		path: '/hr/academy/transfer/:type/:id',
		name: 'hr-academy-transfer-detail',
		component: () => import('./modules/hr-academy-transfer-detail.vue')
	},
	{
		path: '/hr/academy/course/store',
		name: 'hr-academy-course-store',
		component: () => import('./modules/hr-academy-course-store.vue')
	},
	{
		path: '/hr/academy/course/store/add',
		name: 'hr-academy-course-store-add',
		component: () => import('./modules/hr-academy-course-store-add.vue')
		// component: () => import('./modules/hr-academy-train-detail-basic-2-edit.vue'),
	},
	{
		path: '/hr/academy/course/question',
		name: 'hr-academy-course-question',
		component: () => import('./modules/hr-academy-course-question.vue')
	},
	{
		path: '/hr/academy/course/question/add',
		name: 'hr-academy-course-question-add',
		component: () => import('./modules/hr-academy-course-question-add.vue')
	},
	{
		path: '/hr/academy/course/question/audit',
		name: 'hr-academy-course-question-audit',
		component: () => import('./modules/hr-academy-course-question-audit.vue')
	},
	{
		path: '/hr/academy/course/paper',
		name: 'hr-academy-course-paper',
		component: () => import('./modules/hr-academy-course-paper.vue')
	},
	{
		path: '/hr/academy/course/paper/add',
		name: 'hr-academy-course-paper-add',
		component: () => import('./modules/hr-academy-course-paper-add.vue')
	},
	{
		path: '/hr/academy/course/paper/edit',
		name: 'hr-academy-course-paper-edit',
		component: () => import('./modules/hr-academy-course-paper-edit.vue')
	},
	{
		path: '/hr/academy/statistic/study',
		name: 'hr-academy-statistic-study',
		component: () => import('./modules/hr-academy-statistic-study.vue')
	},
	{
		path: '/hr/academy/statistic/study/detail',
		name: 'hr-academy-statistic-study-detail',
		component: () => import('./modules/hr-academy-statistic-study-detail.vue')
	},
	{
		path: '/hr/academy/statistic/course',
		name: 'hr-academy-statistic-course',
		component: () => import('./modules/hr-academy-statistic-course.vue')
	},
	{
		path: '/hr/academy/elite/talent',
		name: 'hr-academy-elite-talent',
		component: () => import('./modules/hr-academy-elite-talent.vue')
	},
	{
		path: '/hr/academy/elite/setting',
		name: 'hr-academy-elite-setting',
		component: () => import('./modules/hr-academy-elite-setting.vue')
	},
	{
		path: '/hr/academy/elite/add',
		name: 'hr-academy-elite-add',
		component: () => import('./modules/hr-academy-elite-add.vue')
	},
	{
		path: '/hr/academy/elite/manage',
		name: 'hr-academy-elite-manage',
		component: () => import('./modules/hr-academy-elite-manage.vue')
	},
	{
		path: '/hr/academy/train/schedule',
		name: 'hr-academy-train-schedule',
		component: () => import('./modules/hr-academy-train-schedule.vue')
	},
	{
		path: '/hr/academy/train/arrangement',
		name: 'hr-academy-train-arrangement',
		component: () => import('./modules/hr-academy-train-arrangement.vue')
	},
	{
		path: '/hr/archives/employee/business',
		name: 'hr-archives-employee-business',
		component: () => import('./modules/hr-archives-employee-business.vue')
	},
	{
		path: '/hr/archives/employee/business/detail',
		name: 'hr-archives-employee-business-detail',
		component: () => import('./modules/hr-archives-employee-business-detail.vue')
	},
	{
		path: '/hr/archives/employee/business/watch',
		name: 'hr-archives-employee-business-watch',
		component: () => import('./modules/hr-archives-employee-business-watch.vue')
	},
	{
		path: '/hr/archives/employee/customer',
		name: 'hr-archives-employee-customer',
		component: () => import('./modules/hr-archives-employee-customer.vue')
	},
	{
		path: '/hr/archives/employee/output',
		name: 'hr-archives-employee-output',
		component: () => import('./modules/hr-archives-employee-output.vue')
	},
	{
		path: '/hr/archives/employee/customer/detail',
		name: 'hr-archives-employee-customer-detail',
		component: () => import('./modules/hr-archives-employee-customer-detail.vue')
	},
	{
		path: '/hr/archives/employee/target',
		name: 'hr-archives-employee-target',
		component: () => import('./modules/hr-archives-employee-target.vue')
	},
	{
		path: '/hr/archives/achie/rank',
		name: 'hr-archives-achie-rank',
		component: () => import('./modules/hr-archives-achie-rank.vue')
	},
	{
		path: '/hr/archives/achie/pk',
		name: 'hr-archives-achie-pk',
		component: () => import('./modules/hr-archives-achie-pk.vue')
	},
	{
		path: '/hr/archives/achie/trend',
		name: 'hr-archives-achie-trend',
		component: () => import('./modules/hr-archives-achie-trend.vue')
	},
	{
		path: '/hr/archives/audit',
		name: 'hr-archives-audit',
		component: () => import('./modules/hr-archives-audit.vue')
	},
	{
		path: '/hr/archives/person',
		name: 'hr-archives-person',
		component: () => import('./modules/hr-archives-person.vue'),
	},
	{
		path: '/hr/archives/person/recommend',
		name: 'hr-archives-person-recommend',
		component: () => import('./modules/hr-archives-person-recommend.vue'),
	},
	{
		path: '/hr/archives/person/details',
		name: 'hr-archives-person-details',
		component: () => import('./modules/hr-archives-person-details.vue'),
	},
	{
		path: '/hr/employee/data/commissar',
		name: 'hr-employee-data-commissar',
		component: () => import('./modules/hr-employee-data-commissar.vue')
	},
	{
		path: '/hr/system/organization',
		name: 'hr-system-organization',
		component: () => import('./modules/hr-system-organization.vue')
	},
	{
		path: '/hr/system/position',
		name: 'hr-system-position',
		component: () => import('./modules/hr-system-position.vue')
	},
	{
		path: '/hr/system/role',
		name: 'hr-system-role',
		component: () => import('./modules/hr-system-role.vue')
	},
	{
		path: '/hr/system/assess/rank',
		name: 'hr-system-assess-rank',
		component: () => import('./modules/hr-system-assess-rank.vue')
	},
	{
		path: '/hr/system/assess/up',
		name: 'hr-system-assess-up',
		component: () => import('./modules/hr-system-assess-up.vue')
	},
	{
		path: '/hr/system/assess/integration',
		name: 'hr-system-assess-integration',
		component: () => import('./modules/hr-system-assess-integration.vue')
	},
	{
		path: '/hr/system/assess/credit',
		name: 'hr-system-assess-credit',
		component: () => import('./modules/hr-system-assess-credit.vue')
	},
	{
		path: '/hr/system/assess/statistics',
		name: 'hr-system-assess-statistics',
		component: () => import('./modules/hr-system-assess-statistics.vue')
	},
	{
		path: '/hr/academy/train/detail',
		name: 'hr-academy-train-detail',
		component: () => import('./modules/hr-academy-train-detail.vue'),
		children: [
			{
				path: '/hr/academy/train/detail/basic/0/info',
				name: 'hr-academy-train-detail-basic-0-info',
				component: () => import('./modules/hr-academy-train-detail-basic-0-info.vue'),
			},
			{
				path: '/hr/academy/train/detail/basic/1/detail',
				name: 'hr-academy-train-detail-basic-1-detail',
				component: () => import('./modules/hr-academy-train-detail-basic-1-detail.vue'),
			},
			{
				path: '/hr/academy/train/detail/basic/2/edit',
				name: 'hr-academy-train-detail-basic-2-edit',
				component: () => import('./modules/hr-academy-train-detail-basic-2-edit.vue'),
			},
			{
				path: '/hr/academy/train/detail/participate/0/roster',
				name: 'hr-academy-train-detail-participate-0-roster',
				component: () => import('./modules/hr-academy-train-detail-participate-0-roster.vue'),
			},
			{
				path: '/hr/academy/train/detail/group/0/group',
				name: 'hr-academy-train-detail-group-0-group',
				component: () => import('./modules/hr-academy-train-detail-group-0-group.vue'),
			},
			{
				path: '/hr/academy/train/detail/group/1/random',
				name: 'hr-academy-train-detail-group-1-random',
				component: () => import('./modules/hr-academy-train-detail-group-1-random.vue'),
			},
			{
				path: '/hr/academy/train/detail/group/2/hand',
				name: 'hr-academy-train-detail-group-2-hand',
				component: () => import('./modules/hr-academy-train-detail-group-2-hand.vue'),
			},
			{
				path: '/hr/academy/train/detail/paln/0/activity',
				name: 'hr-academy-train-detail-paln-0-activity',
				component: () => import('./modules/hr-academy-train-detail-plan-0-activity.vue'),
			},
			{
				path: '/hr/academy/train/detail/sign/0/manage',
				name: 'hr-academy-train-detail-sign-0-manage',
				component: () => import('./modules/hr-academy-train-detail-sign-0-manage.vue'),
			},
			{
				path: '/hr/academy/train/detail/sign/1/add',
				name: 'hr-academy-train-detail-sign-1-add',
				component: () => import('./modules/hr-academy-train-detail-sign-1-add.vue'),
			},
			{
				path: '/hr/academy/train/detail/sign/2/edit',
				name: 'hr-academy-train-detail-sign-2-edit',
				component: () => import('./modules/hr-academy-train-detail-sign-2-edit.vue'),
			},
			{
				path: '/hr/academy/train/detail/sign/3/provide',
				name: 'hr-academy-train-detail-sign-3-provide',
				component: () => import('./modules/hr-academy-train-detail-sign-3-provide.vue'),
			},
			{
				path: '/hr/academy/train/detail/sign/4/result',
				name: 'hr-academy-train-detail-sign-4-result',
				component: () => import('./modules/hr-academy-train-detail-sign-4-result.vue'),
			},
			{
				path: '/hr/academy/train/detail/paper/0/pass',
				name: 'hr-academy-train-detail-paper-0-pass',
				component: () => import('./modules/hr-academy-train-detail-paper-0-pass.vue'),
			},
			{
				path: '/hr/academy/train/detail/paper/0/audit',
				name: 'hr-academy-train-detail-paper-0-audit',
				component: () => import('./modules/hr-academy-train-detail-paper-0-audit.vue'),
			},
			{
				path: '/hr/academy/train/detail/paper/1/add',
				name: 'hr-academy-train-detail-paper-1-add',
				component: () => import('./modules/hr-academy-train-detail-paper-1-add.vue'),
			},
			{
				path: '/hr/academy/train/detail/paper/2/arrange',
				name: 'hr-academy-train-detail-paper-2-arrange',
				component: () => import('./modules/hr-academy-train-detail-paper-2-arrange.vue'),
			},
			{
				path: '/hr/academy/train/detail/paper/3/result',
				name: 'hr-academy-train-detail-paper-3-result',
				component: () => import('./modules/hr-academy-train-detail-paper-3-result.vue'),
			},
			{
				path: '/hr/academy/train/detail/vote/0/manage',
				name: 'hr-academy-train-detail-vote-0-manage',
				component: () => import('./modules/hr-academy-train-detail-vote-0-manage.vue'),
			},
			{
				path: '/hr/academy/train/detail/vote/1/add',
				name: 'hr-academy-train-detail-vote-1-add',
				component: () => import('./modules/hr-academy-train-detail-vote-1-add.vue'),
			},
			{
				path: '/hr/academy/train/detail/vote/2/edit',
				name: 'hr-academy-train-detail-vote-2-edit',
				component: () => import('./modules/hr-academy-train-detail-vote-2-edit.vue'),
			},
			{
				path: '/hr/academy/train/detail/vote/2/provide',
				name: 'hr-academy-train-detail-vote-2-provide',
				component: () => import('./modules/hr-academy-train-detail-vote-2-provide.vue'),
			},
			{
				path: '/hr/academy/train/detail/vote/2/result',
				name: 'hr-academy-train-detail-vote-2-result',
				component: () => import('./modules/hr-academy-train-detail-vote-2-result.vue'),
			},
			{
				path: '/hr/academy/train/detail/enroll/0/manage',
				name: 'hr-academy-train-detail-enroll-0-manage',
				component: () => import('./modules/hr-academy-train-detail-enroll-0-manage.vue'),
			},
			{
				path: '/hr/academy/train/detail/enroll/1/add',
				name: 'hr-academy-train-detail-enroll-1-add',
				component: () => import('./modules/hr-academy-train-detail-enroll-1-add.vue'),
			},
			{
				path: '/hr/academy/train/detail/enroll/2/edit',
				name: 'hr-academy-train-detail-enroll-2-edit',
				component: () => import('./modules/hr-academy-train-detail-enroll-2-edit.vue'),
			},
			{
				path: '/hr/academy/train/detail/enroll/2/provide',
				name: 'hr-academy-train-detail-enroll-2-provide',
				component: () => import('./modules/hr-academy-train-detail-enroll-2-provide.vue'),
			},
			{
				path: '/hr/academy/train/detail/enroll/2/result',
				name: 'hr-academy-train-detail-enroll-2-result',
				component: () => import('./modules/hr-academy-train-detail-enroll-2-result.vue'),
			},
			{
				path: '/hr/academy/train/detail/draw/0/manage',
				name: 'hr-academy-train-detail-draw-0-manage',
				component: () => import('./modules/hr-academy-train-detail-draw-0-manage.vue'),
			},
			{
				path: '/hr/academy/train/detail/draw/1/edit',
				name: 'hr-academy-train-detail-draw-1-edit',
				component: () => import('./modules/hr-academy-train-detail-draw-1-edit.vue'),
			},
			{
				path: '/hr/academy/train/detail/draw/1/provide',
				name: 'hr-academy-train-detail-draw-1-provide',
				component: () => import('./modules/hr-academy-train-detail-draw-1-provide.vue'),
			},
			{
				path: '/hr/academy/train/detail/draw/1/result',
				name: 'hr-academy-train-detail-draw-1-result',
				component: () => import('./modules/hr-academy-train-detail-draw-1-result.vue'),
			}
		],
	},
	{
		path: '/hr/system/assess/statistics/add',
		name: 'hr-system-assess-statistics-add',
		component: () => import('./modules/hr-system-assess-statistics-add.vue')
	},
	{
		path: '/hr/academy/train/schedule/add',
		name: 'hr-academy-train-schedule-add',
		component: () => import('./modules/hr-academy-train-schedule-add.vue')
	},
	{
		path: '/hr/system/assess/up/add',
		name: 'hr-system-assess-up-add',
		component: () => import('./modules/hr-system-assess-up-add.vue')
	},
	{
		path: '/hr/system/assess/integration/add',
		name: 'hr-system-assess-integration-add',
		component: () => import('./modules/hr-system-assess-integration-add.vue')
	},
	{
		path: '/hr/system/assess/integration/rules',
		name: 'hr-system-assess-integration-rules',
		component: () => import('./modules/hr-system-assess-integration-rules.vue')
	},
	{
		path: '/hr/system/assess/credit/add',
		name: 'hr-system-assess-credit-add',
		component: () => import('./modules/hr-system-assess-credit-add.vue')
	},
	{
		path: '/hr/system/assess/credit/rules',
		name: 'hr-system-assess-credit-rules',
		component: () => import('./modules/hr-system-assess-credit-rules.vue')
	},
	{
		path: '/hr/academy/train/arrangement/add',
		name: 'hr-academy-train-arrangement-add',
		component: () => import('./modules/hr-academy-train-arrangement-add.vue')
	},
	{
		path: '/hr/academy/train/arrangement/audit',
		name: 'hr-academy-train-arrangement-audit',
		component: () => import('./modules/hr-academy-train-arrangement-audit.vue')
	},
	{
		path: '/hr/employee/score/credit/rank',
		name: 'hr-employee-score-credit-rank',
		component: () => import('./modules/hr-employee-score-credit-rank.vue')
	},
	{
		path: '/hr/employee/score/credit/detail',
		name: 'hr-employee-score-credit-detail',
		component: () => import('./modules/hr-employee-score-credit-detail.vue')
	},
	{
		path: '/hr/employee/score/integration/rank',
		name: 'hr-employee-score-integration-rank',
		component: () => import('./modules/hr-employee-score-integration-rank.vue')
	},
	{
		path: '/hr/employee/score/integration/detail',
		name: 'hr-employee-score-integration-detail',
		component: () => import('./modules/hr-employee-score-integration-detail.vue')
	},
	{
		path: '/hr/employee/score/integration/leadin',
		name: 'hr-employee-score-integration-leadin',
		component: () => import('./modules/hr-employee-score-integration-leadin.vue')
	},
	{
		path: '/hr/personnel/member/detail',
		name: 'hr-personnel-member-detail',
		component: () => import('./modules/hr-personnel-member-detail.vue')
	},

	{
		path: '/hr/personnel',
		name: 'hr-personnel',
		component: () => import('./modules/hr-personnel.vue'),
		children: [
			{
				path: '/hr/personnel/report',
				name: 'hr-personnel-report',
				component: () => import('./modules/hr-personnel-report.vue'),

			},
			{
				path: '/hr/personnel/currency',
				name: 'hr-personnel-currency',
				component: () => import('./modules/hr-personnel-currency.vue'),
			},
			{
				path: '/hr/personnel/info',
				name: 'hr-personnel-info',
				component: () => import('./modules/hr-personnel-info.vue'),
			},
			// {
			// 	path: '/hr/personnel/member/detail',
			// 	name: 'hr-personnel-member-detail',
			// 	component: () => import('./modules/hr-personnel-member-detail.vue')
			// },
			{
				path: '/hr/personnel/info/demand',
				name: 'hr-personnel-info-demand',
				component: () => import('./modules/hr-personnel-info-demand.vue'),
			},
			{
				path: '/hr/personnel/info/recommend',
				name: 'hr-personnel-info-recommend',
				component: () => import('./modules/hr-personnel-info-recommend.vue'),
			},
			// {
			// 	path: '/hr/personnel/member',
			// 	name: 'hr-personnel-member',
			// 	component: () => import('./modules/hr-personnel-member.vue'),
			// },
	
			{
				path: '/hr/personnel/currency/rewards',
				name: 'hr-personnel-currency-rewards',
				component: () => import('./modules/hr-personnel-currency-rewards.vue')
			},
			{
				path: '/hr/personnel/info',
				name: 'hr-personnel-info',
				component: () => import('./modules/hr-personnel-info.vue'),

			},
			{
				path: '/hr/personnel/info/demand',
				name: 'hr-personnel-info-demand',
				component: () => import('./modules/hr-personnel-info-demand.vue'),
			},
			{
				path: '/hr/personnel/info/recommend',
				name: 'hr-personnel-info-recommend',
				component: () => import('./modules/hr-personnel-info-recommend.vue'),
			},
			// {
			// 	path: '/hr/personnel/member',
			// 	name: 'hr-personnel-member',
			// 	component: () => import('./modules/hr-personnel-member.vue'),
			// },
			{

				path: '/hr/personnel/member/staff',
				name: 'hr-personnel-member-staff',
				component: () => import('./modules/hr-personnel-member-staff.vue'),
			},
			{

				path: '/hr/personnel/member/relationship',
				name: 'hr-personnel-member-relationship',
				component: () => import('./modules/hr-personnel-member-relationship.vue'),
			},
			{

				path: '/hr/personnel/member/master',
				name: 'hr-personnel-member-master',
				component: () => import('./modules/hr-personnel-member-master.vue'),
			},
			{
				path: '/hr/personnel/member/staff/info',
				name: 'hr-personnel-member-staff-info',
				component: () => import('./modules/hr-personnel-member-staff-info.vue')
			},
			{
				path: '/hr/personnel/member/staff/info',
				name: 'hr-personnel-member-staff-info',
				component: () => import('./modules/hr-personnel-member-staff-info.vue')
			},
			{
				path: '/hr/personnel/member/distribution',
				name: 'hr-personnel-member-distribution',
				component: () => import('./modules/hr-personnel-member-distribution.vue')
			}

		]
		// {
		// 	path: '/hr/personnel/member/member',
		// 	name: 'hr-personnel-member-member',
		// 	component: () => import('./modules/hr-personnel-member-member.vue'),
		// 	children: [{
		// 		path: '/hr/personnel/member/member/staff',
		// 		name: 'hr-personnel-member-member-staff',
		// 		component: () => import('./modules/hr-personnel-member-member-staff.vue')
		// 	}]
		// }]
	}
];
