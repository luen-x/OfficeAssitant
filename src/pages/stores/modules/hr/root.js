import { hrMain } from './main';
import { hrMainSchedule } from './main-schedule';

import { hrRecruitSchoolSummary } from './recruit-school-summary';
import { hrRecruitSchoolSummaryAdd } from './recruit-school-summary-add';
import { hrRecruitSchoolSummaryDetail } from './recruit-school-summary-detail';
import { hrRecruitSchoolSummaryElists } from './recruit-school-summary-elists';
import { hrRecruitSchoolJobfair } from './recruit-school-jobfair';
import { hrRecruitSchoolStatistics } from './recruit-school-statistics';
import { hrRecruitSchoolStatisticsInfo } from './recruit-school-statistics-info';
import { hrRecruitSocialSummary } from './recruit-social-summary';
import { hrRecruitSocialSummaryAdd } from './recruit-social-summary-add';
import { hrRecruitSocialDetails } from './recruit-social-details';
import { hrRecruitSocialTalent } from './recruit-social-talent';
import { hrRecruitSocialStatistics } from './recruit-social-transform';
import { hrRecruitSocialStatisticsPositionDetails } from './recruit-social-statistics-position-details';
import { hrRecruitSocialBlacklist } from './recruit-social-blacklist';
import { hrNeedPostion } from './recruit-social-need-position';
import { hrRecruitSocialSocialTransformDetails } from './recruit-social-social-transform-details';
import { hrRecruitSchoolJobfairInfo } from './recruit-school-jobfair-info';
import { hrRecruitSchoolJobfairAdd } from './recruit-school-jobfair-add';
import { hrRecruitSchoolJobfairEdit } from './recruit-school-jobfair-edit';
import { hrRecruitSchoolJobfairSchool } from './recruit-school-jobfair-school';
import { hrRecruitSchoolTryassign } from './recruit-school-tryassign';
import { hrRecruitSchoolAssigndetails } from './recruit-school-assigndetails';
import { hrRecruitSchoolIdentify } from './recruit-school-identify';

import { hrSummary } from './summary';
import { hrEmployeeSummaryProfile } from './employee-summary-profile';
import { hrEmployeeSummaryResume } from './employee-summary-resume';
import { hrEmployeeSummaryEntry } from './employee-summary-entry';
import { hrEmployeeSummaryDetails } from './employee-summary-details';
import { hrEmployeeRankPromo } from './employee-rank-promo';
import { hrEmployeeRankTitle } from './employee-rank-title';
import { hrEmployeeRankPromoRecord } from './employee-rank-promo-record';
import { hrEmployeeDataBasic } from './employee-data-basic';
import { hrEmployeeDataEmdata } from './employee-data-emdata';
import { hrEmployeeRelationTry } from './employee-relation-try';
import { hrEmployeeRelationPact } from './employee-relation-pact';
import { hrEmployeeRelationTran } from './employee-relation-tran';
import { hrEmployeeRelationLeave } from './employee-relation-leave';
import { hrEmployeeRelationTryInvoice } from './employee-relation-try-invoice';
import { hrEmployeeRelationLeaveInvoice } from './employee-relation-leave-invoice';

import { hrSalaryWageMonthly } from './salary-wage-monthly';
import { hrSalaryWageHistory } from './salary-wage-history';
import { hrSalarySubsidyTraffic } from './salary-subsidy-traffic';
import { hrSalaryBase } from './salary-base';
import { hrSalaryPer } from './salary-per';

import { hrPoints } from './points';
import { hrPointsPointsConfirm } from './points-confirm';
import { hrPointsComplaint } from './points-complaint';

import { hrOrganization } from './organization';
import { hrPosition } from './position';

import { hrRank } from './rank';
import { hrRankInfo } from './rank-info';
import { hrRankSetting } from './rank-setting';

import { hrToolWorkflow } from './tool-workflow';
import { hrToolModulesOffer } from './tool-modules-offer';
import { hrToolModulesOfferAdd } from './tool-modules-offer-add';
import { hrToolModulesUpload } from './tool-modules-upload';

