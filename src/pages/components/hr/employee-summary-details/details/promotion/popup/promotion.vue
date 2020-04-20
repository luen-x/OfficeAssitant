<template>
	<div>
		<i-modal
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="680px"
			footer-hide
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<div class=" hr-employee-details-contract-rank">
				<div v-if="formValidate.length" class="g-flex g-fw-w  g-m-t-20  g-flex-cc ">
					<div v-for="(item, index) in formValidate" :key="index" class="g-flex g-fd-c g-flex-cc ">
						<div :style="{width:'430px'}">
							<i-card :class="formValidate.length-1==index?'_bg-blue':''" >
								<p slot="title">
									{{ item.rank_name }}
								</p>
								<i-tooltip slot="extra" max-width="230" transfer>
									<div class="g-operation">晋级要求</div>
									<div slot="content">
										<p
											v-for="(item,index) in item.rule"
											:key="index"
											style="whiteSpace: normal"
											class="g-m-b-10">
											{{ item.title }}
										</p>
									</div>
								</i-tooltip>
								<div>
									<div>
										<span>额外底薪：</span><span>{{ item.regular_subsidy }}</span>
									</div>
									<div>
										<span>额外提成：</span><span>{{ item.commission_rate }}</span>
									</div>
								</div>
							</i-card>
						</div>
						<div v-show="index !== formValidate.length-1" class="icon">
							<i
								class="iconfont icon-xiangxiajiantou g-fs-26 g-m-b-30" />
						</div>
					</div>
				</div>
				<div v-else class="g-flex g-flex-cc g-flex-ac g-fd-c">
					<img :src="OSS_EMPTY1" alt="" style="width:200px">
					<div class="g-m-t-10">暂无数据</div>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Select, Option, Button, Icon, Card, Tooltip } from "iview";
import { CreatePortal } from "wya-vc";
import Steps from "@components/_common/steps/steps";
import API from "@stores/apis/root";
import { OSS_EMPTY1 } from '@constants/constants';

export default {
	name: "hr-employee-details-contract-rank",
	components: {
		"i-modal": Modal,
		"i-select": Select,
		"i-option": Option,
		"i-button": Button,
		"oa-steps": Steps,
		"i-icon": Icon,
		"i-card": Card,
		"i-tooltip": Tooltip
	},
	props: {
		title: String,
		rank_system_id: Number,
		period_id: Number,
	},
	data() {
		return {
			visible: false,
			OSS_EMPTY1,
			formValidate: [],
			ruleValidate: {
				company_name: [
					{ required: true, message: "公司名为必填", trigger: "blur" }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.fetchData();
	},
	methods: {
		handleCancel() {
			this.visible = false;
		},
		fetchData() {
			this.$request({
				url: API._HR_EMPLOYEE_SUMMARY_DETAILS_RANK_SYSTEM_GET,
				type: "GET",
				param: {
					period_id: this.period_id,
					rank_system_id: this.rank_system_id
				},
				loading: false
			}).then(res => {
				this.formValidate = res.data;
			}).catch(err => { this.$Message.error(err.msg); });
		},
	}
};

export const PromotionModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.hr-employee-details-contract-rank {
	// max-height: 500px;
	overflow-y: auto;
	._bg-blue {
		background-color: #e9f5fe;
	}
}
</style>
