<template>
	<div>
		<i-drawer
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-hr-detail-quality-drawer"
			@on-close="handleCancel"
		>
			<div slot="header">
				<div class="_wrapper">
					<!-- <div v-if="spin"> -->
					<div class="__header-wrapper">
						<span class="__header">{{ customer_info.company_name }}</span>
					</div>
					<div class="__item">
						<span class="__label">负责人：</span>
						<span v-if="customer_info.service_man" class="__content">{{ customer_info.service_man }}</span>
						<span v-else class="__content">--</span>
					</div>
					<div class="__item">
						<span class="__label">负责人手机号：</span>
						<span v-if="customer_info.service_number" class="__content">{{ customer_info.service_number }}</span>
						<span v-else class="__content">--</span>
					</div>
					<div class="__item">
						<span class="__label">部门：</span>
						<span v-if="customer_info.service_depart_name" class="__content">{{ customer_info.service_depart_name }}</span>
						<span v-else class="__content">--</span>
					</div>
				</div>
			</div>

			<oa-detail-content 
				v-if="detailShow" 
				:name="name" 
				:type="type" 
				:contract_company_id="contract_company_id" 
				:label="label" 
			/>
			<!-- <div class="_fixed-height"/> -->
		</i-drawer>
	</div>
</template>

<script>
import { Drawer, Row, Col, Button, Icon, Spin } from 'iview';
import { CreatePortal } from 'wya-vc';
import { Title, DetailItem } from "@components/hr/points";
import API_ROOT from '@stores/apis/root';
import DetailContent from './detail-content/detail.vue';

export default {
	name: 'sc-customer-detail-drawer',
	components: {
		'i-drawer': Drawer,
		'oa-title': Title,
		'i-button': Button,
		'i-icon': Icon,
		'i-spin': Spin,
		'oa-service-detail-item': DetailItem,
		'oa-detail-content': DetailContent
	},
	props: {
		type: String,
		name: String,
		contract_company_id: String,
		label: {
			type: String,
			default: "1"
		}
	},
	data() {
		return {
			basic_info: {},
			customer_info: {},
			closable: false,
			markCompany: false,
			markButton: false,
			spin: false,
			detailShow: true,
			firstIn: 0
		};
	},
	computed: {
	},
	mounted() {
		this.closable = true;
		this.loadData();
	},
	updated() {
		setTimeout(() => {
			try {
				let height = document.querySelector('.ivu-drawer-header').offsetHeight;
				height = height + 95 + 40;
				height = window.innerHeight - height;
				const dom = document.querySelectorAll('.v-hr-detail-quality-drawer .ivu-tabs-tabpane');
				dom.forEach(item => {
					item.style.height = height + 'px';
				});
			} catch (err) {
				console.error(err);
			}
		}, 0);
	},
	methods: {
		loadData() {
			this.firstIn += 1;
			if (this.firstIn > 1) {
				this.detailShow = false;
				this.$nextTick(() => {
					this.detailShow = true;
				});
			}
			// this.spin = false;
			this.$request({
				url: API_ROOT['_HR_POINT_CUSTOMER_INFO_GET'], // eslint-disable-line
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then((res) => {
				this.basic_info = res.data.basic_info;
				this.customer_info = res.data.customer_info;
				this.spin = true;
			}).catch((error) => {
				Message.error(error.msg);
				this.spin = true;
			});
		},
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
	}
};
export const DetailDrawer = CreatePortal({
	alive: true,
}, module.exports.default);
</script>

<style lang="scss">
.v-hr-detail-quality-drawer {
	._wrapper {
		.__item {
			display: inline-block;
			width: 240px;
			padding-bottom: 20px;
			margin-right: 50px;
			.__label {
				display: inline-block;
				color: #818794;
			}
			.__content {
				display: inline-block;
				color: #333;
			}
		}
		.__header-wrapper {
			padding: 15px 0 20px 0;
			.__header {
				color: #000;
				font-size: 16px;
			}
		}
	}
	._footer {
		width: 940px;
		position: fixed;
		bottom: 0;
		right: 0;
		border-top: 1px solid #e8e8e8;
		padding: 10px 16px;
		text-align: left;
		background: #fff;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
	}
	._fixed-height {
		height: 51px;
	}

	.ivu-drawer-body {
		padding: 0px;
		.ivu-tabs-bar {
			margin-bottom: 30px;
		}
		.ivu-tabs-nav .ivu-tabs-tab-active {
			color: #e74854;
		}
		.ivu-tabs-tab:hover {
			color: #e74854;
		}
		.ivu-tabs-ink-bar {
			background: #e74854;
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
	}
}
</style>