import { hrForm } from './form';
import { hrEmployeeTransfer } from './employee-transfer';
import { hrEmployeeDimission } from './employee-dimission';
import { hrRecruitSchoolOrganization } from './recruit-school-organization';
import { hrRecruitSchoolPaper } from './recruit-school-paper';
import { hrRecruitSchoolPaperEdit } from './recruit-school-paper-edit';
import { hrRecruitSchoolPaperPreview } from './recruit-school-paper-preview';
import { hrRecruitSchoolPaperResult } from './recruit-school-paper-result';

import { hrRecruitSchoolWar } from './recruit-school-war';
import { hrRecruitSchoolDepart } from './recruit-school-depart';
import { hrEmployeeScoreIntegration } from './employee-score-integration';
import { hrEmployeeScoreCredit } from './employee-score-credit';
import { hrEmployeeRankUp } from './employee-rank-up';
import { hrEmployeeRankStatistics } from './employee-rank-statistics';
import { hrEmployeeCheck } from './employee-check';
import { hrEmployeeMentorSelect } from './employee-mentor-select';
import { hrEmployeeMentorRelation } from './employee-mentor-relation';
import { hrEmployeeMentorRule } from './employee-mentor-rule';
import { hrSalarySocialSubsidy } from './salary-social-subsidy';
import { hrSalarySocialHistory } from './salary-social-history';
import { hrSalarySocialSetting } from './salary-social-setting';
import { hrAcademyTransferTransfer } from './academy-transfer-transfer';
import { hrAcademyTransferStatistic } from './academy-transfer-statistic';
import { hrAcademyTransferTryDetail } from './academy-transfer-try-detail';
import { hrAcademyTransferTeacherDetail } from './academy-transfer-teacher-detail';
import { hrAcademyTransferDemandDetail } from './academy-transfer-demand-detail';
import { hrAcademyCourseStore } from './academy-course-store';
import { hrAcademyCourseQuestion } from './academy-course-question';
import { hrAcademyCourseQuestionAdd } from './academy-course-question-add';
import { hrAcademyCourseQuestionSelect } from './academy-course-question-select';
import { hrAcademyCourseQuestionAudit } from './academy-course-question-audit';
import { hrAcademyCoursePaper } from './academy-course-paper';
import { hrAcademyCoursePaperAdd } from './academy-course-paper-add';
import { hrAcademyCoursePaperEdit } from './academy-course-paper-edit';
import { hrAcademyStatisticStudy } from './academy-statistic-study';
import { hrAcademyStatisticStudyDetail } from './academy-statistic-study-detail';
import { hrAcademyStatisticCourse } from './academy-statistic-course';
import { hrAcademyEliteTalent } from './academy-elite-talent';
import { hrAcademyEliteSetting } from './academy-elite-setting';
import { hrAcademyTrainSchedule } from './academy-train-schedule';
import { hrAcademyTrainArrangement } from './academy-train-arrangement';
import { hrSalaryTeam } from './salary-team';
import { hrArchivesEmployeeBusiness } from './archives-employee-business';
import { hrArchivesEmployeeBusinessDetail } from './archives-employee-business-detail';
import { hrArchivesEmployeeBusinessWatch } from './archives-employee-business-watch';
import { hrArchivesEmployeeCustomer } from './archives-employee-customer';
import { hrArchivesEmployeeOutput } from './archives-employee-output';
import { hrArchivesEmployeeTarget } from './archives-employee-target';
import { hrArchivesAchieRank } from './archives-achie-rank';
import { hrArchivesAchiePk } from './archives-achie-pk';
import { hrArchivesAchieTrend } from './archives-achie-trend';
import { hrArchivesPerson } from './archives-person';
import { hrArchivesAudit } from './archives-audit';
import { hrEmployeeDataCommissar } from './employee-data-commissar';
import { hrSystemOrganization } from './system-organization';
import { hrSystemPosition } from './system-position';
import { hrSystemRole } from './system-role';
import { hrSystemAssessRank } from './system-assess-rank';
import { hrSystemAssessUp } from './system-assess-up';
import { hrSystemAssessIntegration } from './system-assess-integration';
import { hrSystemAssessCredit } from './system-assess-credit';
import { hrSystemAssessStatistics } from './system-assess-statistics';
import { hrAcademyTrainDetailParticipate0Roster } from './academy-train-detail-participate-0-roster';
import { hrAcademyTrainDetailSign0Manage } from './academy-train-detail-sign-0-manage';
import { hrAcademyTrainDetailPaper0Pass } from './academy-train-detail-paper-0-pass';
import { hrAcademyTrainDetailPaper0Audit } from './academy-train-detail-paper-0-audit';
import { hrAcademyTrainDetailPaper3Result } from './academy-train-detail-paper-3-result';
import { hrAcademyTrainDetailVote0Manage } from './academy-train-detail-vote-0-manage';
import { hrAcademyTrainDetailEnroll0Manage } from './academy-train-detail-enroll-0-manage';
import { hrAcademyTrainDetailEnroll2Result } from './academy-train-detail-enroll-2-result';
import { hrAcademyTrainDetailDraw0Manage } from './academy-train-detail-draw-0-manage';
import { hrAcademyTrainDetailDraw1Result } from './academy-train-detail-draw-1-result';
import { hrSystemAssessStatisticsAdd } from './system-assess-statistics-add';
import { hrAcademyTrainScheduleAdd } from './academy-train-schedule-add';
import { hrArchivesPersonDetailsOther } from './archives-person-details-other';
import { hrArchivesPersonDetailsOtherFollow } from './archives-person-details-other-follow';
import { hrAcademyTrainArrangementAudit } from './academy-train-arrangement-audit';


