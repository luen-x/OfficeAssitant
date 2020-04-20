<template>
	<div>
		<i-drawer
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-hr-drawer"
			@on-close="$emit('close')"
		>
			<oa-header
				slot="header"
				:name="name"
				:staff-id="staff_id"
			/>
			<oa-credit-content
				v-if="cate === '2'" 
				:name="name"
				:cate="cate"
				:staff-id="staff_id"
			/>
			<oa-integration-content
				v-else
				:name="name"
				:cate="cate"
				:staff-id="staff_id"
			/>
		</i-drawer>
	</div>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

import Header from './drawer-head';
import CreditContent from './credit/credit-content';
import IntegrationContent from './integration/integration-content';

export default {
	name: 'finance-detail-drawer',
	components: {
		'i-drawer': Drawer,
		'i-button': Button,
		'oa-header': Header,
		'oa-credit-content': CreditContent,
		'oa-integration-content': IntegrationContent
	},
	props: {
		name: String,
		cate: String,
		staff_id: Number
	},
	data() {
		return {
			closable: false,
			data: {},
		};
	},
	mounted() {
		this.closable = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const HrDrawer = CreatePortal({ alive: true }, module.exports.default);
</script>

<style lang="scss">
.v-hr-drawer {
	.ivu-drawer-content {
		display: flex;
		flex-direction: column;
	}
	.ivu-drawer-header {
		display: flex;
	}
	.ivu-drawer-body {
		display: flex;
		flex: 1;
		padding: 0px;
		position: relative;

		.ivu-tabs {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.ivu-tabs-bar {
			margin-bottom: 0;
		}
		.ivu-tabs-content {
			flex: 1;
			display: flex;
			height: 0;
		}
		.ivu-tabs-tabpane {
			overflow-y: auto;
			overflow-x: hidden;
			max-height: 100%;
		}
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
		// .ivu-tabs-ink-bar {
		// 	width: 58px !important;
		// 	left: 15px !important;
		// }
		.ivu-tabs-tabpane {
			overflow: auto;
		}
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
}
</style>