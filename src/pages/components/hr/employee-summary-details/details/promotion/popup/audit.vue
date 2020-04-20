<template>
	<div>
		<i-modal
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="400"
			footer-hide
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<div class="hr-employee-details-promotion-audit">
				<div class="g-flex g-flex-cc">
					<div>
						<div class="g-flex">
							<div style="marginTop:6px;width:60px">级称选择:</div>
							<i-select 
								v-model="department"
								clearable 
								style="width:220px;marginBottom:20px" 
								placeholder="请选择级称"
							>
								<i-option 
									v-for="item in rankArr" 
									:value="item.rank_id" 
									:key="item.rank_id"
								>
									{{ item.rank_name }}
								</i-option>
							</i-select>
						</div>
						<oa-steps
							v-if="formValidate.length"
							:data-source="formValidate"
							:type="1"
							:render-title="renderTitle"
							:render-content="renderContent"
						/>
					
						<div v-else class="g-flex g-flex-cc g-flex-ac g-fd-c">
							<img :src="OSS_EMPTY1" alt="" style="width:200px">
							<div class="g-m-t-10">暂无数据</div>
						</div>
					</div>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Select, Option, Button } from "iview";
import { CreatePortal } from "wya-vc";
import Steps from "@components/_common/steps/steps";
import API_ROOT from "@stores/apis/root";
import { OSS_EMPTY1 } from '@constants/constants';

export default {
	name: "hr-employee-details-contract-company",
	components: {
		"i-modal": Modal,
		"i-select": Select,
		"i-option": Option,
		"i-button": Button,
		"oa-steps": Steps
	},
	props: {
		title: String,
		rank_system_id: Number,
		period_id: Number,
		staff_id: String,
	},
	data() {
		return {
			visible: false,
			rankArr: [],
			OSS_EMPTY1,
			department: "",
			formValidate: [],
			ruleValidate: {
				company_name: [
					{ required: true, message: "公司名为必填", trigger: "blur" }
				]
			}
		};
	},
	computed: {},
	watch: {
		department(curVal, oldVal) {
			if (curVal != oldVal) {
				this.fetchTitleRecord(this.department);
			}
		}
	},
	created() {
		this.fetchData();
		this.fetchTitleRecord();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		fetchData() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_RANK_SELECT_GET,
				type: "GET",
				param: {
					period_id: this.period_id,
					rank_system_id: this.rank_system_id
				},
				loading: false
			}).then(res => {
				this.rankArr = res.data;
			}).catch(err => { this.$Message.error(err.msg); });
		},
		fetchTitleRecord(id) {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_TITLE_RECORD_GET,
				type: "GET",
				param: {
					staff_id: this.staff_id,
					rank_system_id: this.rank_system_id,
					rank_id: id
				},
				loading: false
			}).then(res => {
				this.formValidate = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		renderTitle(h, params) {
			const { create_time } = params.rows;
			return (
				<div style="margin:0 0 0 10px;">
					<span>{create_time}</span>
				</div>
			);
		},
		renderContent(h, params) {
			const { content, rank_name } = params.rows;
			return <div style="margin:0 10px 20px 10px;color:#000">
				<div>{rank_name}</div>
				<div>{content}</div>
			</div>;
		}
	}
};

export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
.hr-employee-details-promotion-audit {
	max-height: 500px;
	overflow-y: auto;
}
</style>