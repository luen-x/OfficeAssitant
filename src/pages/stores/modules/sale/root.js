import { saleMain } from "./main";
import { saleCustomerIntention } from "./customer-intention";
import { saleSeaArchive } from "./sea-archive";
import { saleSeaSetting } from "./sea-setting";
import { saleSeaWhite } from "./sea-white";
import { saleServiceCustomer } from "./service-customer";
import { saleServiceCustomerApplication } from "./service-customer-application";
import { saleSetoolkit } from "./setoolkit";
import { saleSatoolkit } from "./satoolkit";
import { saleTicket } from "./ticket";
import { saleCustomerDealArrive } from "./customer-deal-arrive";
import { saleCustomerDealContract } from "./customer-deal-contract";
import { saleCustomerDealDeal } from "./customer-deal-deal";
import { saleCustomerDealSupply } from "./customer-deal-supply";
import { saleCustomerDealRefund } from "./customer-deal-refund";
import { saleCustomerIntentionDetail } from "./customer-intention-detail";
import { saleCustomerIntentionRecordAdd } from "./customer-intention-record-add";
import { saleCustomerIntentionRecordSuccess } from "./customer-intention-record-success";
import { saleCustomerDealContractOrder } from "./customer-deal-contract-order";
import { saleCustomerDealContractSuccess } from "./customer-deal-contract-success";
import { saleMainPk } from "./main-pk";
import { saleMainPkStaff } from "./main-pk-staff";
import { saleMainPkDepartment } from "./main-pk-department";
import { saleMainPkStatistic } from "./main-pk-statistic";
import { saleServiceCustomerDo } from "./service-customer-do";
import { saleTicketApply } from "./ticket-apply";
import { saleMainScene } from "./main-scene";
import { saleCustomerDealDealDetail } from "./customer-deal-deal-detail";
import { saleFullInformation } from "./full-information";
import { saleFullInformdetail } from "./full-informdetail";
import { saleFullCasedetail } from "./full-casedetail";
import { saleCallRecord } from "./call-record";
import { saleCallModal } from "./call-modal";
import { saleAchievementStaff } from './achievement-staff';
import { saleFullGoods } from './full-goods';
import { saleAchievement } from './achievement';
import { saleNewuser } from './newuser';
import { saleSeaBlack } from './sea-black';
import { saleCustomerBusiness } from './customer-business';
import { saleCustomerBusinessCheck } from './customer-business-check';
import { saleCustomerBusinessDetail } from './customer-business-detail';
import { saleTrainCourse } from './train-course';
import { saleTrainCourseDetail } from './train-course-detail';
import { saleTrainEmployee } from './train-employee';
import { saleTrainEmployeeCourse } from './train-employee-course';
import { saleTrainStudy } from './train-study';
import { saleTrainStudyExamine } from './train-study-examine';
import { saleTrainStudyAudit } from './train-study-audit';
import { saleFractionIntegral } from './fraction-integral';
import { saleFractionIntegralSub } from './fraction-integral-sub';
import { saleFractionMaterialApplication } from './fraction-material-application';
import { saleFractionMaterialBank } from './fraction-material-bank';
import { saleFractionMaterialUpload } from './fraction-material-upload';
import { saleFractionMaterialUploadMy } from './fraction-material-upload-my';
import { saleFractionCredit } from './fraction-credit';
import { saleFractionCreditSub } from './fraction-credit-sub';
import { saleFractionCreditApplication } from './fraction-credit-application';
import { saleCustomerIntentionPrivate } from './customer-intention-private';
import { saleCustomerDealRelation } from './customer-deal-relation';
import { saleCustomerDealRelationDetail } from './customer-deal-relation-detail';
import { saleMainService } from './main-service';
import { saleMainWorkData } from './main-work-data';
import { saleMainWorkDataDetail } from './main-work-data-detail';
import { saleCustomerIntentionTest } from './customer-intention-test';
import { salePropertyCenter } from './property-center';
import { salePropertyMine } from './property-mine';
import { salePropertyControl } from './property-control';
import { salePropertyCoin } from './property-coin';
import { salePropertyCoinDetail } from './property-coin-detail';
import { saleCustomerIntentionAdd } from './customer-intention-add';
import { saleCustomerIntentionAddPersonal } from './customer-intention-add-personal';
import { saleCustomerIntentionAddConfirm } from './customer-intention-add-confirm';
import { saleCustomerIntentionAddSea } from './customer-intention-add-sea';
import { saleCustomerIntentionDistribute } from './customer-intention-distribute';
import { saleCustomerAuditMistake } from './customer-audit-mistake';
import { saleCustomerAuditDelay } from './customer-audit-delay';
import { saleCustomerIntentionConcern } from './customer-intention-concern';
import { saleMainCase } from './main-case';
import { saleMainCaseDetail } from './main-case-detail';
import { saleMainCircle } from './main-circle';
import { saleMainCircleDetail } from './main-circle-detail';
import { saleMainSet } from './main-set';

