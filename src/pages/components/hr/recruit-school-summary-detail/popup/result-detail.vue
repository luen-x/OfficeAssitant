<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="笔试结果"
		class="v-hr-recruit-school-result-detail"
		width="680"
		@on-ok="handleClose"
		@on-cancel="handleClose">
		<div>
			<div 
				style="margin: 0 auto 10px"
				class="g-c-black1 g-fs-16 g-tc">{{ paper_theme || '暂无' }}</div>
		</div>
		<i-row class="g-fs-14">
			<i-col span="3" class="g-c-black4">测试结果</i-col>
			<i-col span="20" class="g-c-black2 g-m-b-15">{{ paper_result.test_result || '--' }}</i-col>

			<i-col span="3" class="g-c-black4">对外解释</i-col>
			<i-col span="20" class="g-c-black2 g-m-b-15">
				{{ paper_result.external_explain || '--' }}
			</i-col>

			<i-col span="3" class="g-c-black4">匹配程度</i-col>
			<i-col span="20" class="g-c-black2 g-m-b-15">
				<i-rate 
					v-model="paper_result.match_progress"
					style="margin-top: -5px" 
					disabled/>
			</i-col>

			<i-col span="3" class="g-c-black4">内部结论</i-col>
			<i-col span="20" class="g-c-black2 g-m-b-15">
				{{ paper_result.inner_conclusion || '--' }}
			</i-col>

			<i-col span="3" class="g-c-black4">得分情况</i-col>
			<i-col span="20" class="g-c-black2 g-m-b-10">
				<div
					v-for="dimension in paper_result.dimensions"
					:key="dimension.record_id">
					<i-col span="24" class="g-m-b-10">{{ dimension.dimension_name || '--' }}：</i-col>
					<div>
						<i-col span="5" class="g-m-b-10">员工得分：{{ dimension.self_score }}</i-col>
						<i-col span="5" class="g-m-b-10">合格分数：{{ dimension.score }}</i-col>
						<i-col span="5" class="g-m-b-10">维度总分：{{ dimension.total_score }}</i-col>
					</div>
				</div>
				<div v-if="!paper_result.dimensions.length">--</div>
				
				
			</i-col>
		</i-row>

		
	</i-modal>
</template>

<script>
import { CreatePortal, Copy } from "wya-vc";
import { Modal, Col, Row, Rate } from "iview";

export default {
	name: "hr-recruit-school-result-detail",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-col": Col,
		"i-row": Row,
		'i-rate': Rate
	},
	props: {
		paper_theme: String,
		paper_id: String | Number
	},
	data() {
		return {
			visible: false,
			paper_result: { dimensions: [] }
		};
	},
	computed: {},
	created() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		handleCancel() {
			this.$emit("close");
		},
		loadData() {
			this.$request({
				url: '_HR_RECRUIT_SCHOOL_ANSWER_RESULT_GET',
				param: { 
					paper_id: this.paper_id,
					answer_id: this.$route.params.id
				},
				type: "GET"
			}).then((res) => {
				this.paper_result = res.data.paper_result;
				this.paper_result.match_progress = this.paper_result.match_progress / 2;
			}).catch(err => this.$Message.error(err.msg));
		},
		handleClose() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close');
		}
	}
};
export const ResultDetailModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
.v-hr-recruit-school-result-detail {
	.ivu-modal-body {
		padding-left: 40px;
		padding-right: 40px
	}
}
</style>
