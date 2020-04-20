<template>
	<div class="v-employee-summary-recommend">
		<i-form 
			ref="formData" 
			:model="formData"
			:label-width="120"
			class="_form"
		>
			<div class="g-flex g-jc-c g-pd-tb-10 g-m-t-10 _basic-info">
				<div class="g-flex g-ai-c">
					<div style="padding-right: 40px;">
						<span>评价人：</span>
						<span>{{ formData.appraiser_name }}</span>
					</div>
					<div style="padding-right: 40px;">
						<span>部门：</span>
						<span>{{ formData.appraiser_depart_name }}</span>
					</div>
					<div style="padding-right: 40px;">
						<span>级别：</span>
						<span>{{ formData.appraiser_staff_identity }}</span>
					</div>
					<div>
						<span>被评人：</span>
						<span>{{ formData.staff_name }}</span>
					</div>
				</div>
			</div>
			<div class="g-flex g-fd-c g-ai-c">
				<div>
					<div class="g-pd-lr-15 g-m-t-15 g-c-black3 g-fs-16" style="border-left: 2px solid #e84854;">业务</div>
					<div 
						v-for="(item, index) in formData.business" 
						:key="index"
					>
						<div class="g-m-t-20 g-m-l-20 g-m-b-20 g-fs-14 g-c-black3" >{{ item.cate_name }}</div>
						<i-form-item 
							v-for="it in item.question_arr"
							:key="it.question_id"
							:label="it.question_name"
						>
							<i-radio-group v-model="it.value">
								<i-radio :label="1" disabled class="g-pd-l-30">很好</i-radio>
								<i-radio :label="2" disabled class="g-pd-l-30">一般</i-radio>
								<i-radio :label="3" disabled class="g-pd-l-30">很差</i-radio>
								<i-radio :label="4" disabled class="g-pd-l-30">特差</i-radio>
							</i-radio-group>
							<label>描述：</label>
							<span>
								{{ it.description }}
							</span>
						</i-form-item>
					</div>
				</div>
				<div>
					<div class="g-pd-lr-15 g-m-t-15 g-c-black3 g-fs-16" style="border-left: 2px solid #e84854;">心态</div>
					<div v-for="(item, index) in formData.mentality" :key="index">
						<div class="g-m-t-20 g-m-l-20 g-m-b-20 g-fs-14 g-c-black3">{{ item.cate_name }}</div>
						<i-form-item 
							v-for="it in item.question_arr"
							:key="it.question_id"
							:label="it.question_name"
						>
							<i-radio-group v-model="it.value">
								<i-radio :label="1" disabled class="g-pd-l-30">很好</i-radio>
								<i-radio :label="2" disabled class="g-pd-l-30">一般</i-radio>
								<i-radio :label="3" disabled class="g-pd-l-30">很差</i-radio>
								<i-radio :label="4" disabled class="g-pd-l-30">特差</i-radio>
							</i-radio-group>
							<label>描述：</label>
							<span>
								{{ it.description }}
							</span>
						</i-form-item>
					</div>
				</div>
			</div>
		</i-form>
	</div>
</template>

<script>
import { Input, Select, Option, Button, Form, FormItem, RadioGroup, Radio } from 'iview';
import API_ROOT from "@stores/apis/root";

export default {
	name: "c-archives-person-recommend",
	components: {
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
	},
	data() {
		return {
			staff_list: [], // 搜索出来的员工列表
			formData: {}
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载数据
		 */
		async loadData() {
			await this.loadConfig();
			await this.loadStaff();
		},
		/**
		 * 加载配置详情数据
		 */
		loadConfig() {
			this.$request({
				url: API_ROOT._HR_ARCHIVES_PERSON_DETAIL_PERSON_RECOMMEND_CONF_GET,
				type: 'GET',
				loading: false,
				param: {
					recommend_info_id: this.$route.query.recommend_info_id,
				},
			}).then(res => {
				this.formData = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 根据被评人姓名搜索
		 */
		loadStaff() {
			this.$request({
				url: API_ROOT._HR_MUTI_TERM_STAFF_GET,
				type: 'GET',
				loading: false,
				param: {
					search: this.formData.staff_id
				},
				autoTip: false
			}).then(res => {
				this.staff_list = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
	}
};

export const EmployeeSummaryRecommend = module.exports.default;

</script>

<style lang="scss" scoped>
.v-employee-summary-recommend {
	._basic-info {
		background-color: #f6f6f6;
		/deep/ .ivu-form-item {
			margin-bottom: 0!important;
		}
	}
	/deep/ .ivu-input-wrapper, .ivu-select {
		width: 220px;
	}
	/deep/ .ivu-radio-wrapper:first-child {
		margin-right: 0;
	}
	/deep/ .ivu-radio-group {
		vertical-align: top;
		margin-top: -2px;
	}
	._form{
		padding-bottom: 60px;
	}
	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
</style>