export default {
	/**
	 * 首页
	 */
	saleMain,
	saleMainPk,
	saleMainPkStaff,
	saleMainPkDepartment,
	saleMainPkStatistic,
	saleMainScene,
	saleFullInformation,
	saleFullInformdetail,
	saleFullCasedetail,
	saleMainWorkDataDetail,
	/**
	 * 客户管理
	 */
	saleCustomerIntention,
	saleCustomerIntentionPrivate,
	saleCustomerDealArrive,
	saleCustomerDealContract,
	saleCustomerDealDeal,
	saleCustomerDealSupply,
	saleCustomerDealRefund,
	saleCustomerIntentionDetail,
	saleCustomerIntentionRecordAdd,
	saleCustomerIntentionRecordSuccess,
	saleCustomerDealContractOrder,
	saleCustomerDealContractSuccess,
	saleCustomerDealDealDetail,
	saleCustomerBusiness,
	saleCustomerBusinessCheck,
	saleCustomerBusinessDetail,
	saleCustomerIntentionDistribute,
	saleCustomerAuditMistake,
	saleCustomerAuditDelay,
	/**
	 * 公海档案
	 */
	saleSeaArchive,
	saleSeaSetting,
	saleSeaWhite,
	/**
	 * 每日服务
	 */
	saleServiceCustomer,
	saleServiceCustomerApplication,
	saleServiceCustomerDo,
	/**
	 * 实时业绩
	 */
	saleAchievement,
	/**
	 * 服务工具包
	 */
	saleSetoolkit,
	/**
	 * 销售工具包
	 */
	saleSatoolkit,
	/**
	 * 三立学府
	 */
	saleTrainCourse,
	saleTrainCourseDetail,
	saleTrainEmployee,
	saleTrainEmployeeCourse,
	saleTrainStudy,
	saleTrainStudyExamine,
	saleTrainStudyAudit,
	/**
	 * 积分学分
	 */
	saleFractionIntegral,
	saleFractionIntegralSub,
	saleFractionCredit,
	saleFractionCreditSub,
	saleFractionCreditApplication,
	saleFractionMaterialApplication,
	saleFractionMaterialBank,
	saleFractionMaterialUpload,
	saleFractionMaterialUploadMy,
	/**
	 * 开票申请
	 */
	saleTicket,
	saleTicketApply,

	/**
	 * 录音
	 */
	saleCallRecord,
	saleCallModal,
	saleAchievementStaff,
	saleFullGoods,
	saleNewuser,
	saleSeaBlack,
	saleCustomerDealRelation,
	saleCustomerDealRelationDetail,
	saleMainService,
	saleMainWorkData,
	saleCustomerIntentionTest,

	/**
	 * 道具中心
	 */
	salePropertyCenter,
	salePropertyMine,
	salePropertyControl,
	salePropertyCoin,
	salePropertyCoinDetail,

	/**
	 * 添加资料
	 */
	saleCustomerIntentionAdd,
	saleCustomerIntentionAddPersonal,
	saleCustomerIntentionAddConfirm,
	saleCustomerIntentionAddSea,
	saleCustomerIntentionConcern,
	saleMainCase,
	saleMainCaseDetail,
	saleMainCircle,
	saleMainCircleDetail,
	saleMainSet
};
