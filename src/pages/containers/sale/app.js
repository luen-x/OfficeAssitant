import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getSaleRoutes } from '@components/layout/left/sale';

export const saleConfig = [
	{
		path: "/sale",
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getSaleRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	/**
	 * 首页
	 */
	{
		path: "/sale/main",
		name: "sale-main",
		component: () => import("./modules/sale-main.vue")
	},
	{
		path: "/sale/main/pk",
		name: "sale-main-pk",
		// component: () => import('./modules/sale-main-pk.vue')
		redirect: "/sale/main/pk/staff",
	},
	{
		path: "/sale/main/pk/staff",
		name: "sale-main-pk-staff",
		component: () => import("./modules/sale-main-pk-staff.vue")
	},
	{
		path: "/sale/main/pk/department",
		name: "sale-main-pk-department",
		component: () => import("./modules/sale-main-pk-department.vue")
	},
	{
		path: "/sale/main/pk/statistic",
		name: "sale-main-pk-statistic",
		component: () => import("./modules/sale-main-pk-statistic.vue")
	},
	{
		path: "/sale/main/scene",
		name: "sale-main-scene",
		component: () => import("./modules/sale-main-scene.vue")
	},
	{
		path: "/sale/full/information",
		name: "sale-full-information",
		component: () => import("./modules/sale-full-information.vue")
	},
	{
		path: "/sale/full/preview",
		name: "sale-full-preview",
		component: () => import("../content/modules/content-preview.vue")
	},
	{
		path: "/sale/full/casedetail",
		name: "sale-full-casedetail",
		component: () => import("./modules/sale-full-casedetail.vue")
	},
	{
		path: "/sale/full/lecturer",
		name: "sale-full-lecturer",
		component: () => import("./modules/sale-full-lecturer.vue")
	},
	/**
	 * 客户管理
	 */ {
		path: "/sale/customer/intention",
		name: "sale-customer-intention",
		component: () => import("./modules/sale-customer-intention.vue")
	},
	{
		path: "/sale/customer/deal/arrive",
		name: "sale-customer-deal-arrive",
		component: () => import("./modules/sale-customer-deal-arrive.vue")
	},
	{
		path: "/sale/customer/deal/contract",
		name: "sale-customer-deal-contract",
		component: () => import("./modules/sale-customer-deal-contract.vue")
	},
	{
		path: "/sale/customer/deal/deal",
		name: "sale-customer-deal-deal",
		component: () => import("./modules/sale-customer-deal-deal.vue")
	},
	{
		path: "/sale/customer/deal/supply",
		name: "sale-customer-deal-supply",
		component: () => import("./modules/sale-customer-deal-supply.vue")
	},
	{
		path: "/sale/customer/deal/refund",
		name: "sale-customer-deal-refund",
		component: () => import("./modules/sale-customer-deal-refund.vue")
	},
	{
		path: "/sale/customer/intention/detail",
		name: "sale-customer-intention-detail",
		component: () => import("./modules/sale-customer-intention-detail.vue")
	},
	{
		path: "/sale/customer/intention/record/add",
		name: "sale-customer-intention-record-add",
		component: () => import("./modules/sale-customer-intention-record-add.vue")
	},
	{
		path: "/sale/customer/intention/record/success",
		name: "sale-customer-intention-record-success",
		component: () => import("./modules/sale-customer-intention-record-success.vue")
	},
	{
		path: "/sale/customer/deal/arrive/record",
		name: "sale-customer-deal-arrive-add",
		component: () => import("./modules/sale-customer-intention-record-add.vue")
	},
	{
		path: '/sale/customer/deal/arrive/success',
		name: 'sale-customer-deal-arrive-success',
		component: () => import('./modules/sale-customer-intention-record-success.vue')
	},
	{
		path: "/sale/customer/deal/contract/order",
		name: "sale-customer-deal-contract-order",
		component: () => import("./modules/sale-customer-deal-contract-order.vue")
	},
	{
		path: "/sale/customer/deal/contract/success",
		name: "sale-customer-deal-contract-success",
		component: () => import("./modules/sale-customer-deal-contract-success.vue")
	},
	{
		path: "/sale/customer/deal/deal/detail",
		name: "sale-customer-deal-deal-detail",
		component: () => import("./modules/sale-customer-deal-deal-detail.vue")
	},
	{
		path: "/sale/customer/business",
		name: "sale-customer-business",
		component: () => import("./modules/sale-customer-business.vue")
	},
	{
		path: "/sale/customer/business/check",
		name: "sale-customer-business-check",
		component: () => import("./modules/sale-customer-business-check.vue")
	},
	{
		path: "/sale/customer/business/detail",
		name: "sale-customer-business-detail",
		component: () => import("./modules/sale-customer-business-detail.vue")
	},
	{
		path: "/sale/customer/audit/mistake",
		name: "sale-customer-audit-mistake",
		component: () => import("./modules/sale-customer-audit-mistake.vue")
	},
	{
		path: "/sale/customer/audit/delay",
		name: "sale-customer-audit-delay",
		component: () => import("./modules/sale-customer-audit-delay.vue")
	},
	/**
	 * 公海
	 */ {
		path: "/sale/sea/archive",
		name: "sale-sea-archive",
		component: () => import("./modules/sale-sea-archive.vue")
	},
	{
		path: "/sale/sea/setting",
		name: "sale-sea-setting",
		component: () => import("./modules/sale-sea-setting.vue")
	},
	{
		path: "/sale/sea/black",
		name: "sale-sea-black",
		component: () => import("./modules/sale-sea-black.vue")
	},
	{
		path: "/sale/sea/white",
		name: "sale-sea-white",
		component: () => import("./modules/sale-sea-white.vue")
	},
	/**
	 * 每日服务
	 */
	{
		path: "/sale/service/customer",
		name: "sale-service-customer",
		component: () => import("./modules/sale-service-customer.vue")
	},
	{
		path: "/sale/service/customer/application",
		name: "sale-service-customer-application",
		component: () => import("./modules/sale-service-customer-application.vue")
	},
	{
		path: "/sale/service/customer/do",
		name: "sale-service-customer-do",
		component: () => import("./modules/sale-service-do.vue")
	},
	/**
	 * 每日实时业绩
	 */

	{
		path: "/sale/achievement",
		name: "sale-achievement",
		component: () => import("./modules/sale-achievement.vue")
	},
	{
		path: '/sale/achievement/staff',
		name: 'sale-achievement-staff',
		component: () => import('./modules/sale-achievement-staff.vue')
	},

	/**
	 * 服务工具包
	 */

	{
		path: "/sale/setoolkit",
		name: "sale-setoolkit",
		component: () => import("./modules/sale-setoolkit.vue")
	},
	/**
	 * 销售工具包
	 */
	{
		path: "/sale/satoolkit",
		name: "sale-satoolkit",
		component: () => import("./modules/sale-satoolkit.vue")
	},

	/**
	 * 三立学府
	 */
	{
		path: "/sale/train/course",
		name: "sale-train-course",
		component: () => import("./modules/sale-train-course.vue")
	},
	{
		path: "/sale/train/course/detail",
		name: "sale-train-course-detail",
		component: () => import("./modules/sale-train-course-detail.vue")
	},
	{
		path: "/sale/train/employee",
		name: "sale-train-employee",
		component: () => import("./modules/sale-train-employee.vue")
	},
	{
		path: "/sale/train/employee/course",
		name: "sale-train-employee-course",
		component: () => import("./modules/sale-train-employee-course.vue")
	},
	{
		path: "/sale/train/study",
		name: "sale-train-study",
		component: () => import("./modules/sale-train-study.vue")
	},
	{
		path: "/sale/train/study/examine",
		name: "sale-train-study-examine",
		component: () => import("./modules/sale-train-study-examine.vue")
	},
	{
		path: "/sale/train/study/audit",
		name: "sale-train-study-audit",
		component: () => import("./modules/sale-train-study-audit.vue")
	},
	{
		path: "/sale/study/video",
		name: "sale-study-video",
		component: () => import("./modules/sale-study-video.vue")
	},
	{
		path: "/sale/train/study/question",
		name: "sale-train-study-question",
		component: () => import("../hr/modules/hr-academy-course-question-add.vue")
	},
	/**
	 * 积分学分
	*/
	{
		path: "/sale/fraction/integral",
		name: "sale-fraction-integral",
		component: () => import("./modules/sale-fraction-integral.vue")
	},
	{
		path: "/sale/fraction/integral/sub",
		name: "sale-fraction-integral-sub",
		component: () => import("./modules/sale-fraction-integral-sub.vue")
	},
	{
		path: "/sale/fraction/integral/detail",
		name: "sale-fraction-integral-detail",
		component: () => import("./modules/sale-fraction-integral-detail.vue")
	},
	{
		path: "/sale/fraction/material/application",
		name: "sale-fraction-material-application",
		component: () => import("./modules/sale-fraction-material-application.vue")
	},
	{
		path: "/sale/fraction/material/bank",
		name: "sale-fraction-material-bank",
		component: () => import("./modules/sale-fraction-material-bank.vue")
	},
	{
		path: "/sale/fraction/material/upload",
		name: "sale-fraction-material-upload",
		component: () => import("./modules/sale-fraction-material-upload.vue")
	},
	{
		path: "/sale/fraction/material/upload/my",
		name: "sale-fraction-material-upload-my",
		component: () => import("./modules/sale-fraction-material-upload-my.vue")
	},
	{
		path: "/sale/fraction/credit",
		name: "sale-fraction-credit",
		component: () => import("./modules/sale-fraction-credit.vue")
	},
	{
		path: "/sale/fraction/credit/sub",
		name: "sale-fraction-credit-sub",
		component: () => import("./modules/sale-fraction-credit-sub.vue")
	},
	{
		path: "/sale/fraction/credit/application",
		name: "sale-fraction-credit-application",
		component: () => import("./modules/sale-fraction-credit-application.vue")
	},
	{
		path: "/sale/fraction/credit/detail",
		name: "sale-fraction-credit-detail",
		component: () => import("./modules/sale-fraction-credit-detail.vue")
	},
	/**
	 * 开票申请
	 */
	{
		path: "/sale/ticket",
		name: "sale-ticket",
		component: () => import("./modules/sale-ticket.vue")
	},
	{
		path: "/sale/ticket/apply",
		name: "sale-ticket-apply",
		component: () => import("./modules/sale-ticket-apply.vue")
	},
	{
		path: '/sale/call/manage',
		name: 'sale-call-manage',
		component: () => import('./modules/sale-call-manage.vue')
	},
	{
		path: '/sale/call/record',
		name: 'sale-call-record',
		component: () => import('./modules/sale-call-record.vue')
	},
	{
		path: '/sale/full/goods',
		name: 'sale-full-goods',
		component: () => import('./modules/sale-full-goods.vue')
	},
	{
		path: '/sale/newuser',
		name: 'sale-newuser',
		component: () => import('./modules/sale-newuser.vue')
	},
	{
		path: '/sale/customer/intention/private',
		name: 'sale-customer-intention-private',
		component: () => import('./modules/sale-customer-intention-private.vue')
	},
	{
		path: '/sale/customer/deal/relation',
		name: 'sale-customer-deal-relation',
		component: () => import('./modules/sale-customer-deal-relation.vue')
	},
	{
		path: '/sale/customer/deal/relation/detail',
		name: 'sale-customer-deal-relation-detail',
		component: () => import('./modules/sale-customer-deal-relation-detail.vue')
	},
	{
		path: '/sale/main/service',
		name: 'sale-main-service',
		component: () => import('./modules/sale-main-service.vue')
	},
	{
		path: '/sale/main/work/data',
		name: 'sale-main-work-data',
		component: () => import('./modules/sale-main-work-data.vue')
	},
	{
		path: '/sale/customer/intention/test',
		name: 'sale-customer-intention-test',
		component: () => import('./modules/sale-customer-intention-test.vue')
	},
	{
		path: '/sale/property/center',
		name: 'sale-property-center',
		component: () => import('./modules/sale-property-center.vue')
	},
	{
		path: '/sale/property/mine',
		name: 'sale-property-mine',
		component: () => import('./modules/sale-property-mine.vue')
	},
	{
		path: '/sale/property/control',
		name: 'sale-property-control',
		component: () => import('./modules/sale-property-control.vue')
	},
	{
		path: '/sale/property/control/add',
		name: 'sale-property-control-add',
		component: () => import('./modules/sale-property-control-add.vue')
	},
	{
		path: '/sale/property/coin',
		name: 'sale-property-coin',
		component: () => import('./modules/sale-property-coin.vue')
	},
	{
		path: '/sale/property/coin/detail',
		name: 'sale-property-coin-detail',
		component: () => import('./modules/sale-property-coin-detail.vue')
	},
	{
		path: '/sale/property/coin/policy',
		name: 'sale-property-coin-policy',
		component: () => import('./modules/sale-property-coin-policy.vue')
	},
	{
		path: '/sale/customer/intention/add',
		name: 'sale-customer-intention-add',
		component: () => import('./modules/sale-customer-intention-add.vue')
	},
	{
		path: '/sale/customer/intention/add/personal',
		name: 'sale-customer-intention-add-personal',
		component: () => import('./modules/sale-customer-intention-add-personal.vue')
	},
	{
		path: '/sale/customer/intention/add/confirm',
		name: 'sale-customer-intention-add-confirm',
		component: () => import('./modules/sale-customer-intention-add-confirm.vue')
	},
	{
		path: '/sale/customer/intention/add/sea',
		name: 'sale-customer-intention-add-sea',
		component: () => import('./modules/sale-customer-intention-add-sea.vue')
	},
	{
		path: '/sale/customer/intention/concern',
		name: 'sale-customer-intention-concern',
		component: () => import('./modules/sale-customer-intention-concern.vue')
	},
	{
		path: '/sale/main/case',
		name: 'sale-main-case',
		component: () => import('./modules/sale-main-case.vue')
	},
	{
		path: '/sale/main/case/detail',
		name: 'sale-main-case-detail',
		component: () => import('./modules/sale-main-case-detail.vue')
	},
	{
		path: '/sale/main/circle',
		name: 'sale-main-circle',
		component: () => import('./modules/sale-main-circle.vue')
	},
	{
		path: '/sale/main/circle/detail',
		name: 'sale-main-circle-detail',
		component: () => import('./modules/sale-main-circle-detail.vue')
	},
	{
		path: '/sale/main/work/data/detail',
		name: 'sale-main-work-data-detail',
		component: () => import('./modules/sale-main-work-data-detail.vue')
	},
	{
		path: '/sale/main/set',
		name: 'sale-main-set',
		component: () => import('./modules/sale-main-set.vue')
	}
];

export const saleOtherConfig = [ 
	{
		path: '/sale/pk',
		name: 'sale-pk',
		component: () => import('@containers/sale/modules/sale-pk')
	}
];
