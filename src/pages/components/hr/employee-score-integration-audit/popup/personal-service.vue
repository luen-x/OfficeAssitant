<template>
	<div>
		<i-drawer
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-hr-employee-score-integration-personal-service-drawer"
			@on-close="$emit('close')"
		>
			<oa-header
				slot="header"
				:info="info"
				:staff-id="staff_id"
			/>
			<template v-if="customer_list.length">
				<oa-expand-panel v-for="(item) in customer_list" :key="item.contract_company_id" :border="false" style="width:100%">
					<div slot="header" class="g-flex g-jc-sb" style="width:800px">
						<span class="g-c-black2 ">
							<oa-auto-tooltip
								:content="item.contract_company_name"
								style="width:200px"
								placement="bottom"
								theme="dark"
								label-class="g-c-000"
							/>
							<!-- ( <span class="g-c-red-mid">{{ item.wait_done||'0条' }}</span>待处理 ) -->
						</span>
						<span>
							服务期限：{{ item.service_start_time }}至{{ item.service_end_time }}
						</span>
						<span>
							服务积分：{{ item.service_total_point }}
						</span>
					</div>
					<div class="g-pd-20">
						<div class="g-flex g-jc-sb">
							<span>基础服务</span>
							<span>{{ item.base_service.pass }}项已通过 / {{ item.base_service.submit }}项已提交 / {{ item.base_service.total }}项服务</span>
							<span>获得积分:{{ item.base_service.staff_point }}</span>
						</div>
						<div class="g-flex g-jc-sb g-m-t-20">
							<span>咨询服务</span>
							<span>{{ item.consult_service.pass }}项已通过 /
								{{ item.consult_service.submit }}项已提交 / {{ item.consult_service.total }}项服务</span>
							<span>获得积分:{{ item.consult_service.staff_point }}</span>
						</div>
						<div class="g-flex g-jc-sb g-m-t-20">
							<span>客户回款</span>
							<span>回款：{{ item.return_service.return_amount }} | 代理：{{ item.return_service.agent_num }}人</span>
							<span>获得积分:{{ item.return_service.staff_point }}</span>
						</div>
						<div class="g-flex g-jc-sb g-m-t-20">
							<span>客户满意度</span>
							<span>{{ item.satisfied_service.pass }}项已通过 / {{ item.satisfied_service.submit }}项已提交
							/ {{ item.satisfied_service.total }}项服务</span>
							<span>获得积分:{{ item.satisfied_service.staff_point }}</span>
						</div>
					</div>
				</oa-expand-panel>
			</template>
			<div v-else class="g-flex-cc g-fd-c" style="height:400px">
				<img :src="OSS_EMPTY" alt="">
				<div class="g-m-t-20">暂无服务客户</div>
			</div>
		</i-drawer>
	</div>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane } from 'iview';
import { CreatePortal } from 'wya-vc';
import { OSS_EMPTY } from '@constants/constants';
import API_ROOT from '@stores/apis/root';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

import expandPanel from '@components/_common/expand-panel/expand-panel';
// eslint-disable-next-line import/extensions
import Header from './header.js';

export default {
	name: 'finance-detail-drawer',
	components: {
		'i-drawer': Drawer,
		'i-button': Button,
		'oa-header': Header,
		'oa-auto-tooltip': AutoToolTip,
		'oa-expand-panel': expandPanel,
	},
	props: {
		name: String,
		cate: String,
		staff_id: Number
	},
	data() {
		return {
			closable: false,
			OSS_EMPTY,
			info: {},
			data: {},
			customer_list: [],
		};
	},
	mounted() {
		this.closable = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: 'HR_EMPLOYEE_DATA_STAFF_SERVICE_GET',
				type: 'get',
				param: {
					staff_id: this.staff_id
				},
				loading: false
			}).then(res => {
				this.info = res.data.info;
				this.customer_list = res.data.customer_list;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const PersonalService = CreatePortal({ alive: true }, module.exports.default);
</script>

<style lang="scss">

.v-hr-employee-score-integration-personal-service-drawer {
	.ivu-drawer-content {
		display: flex;
		flex-direction: column;
	}
	.ivu-drawer-header {
		display: flex;
	}
	.ivu-drawer-body {
		flex: 1;
		padding: 0px;
		position: relative;
	}

	._detail-header {
		color: #000;
		font-size: 16px;
		height: 31px;
		line-height: 31px;
	}
	.vc-imgs-preview img {
		height: 72px;
		width: 72px;
		border: 1px solid #e5e6e7;
	}
	.v-hr-employee-score-integration-audit-header{
		width:100%;
		._item {
			width: 33.3%;
			margin-bottom: 20px;
		}
	}
}
</style>