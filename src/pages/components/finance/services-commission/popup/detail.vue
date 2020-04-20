<template>
	<i-drawer
		ref="modal"
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-finance-services-commission-detail"
		@on-close="$emit('close')"
	>
		<div class="g-pd-lr-20">
			<i-row>
				<i-col class="g-fs-16 g-lh-36 g-m-tb-15 g-c-black1">{{ info.staff_name }}</i-col>
			</i-row>
			<i-row class="g-fs-12 g-c-black4 g-lh-12 g-m-b-30">
				<i-col span="6">部门：<span class="g-c-black2">{{ headData.depart_name || '--' }}</span></i-col>
				<i-col span="6">职位：<span class="g-c-black2">{{ headData.position_name || '--' }}</span></i-col>
				<i-col span="6">部门经理：<span class="g-c-black2">{{ headData.depart_manage_names || '--' }}</span></i-col>
				<i-col span="6">总服务提成：<span class="g-c-black2">{{ headData.need_service_amount || '--' }}</span></i-col>
			</i-row>
		</div>
		<div v-if="spin">
			<div>
				<i-tab
					:value="type"
					@onClick="handleTabChange">
					<i-tab-pane name="1" label="服务提成">
						<oa-services-commission
							:info="info"
						/>
					</i-tab-pane>
					<i-tab-pane name="2" label="回访记录">
						<oa-visit-record :info="info" :list="visitList" />
					</i-tab-pane>
					<i-tab-pane name="3" label="服务情况">
						<oa-services-situation :info="info"/>
					</i-tab-pane>
					<i-tab-pane name="4" label="回款信息">
						<oa-payback-info :info="info" />
					</i-tab-pane>
					<i-tab-pane name="5" label="投诉记录">
						<oa-complaint-record :info="info" />
					</i-tab-pane>
				</i-tab>
			</div>
		</div>
		<oa-loading v-else style="margin-top: -100px"/>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Form, Input, DatePicker, Tabs, TabPane } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import orderModal from '@extends/mixins/orderModal';
import servicesCommission from '../common/services-commission';
import visitRecord from '../common/visit-record';
import servicesSituation from '../common/services-situation';
import paybackInfo from '../common/payback-info';
import complaintRecord from '../common/complaint-record';

export default {
	name: 'administration-matter-sea-detail-drawer',
	components: {
		'i-drawer': Drawer,
		'i-button': Button,
		'i-row': Row,
		'i-col': Col,
		'i-tab': Tabs,
		'i-tab-pane': TabPane,
		'oa-services-commission': servicesCommission,
		'oa-visit-record': visitRecord,
		'oa-services-situation': servicesSituation,
		'oa-payback-info': paybackInfo,
		'oa-complaint-record': complaintRecord
	},
	mixins: [orderModal],
	props: {
		info: Object,
	},
	data() {
		return {
			closable: false,
			spin: false,
			type: '1',
			headData: {},
			visitList: [
				{
					name: '666人才有限公司',
					list: [
						{ name: 'xxx', num: 666 },
						{ name: 'yyy', num: 333 },
						{ name: 'zzz', num: 999 }
					]
				},
				{
					name: '666才华有限公司',
					list: [
						// { name: 'xxx', num: 666 },
						// { name: 'yyy', num: 333 },
						// { name: 'zzz', num: 999 }
					]
				}
			]
		};
	},
	mounted() {
		this.loadData();
		this.closable = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
		handleTabChange(type) {
			this.type = type;
		},
		loadData() {
			this.spin = false;
			this.$request({
				url: API_ROOT._FINANCE_SERVICE_DETAIL_STAFF_INFO_GET,
				type: 'GET',
				param: { staff_id: this.info.staff_id },
				loading: false
			}).then(({ data }) => {
				this.headData = data;
				this.spin = true;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const DetailDrawer = CreatePortal({ store: app.$store, alive: true }, module.exports.default);
</script>

<style lang="scss">
.v-finance-services-commission-detail {
    .ivu-tabs{
			height: calc(100vh - 190px);
			
			.ivu-tabs-tabpane{
				overflow-x: hidden;
				overflow-y: auto;
				height: calc(100vh - 225px);
				padding: 20px;
			}

			.ivu-tabs-content{
				height: calc(100vh);
			}
		}

    .ivu-drawer-body {
		padding: 0px;
		overflow-y: hidden;

		.ivu-tabs-nav .ivu-tabs-tab-active {
			color: #e84854;
		}
		.ivu-tabs-tab:hover {
			color: #e84854;
		}
		.ivu-tabs-ink-bar {
			background: #e84854;
			bottom: 0;
		}
		.ivu-tabs-nav-scroll {
			background: #f5f5f6;
			border-bottom: 2px solid #d4d7db;
		}
		.ivu-tabs-ink-bar {
			width: 58px !important;
			left: 15px !important;
		}
		.ivu-tabs-bar{
			margin-bottom: 0px;
		}
	}
}
</style>

