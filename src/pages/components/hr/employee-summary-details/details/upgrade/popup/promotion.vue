<template>
	<div>
		<i-modal 
			v-model="visible" 
			:loading="true" 
			:mask-closable="false" 
			width="400px" 
			footer-hide>
			<div slot="header" class="g-tc">{{ title }}</div>
			<div class="g-flex g-fd-c">
				<div
					v-if="formData.length"
					class="g-m-t-20 hr-employee-details-contract-rank"
				>
					<div class="g-flex g-flex-cc _title">
						<div class="__name">原职位</div>
						<div class="__name">晋升职位</div>
					</div>
					<div v-for="(item, index) in formData" :key="index" class="_row">
						<div class="g-flex _content">
							<div class="__name">
								<div v-if="item.relate.length">
									<div
										v-for="(i,index) in item.relate"
										:key="index"
										class="g-m-tb-5"
									>{{ i.before_position_name }}</div>
								</div>
							</div>
							<div class="__name">{{ item.promotion_position_name }}</div>
						</div>
					</div>
				</div>
				<div v-else class="g-flex g-flex-cc g-flex-ac g-fd-c">
					<img :src="OSS_EMPTY1" alt style="width:200px">
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
import { OSS_EMPTY1 } from "@constants/constants";

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
		staff_id: String
	},
	data() {
		return {
			visible: false,
			OSS_EMPTY1,
			formData: [],
			ruleValidate: {
				company_name: [
					{ required: true, message: "公司名为必填", trigger: "blur" }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		handleCancel() {
			this.visible = false;
		},
		loadData() {
			this.$request({
				url: API._HR_EMPLOYEE_PRO_INFO_PRO_SYSTEM_GET,
				type: "GET",
				param: {
					staff_id: this.staff_id
				},
				loading: false
			}).then(res => {
				this.formData = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};

export const PromotionModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.hr-employee-details-contract-rank {
    max-height: 400px;
    overflow-y: auto;
    flex-direction: column;
	margin-bottom: 20px;
    ._title {
		background-color: #f0f4fc;
		height: 30px;
        width: 350px;
		line-height: 30px;
        .__name {
            text-align: left;
            width: 50%;
			padding-left:20px;
            height: 40px;
            line-height: 40px;
        }
    }
    ._content {
        // border-bottom: 1px solid #e8eaec;
        width: 350px;
		margin-top: -1px;
        .__name {
            text-align: left;
            width: 50%;
			padding-left:20px;
			min-height: 40px;
			display: flex;
			// align-items: center;
			justify-content: center;
			flex-direction: column;
        }
    }
	._row:nth-of-type(odd) {
		background-color: #FAFAFA;
	}
}
</style>
