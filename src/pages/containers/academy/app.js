import { getIndexRoute, getRedirectRoute } from '@utils/utils';
import { getAcademyRoutes } from '@components/layout/left/academy';

export const academyConfig = [
	{
		path: '/academy',
		beforeEnter: (to, from, next) => {
			let redirect = getIndexRoute(getAcademyRoutes(_global.auth, _global.staff));
			next({ path: getRedirectRoute(redirect) });
		},
	},
	{
		path: '/academy/main',
		name: 'academy-main',
		component: () => import('./modules/academy-main.vue')
	},
	{
		path: '/academy/main/enroll',
		name: 'academy-main-enroll',
		component: () => import('./modules/academy-main-enroll.vue')
	},
	{
		path: '/academy/transfer/transfer',
		name: 'academy-transfer-transfer',
		component: () => import('./modules/academy-transfer-transfer.vue')
	},
	{
		path: '/academy/transfer/transfer/:type/:id',
		name: 'academy-transfer-transfer-detail',
		component: () => import('./modules/academy-transfer-transfer-detail.vue')
	},
	{
		path: '/academy/transfer/statistics',
		name: 'academy-transfer-statistics',
		component: () => import('./modules/academy-transfer-statistics.vue')
	},
	{
		path: '/academy/transfer/statistics/try/detail',
		name: 'academy-transfer-statistics-try-detail',
		component: () => import('./modules/academy-transfer-statistics-try-detail.vue')
	},
	{
		path: '/academy/transfer/statistics/teacher',
		name: 'academy-transfer-statistics-teacher',
		component: () => import('./modules/academy-transfer-statistics-teacher.vue')
	},
	{
		path: '/academy/support/tool',
		name: 'academy-support-tool',
		component: () => import('./modules/academy-support-tool.vue')
	},
	{
		path: '/academy/support/study',
		name: 'academy-support-study',
		component: () => import('./modules/academy-support-study.vue')
	},
	{
		path: '/academy/support/course',
		name: 'academy-support-course',
		component: () => import('./modules/academy-support-course.vue')
	},
	{
		path: '/academy/support/course/add',
		name: 'academy-support-course-add',
		component: () => import('./modules/academy-support-course-add.vue')
	},
	{
		path: '/academy/statistics/student',
		name: 'academy-statistics-student',
		component: () => import('./modules/academy-statistics-student.vue')
	},
	{
		path: '/academy/statistics/course',
		name: 'academy-statistics-course',
		component: () => import('./modules/academy-statistics-course.vue')
	},
	{
		path: '/academy/train/schedule',
		name: 'academy-train-schedule',
		component: () => import('./modules/academy-train-schedule.vue')
	},
	{
		path: '/academy/train/plan',
		name: 'academy-train-plan',
		component: () => import('./modules/academy-train-plan.vue')
	},
	{
		path: '/academy/train/plan/train',
		name: 'academy-train-plan-train',
		component: () => import('./modules/academy-train-plan-train.vue')
	},
	{
		path: '/academy/train/plan/manage',
		name: 'academy-train-plan-manage',
		component: () => import('./modules/academy-train-plan-manage.vue')
	},
	{
		path: '/academy/train/upload',
		name: 'academy-train-upload',
		component: () => import('./modules/academy-train-upload.vue')
	},
	{
		path: '/academy/train/plan/detail',
		name: 'academy-train-plan-detail',
		component: () => import('./modules/academy-train-plan-detail.vue'),
		children: [
			{
				path: '/academy/train/plan/detail/participate',
				name: 'academy-train-plan-detail-participate',
				component: () => import('./modules/academy-train-plan-detail-participate.vue')
			},
			{
				path: '/academy/train/plan/detail/sign',
				name: 'academy-train-plan-detail-sign',
				component: () => import('./modules/academy-train-plan-detail-sign.vue')
			},
			{
				path: '/academy/train/plan/detail/exam',
				name: 'academy-train-plan-detail-exam',
				component: () => import('./modules/academy-train-plan-detail-exam.vue')
			}
		]
	},
	{
		path: '/academy/train/schedule/detail',
		name: 'academy-train-schedule-detail',
		component: () => import('./modules/academy-train-schedule-detail.vue')
	},
	{
		path: '/academy/support/tool/manage',
		name: 'academy-support-tool-manage',
		component: () => import('./modules/academy-support-tool-manage.vue')
	},
	{
		path: '/academy/support/tool/set',
		name: 'academy-support-tool-set',
		component: () => import('./modules/academy-support-tool-set.vue')
	},
	{
		path: '/academy/support/tool/download',
		name: 'academy-support-tool-download',
		component: () => import('./modules/academy-support-tool-download.vue')
	},
	{
		path: '/academy/support/study/manage',
		name: 'academy-support-study-manage',
		component: () => import('./modules/academy-support-study-manage.vue')
	},
	{
		path: '/academy/support/study/set',
		name: 'academy-support-study-set',
		component: () => import('./modules/academy-support-study-set.vue')
	},
	{
		path: '/academy/support/statistics/manage',
		name: 'academy-support-statistics-manage',
		component: () => import('./modules/academy-support-statistics-manage.vue')
	},
	{
		path: '/academy/support/statistics/warning',
		name: 'academy-support-statistics-warning',
		component: () => import('./modules/academy-support-statistics-warning.vue')
	},
	{
		path: '/academy/support/statistics/manage/detail',
		name: 'academy-support-statistics-manage-detail',
		component: () => import('./modules/academy-support-statistics-manage-detail.vue')
	},
	{
		path: '/academy/support/study/download',
		name: 'academy-support-study-download',
		component: () => import('./modules/academy-support-study-download.vue')
	},
	{
		path: '/academy/statistics/course/name',
		name: 'academy-statistics-course-name',
		component: () => import('./modules/academy-statistics-course-name.vue')
	},
	{
		path: '/academy/statistics/course/type',
		name: 'academy-statistics-course-type',
		component: () => import('./modules/academy-statistics-course-type.vue')
	},
	{
		path: '/academy/statistics/course/trend',
		name: 'academy-statistics-course-trend',
		component: () => import('./modules/academy-statistics-course-trend.vue')
	},
	{
		path: '/academy/support/case',
		name: 'academy-support-case',
		component: () => import('./modules/academy-support-case.vue')
	},
	{
		path: '/academy/support/case/add',
		name: 'academy-support-case-add',
		component: () => import('./modules/academy-support-case-add.vue')
	},
	{
		path: '/academy/support/case/detail',
		name: 'academy-support-case-detail',
		component: () => import('./modules/academy-support-case-detail.vue')
	}
];