import { hrSystemAssessUpAdd } from './system-assess-up-add';
import { hrSystemAssessIntegrationAdd } from './system-assess-integration-add';
import { hrSystemAssessIntegrationRules } from './system-assess-integration-rules';
import { hrSystemAssessCreditAdd } from './system-assess-credit-add';
import { hrSystemAssessCreditRules } from './system-assess-credit-rules';
import { hrEmployeeScoreIntegrationAudit } from './employee-score-integration-audit';
import { hrEmployeeScoreCreditAudit } from './employee-score-credit-audit';
import { hrEmployeeScoreCreditRank } from './employee-score-credit-rank';
import { hrEmployeeScoreCreditDetail } from './employee-score-credit-detail';
import { hrEmployeeScoreIntegrationRank } from './employee-score-integration-rank';
import { hrEmployeeScoreIntegrationDetail } from './employee-score-integration-detail';
import { hrEmployeeScoreServiceExamine } from './employee-score-service-examine';
import { hrEmployeeScoreServiceComplaints } from './employee-score-service-complaints';
import { hrPersonnelMemberMaster } from './personnel-member-master';
import { hrPersonnelInfoDemand } from './personnel-info-demand';
import { hrPersonnelInfoRecommend } from './personnel-info-recommend';
import { hrPersonnelMemberRelationship } from './personnel-member-relationship';
import { hrPersonnelMemberMemberStaff } from './personnel-member-member-staff';
import { hrAcademyCourseExam } from './academy-course-exam';
import { hrAcademyCourseExamView } from './academy-course-exam-view';
import { hrRecruitSchoolSummaryElook } from './recruit-school-summary-elook';
import { hrRecruitSchoolSummaryEdit } from './recruit-school-summary-edit';
import { hrRecruitSocialEntry } from './recruit-social-entry';
import { hrRecruitSchoolEntry } from './recruit-school-entry';
import { hrRecruitSocialInterview } from './recruit-social-interview';
import { hrRecruitResumeImg } from './recruit-resume-img';
import { hrRecruitSocialIdentify } from './recruit-social-identify';
import { hrRecruitSchoolIdentifyDetail } from './recruit-school-identify-detail';
import { hrRecruitSocialIdentifyDetail } from './recruit-social-identify-detail';
import { hrConsultation } from './consultation';
import { hrEmployeeScoreIntegrationLeadin } from './employee-score-integration-leadin';
import { hrEmployeeScoreCreditLeadin } from './employee-score-credit-leadin';
import { hrRecruitTalentLeave } from './recruit-talent-leave';
import { hrRecruitTalentInviteObsolete } from './recruit-talent-invite-obsolete';
import { hrPersonnelCurrency } from './personnel-currency';
import { hrPersonnelReport } from './personnel-report';
import { hrPersonnelCurrencyRewards } from './personnel-currency-rewards';
import { hrPersonnelMemberDistribution } from './personnel-member-distribution';
import { hrPersonnelMemberDetail } from './personnel-member-detail';
import { hrToolModulesEdit } from './tool-modules-edit';

