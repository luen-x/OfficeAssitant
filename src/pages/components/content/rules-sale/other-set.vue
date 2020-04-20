<template>
	<div class="page">
		<i-orther-item :select-list="recordList" type="record" api="_CONTENT_SYSTEM_SALE_CONFIG_RECORD_LOG_POST" title="“跟进记录”举报次数限制"/>
		<i-orther-item :select-list="relationList" type="relation" api="_CONTENT_SYSTEM_SALE_CONFIG_RELATION_POST" title="“错误关联”举报次数限制"/>
		<div class="g-flex">
			<i-orther-time-item :time="timeCall" api="_CONTENT_SYSTEM_SALE_CONFIG_TIME_CALL_POST" type="timeCall" title="通话有效时长配置">
				<span slot-scope="{time}">接通时长≥：{{ time }} 秒</span>
			</i-orther-time-item>
			<i-orther-time-item :time="timeReport" api="_CONTENT_SYSTEM_SALE_CONFIG_TIME_REPORT_POST" type="timeReport" title="举报内容的辩护期设置">
				<span slot-scope="{time}">辩护期时长：{{ time }} h</span>
			</i-orther-time-item>
		</div>
		<i-orther-item
			:select-list="protectList"
			api="_CONTENT_SYSTEM_SALE_CONFIG_PROTECT_POST"
			type="protect"
			selected
			title="申请延长保护期原因管理"/>
		<i-orther-item
			:select-list="signList"
			api="_CONTENT_SYSTEM_SALE_CONFIG_SIGN_POST"
			type="sign"
			selected
			title="标记原因设置"/>
		<i-orther-item
			:select-list="auditList"
			api="_CONTENT_SYSTEM_SALE_CONFIG_AUDIT_POST"
			type="audit"
			selected
			title="跟进记录审核人配置"/>
	</div>
</template>

<script>
import OrtherItem from './_common/orther-item';
import OrtherTimeItem from './_common/orther-time-item';

export default {
	components: {
		'i-orther-item': OrtherItem,
		'i-orther-time-item': OrtherTimeItem
	},
	data() {
		return {
			recordList: [], // 跟进记录
			relationList: [], // 关联
			protectList: [], // 延长原因
			signList: [], // 标记原因
			auditList: [], // 审核人配置
			timeCall: null, // 通话有效时长配置
			timeReport: null, // 举报内容的辩护期设置
		};
	},
	created() {
		this.loadConfig();
	},
	methods: {
		loadConfig() {
			return this.$request({
				url: "_CONTENT_SYSTEM_SALE_GET_OTHER_CONFIG_GET",
				type: 'GET',
			}).then((res) => {
				this.recordList	= res.data.record;
				this.protectList	= res.data.protect;
				this.relationList	= res.data.relation;
				this.signList	= res.data.sign;
				this.auditList	= res.data.audit;
				this.timeCall = res.data.call_time;
				this.timeReport = res.data.report_time;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
	}
};
</script>

<style scoped lang="">
</style>
