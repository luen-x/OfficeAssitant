<template>
	<div>
		<i-modal 
			v-model="visible" 
			:loading="true" 
			:mask-closable="false" 
			footer-hide 
			width="400px">
			<div slot="header" class="g-tc">{{ title }}</div>
			<div class="hr-employee-details-contract-rank">
				<div v-if="formData.length" class="g-flex g-fw-w g-flex-cc">
					<div class="g-flex g-fw-w g-fd-c _scroll g-m-b-10">
						<div
							v-for="(item, index) in formData"
							:key="index"
							class="g-flex g-fd-c g-flex-cc"
						>
							<div v-show="index !== formData.length&&index !== 0" class="icon g-flex g-flex-ac g-flex-cc g-m-t-15">
								<div>
									<div class="_dashed g-m-l-5"/>
									<i class="iconfont icon-shixiangxiajiantou- g-fs-14 _icon"/>
								</div>
								<div class="g-operation _name">{{ item.status_name }}</div>
							</div>
							<div :style="{width:'300px'}">
								<div
									class="g-flex-cc g-fd-c g-pd-tb-20 g-pd-lr-30 g-br-sem _bg-blue"
								>
									<i-poptip
										v-if="item.remarks"
										:content="item.remarks"
										class="__content"
										placement="top-start"
										word-wrap
										trigger="hover"
									>
										<i class="iconfont icon-attention"/>
									</i-poptip>
									<div>{{ item.position_name }}</div>
									<div>{{ item.office_time }}</div>
								</div>
							</div>
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
import {
	Modal,
	Select,
	Option,
	Button,
	Icon,
	Card,
	Tooltip,
	Poptip
} from "iview";
import { CreatePortal } from "wya-vc";
import Steps from "@components/_common/steps/steps";
import API_ROOT from "@stores/apis/root";
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
		"i-poptip": Poptip,
		"i-tooltip": Tooltip
	},
	props: {
		title: String,
		position_id: Number,
		staff_id: String
	},
	data() {
		return {
			visible: false,
			OSS_EMPTY1,
			formData: []
		};
	},
	computed: {},
	created() {},
	mounted() {
		this.visible = true;
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_PRO_INFO_PRO_RESUME_GET,
				type: "GET",
				param: {
					staff_id: this.staff_id,
					position_id: this.position_id || 1
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

export const RankModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.hr-employee-details-contract-rank {
    max-height: 500px;
    overflow-y: auto;
	._dashed {
		border-left:2px dashed #EBEEF1;
		height:31px;
		width:1px

	}
	._icon{
		display: inline-block;
		margin-top: -5px;
		margin-left: -1px;
	}
	._name{
		margin-top:-20px;
	}
    ._bg-blue {
        background-color: #e9f5fe;
        position: relative;
        .__content {
            width: 200px;
            position: absolute;
            top: 10px;
            left: 10px;
            color: #fa8c04;
        }
    }
}
</style>