export default {
	/**
	 * 首页
	 */
	hrMain,
	hrMainSchedule,

	/**
	 * 招聘管理
	 */
	hrRecruitSchoolSummary,
	hrRecruitSchoolSummaryAdd,
	hrRecruitSchoolSummaryDetail,
	hrRecruitSchoolSummaryElists,
	hrRecruitSchoolIdentify,

	hrRecruitSchoolJobfair,
	hrRecruitSchoolJobfairSchool,
	hrRecruitSchoolStatistics,
	hrRecruitSchoolStatisticsInfo,
	hrRecruitSchoolTryassign,
	hrRecruitSchoolAssigndetails,
	hrRecruitSchoolOrganization,
	hrRecruitSchoolPaper,
	hrRecruitSchoolPaperEdit,
	hrRecruitSchoolPaperPreview,
	hrRecruitSchoolPaperResult,
	
	hrRecruitSocialSummary,
	hrRecruitSocialSummaryAdd,
	hrRecruitSocialDetails,
	hrRecruitSocialTalent,
	hrRecruitSocialStatistics,
	hrRecruitSocialStatisticsPositionDetails,
	hrRecruitSocialBlacklist,
	hrNeedPostion,
	hrRecruitSocialSocialTransformDetails,
	hrRecruitSchoolJobfairInfo,
	hrRecruitSchoolJobfairAdd,
	hrRecruitSchoolJobfairEdit,

	/**
	 * 员工管理
	 */
	hrEmployeeSummaryProfile,
	hrEmployeeSummaryEntry,
	hrEmployeeSummaryResume,
	hrEmployeeSummaryDetails,
	hrEmployeeRankPromo,
	hrEmployeeRankTitle,
	hrEmployeeRankPromoRecord,
	hrEmployeeDataBasic,
	hrEmployeeDataEmdata,
	hrEmployeeRelationTry,
	hrEmployeeRelationPact,
	hrEmployeeRelationTran,
	hrEmployeeRelationLeave,
	hrEmployeeRelationTryInvoice,
	hrEmployeeRelationLeaveInvoice,
	hrEmployeeTransfer,
	hrEmployeeDimission,
	hrSummary,

	/**
	 * 薪资补贴
	 */
	hrSalaryWageMonthly,
	hrSalaryWageHistory,
	hrSalarySubsidyTraffic,
	hrSalaryBase,
	hrSalaryPer,

	/**
	 * 服务积分
	 */
	hrPoints,
	hrPointsPointsConfirm,
	hrPointsComplaint,

	/**
	 * 组织架构
	 */
	hrOrganization,

	/**
	 * 职位设置
	 */
	hrPosition,

	/**
	 * 级称设置
	 */
	hrRank,
	hrRankInfo,
	hrRankSetting,

	/**
	 * 常用工具
	 */
	hrToolWorkflow,
	hrToolModulesOffer,
	hrToolModulesOfferAdd,
	hrToolModulesUpload,

	/**
	 * 表单
	 */
	hrForm,
	hrRecruitSchoolWar,
	hrRecruitSchoolDepart,
	hrEmployeeScoreIntegration,
	hrEmployeeScoreCredit,
	hrEmployeeRankUp,
	hrEmployeeRankStatistics,
	hrEmployeeCheck,
	hrEmployeeMentorSelect,
	hrEmployeeMentorRelation,
	hrEmployeeMentorRule,
	hrSalarySocialSubsidy,
	hrSalarySocialHistory,
	hrSalarySocialSetting,


	hrAcademyTransferTransfer,
	hrAcademyTransferStatistic,
	hrAcademyTransferTryDetail,
	hrAcademyTransferTeacherDetail,
	hrAcademyTransferDemandDetail,
	hrAcademyCourseStore,
	hrAcademyCourseQuestion,
	hrAcademyCourseQuestionAdd,
	hrAcademyCourseQuestionAudit,
	hrAcademyCourseQuestionSelect,
	hrAcademyCoursePaper,
	hrAcademyCoursePaperAdd,
	hrAcademyCoursePaperEdit,
	hrAcademyStatisticStudy,
	hrAcademyStatisticStudyDetail,
	hrAcademyStatisticCourse,
	hrAcademyEliteTalent,
	hrAcademyEliteSetting,
	hrAcademyTrainSchedule,
	hrAcademyTrainArrangement,
	hrSalaryTeam,
	hrArchivesEmployeeBusiness,
	hrArchivesEmployeeBusinessDetail,
	hrArchivesEmployeeBusinessWatch,
	hrArchivesEmployeeCustomer,
	hrArchivesEmployeeOutput,
	hrArchivesEmployeeTarget,
	hrArchivesAchieRank,
	hrArchivesAchiePk,
	hrArchivesAchieTrend,
	hrArchivesPerson,
	hrArchivesAudit,
	hrEmployeeDataCommissar,
	hrSystemOrganization,
	hrSystemPosition,
	hrSystemRole,
	hrSystemAssessRank,
	hrSystemAssessUp,
	hrSystemAssessIntegration,
	hrSystemAssessCredit,
	hrSystemAssessStatistics,
	hrAcademyTrainDetailSign0Manage,
	hrAcademyTrainDetailParticipate0Roster,
	hrAcademyTrainDetailVote0Manage,
	hrAcademyTrainDetailEnroll0Manage,
	hrAcademyTrainDetailEnroll2Result,
	hrAcademyTrainDetailDraw0Manage,
	hrAcademyTrainDetailDraw1Result,
	hrSystemAssessStatisticsAdd,
	hrAcademyTrainScheduleAdd,
	hrArchivesPersonDetailsOther,
	hrArchivesPersonDetailsOtherFollow,
	hrSystemAssessUpAdd,
	hrSystemAssessIntegrationAdd,
	hrSystemAssessIntegrationRules,
	hrAcademyTrainArrangementAudit,
	hrSystemAssessCreditAdd,
	hrSystemAssessCreditRules,
	hrEmployeeScoreIntegrationAudit,
	hrEmployeeScoreCreditAudit,
	hrEmployeeScoreCreditRank,
	hrEmployeeScoreCreditDetail,
	hrEmployeeScoreIntegrationRank,
	hrEmployeeScoreIntegrationDetail,
	hrEmployeeScoreServiceExamine,
	hrEmployeeScoreServiceComplaints,
	hrPersonnelMemberMaster,
	hrPersonnelInfoDemand,
	hrPersonnelInfoRecommend,
	hrPersonnelMemberRelationship,
	hrPersonnelMemberMemberStaff,

	// 考试
	hrAcademyTrainDetailPaper0Pass,
	hrAcademyTrainDetailPaper0Audit,
	hrAcademyTrainDetailPaper3Result,
	hrAcademyCourseExam,
	hrAcademyCourseExamView,
	hrRecruitSchoolSummaryElook,
	hrRecruitSchoolSummaryEdit,
	hrRecruitSocialEntry,
	hrRecruitSchoolEntry,
	hrRecruitSocialInterview,
	hrRecruitResumeImg,
	hrRecruitSocialIdentify,
	hrRecruitSchoolIdentifyDetail,
	hrRecruitSocialIdentifyDetail,
	hrConsultation,
	hrEmployeeScoreIntegrationLeadin,
	hrEmployeeScoreCreditLeadin,
	hrRecruitTalentLeave,
	hrRecruitTalentInviteObsolete,
	hrPersonnelCurrency,
	hrPersonnelReport,
	hrPersonnelCurrencyRewards,
	hrPersonnelMemberDistribution,
	hrPersonnelMemberDetail,
	hrToolModulesEdit
};
