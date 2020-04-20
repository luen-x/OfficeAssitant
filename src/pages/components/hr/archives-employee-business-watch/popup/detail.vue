<template>
	<div>
		<i-drawer
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-archives-employee-customer-detail"
			@on-close="$emit('close')"
		>
			<div v-if="spin" slot="header" class="_detail-header">
				<div class="_header">
					约见详情
				</div>
				<i-row class="_desc">
					<i-col span="6">邀约人：{{ customerData.staff_name }}</i-col>
					<i-col span="6">部门：{{ customerData.depart_name }}</i-col>
					<i-col span="12">谈判时间：{{ customerData.current_date }}</i-col>
				</i-row>
			</div>
			<div v-if="spin" style="padding: 0 14px 60px">
				<div
					class="g-flex g-fw-w g-jc-sb _detail-info">
					<oa-form-item :value="customerData.company_name" label="公司名称"/>
					<oa-form-item :value="customerData.customer_name" label="客户名称"/>
					<oa-form-item :value="customerData.customer_tel" label="联系方式"/>
					<oa-form-item :value="customerData.position" label="客户职务"/>
					<oa-form-item :value="customerData.legal_person_ratio" label="法人占比"/>
					<oa-form-item :value="customerData.establishment_time" label="成立时间"/>
					<oa-form-item :value="customerData.capital" label="注册资金"/>
					<oa-form-item :value="customerData.visit_time" label="跟进时间"/>
					<oa-form-item :value="customerData.product" label="产品"/>
					<oa-form-item :value="customerData.industry" label="所属行业"/>
					<oa-form-item :value="customerData.distribution_channel" label="目前销售渠道"/>
					<oa-form-item :value="customerData.is_website === 1 ? '有' : '无'" label="是否有官网"/>
					<oa-form-item :value="customerData.is_deal === 1 ? '是' : '否'" label="是否签单"/>
					<oa-form-item :value="customerData.payment" label="签单金额"/>
					<oa-form-item :value="customerData.cooperation_project" label="合作项目"/>
					<oa-form-item :value="customerData.is_commerce === 1 ? '是' : '否'" label="是否做过电商/微商"/>
					<oa-form-item :value="customerData.is_water === 1 ? '是' : '否'" label="是否倒水"/>
					<oa-form-item :value="customerData.is_meal === 1 ? '是' : '否'" label="是否点餐"/>
					<oa-form-item :value="customerData.is_photo === 1 ? '是' : '否'" label="是否拍照"/>
					<oa-form-item :value="customerData.is_video === 1 ? '是' : '否'" label="是否拍小视频"/>
					<oa-form-item :value="customerData.is_sound_record === 1 ? '是' : '否'" label="是否录音"/>
					<!-- <oa-form-item label="是否续费" :value="customerData.is_video === 1 ? '是' : '否'"/> -->
				</div>
				<div class="g-flex g-fw-w g-jc-sb">
					<oa-form-item :value="customerData.communicate" label="谈判前沟通内容" />
					<oa-form-item :value="customerData.explain" label="讲解文化走廊客户态度" />
					<oa-form-item :value="customerData.diagnosis" label="谈判后客户诊断"/>
					<oa-form-item :value="customerData.negotiation" label="谈判内容"/>
				</div>
			</div>
			<oa-loading v-else />
		</i-drawer>
	</div>
</template>

<script>
import { Drawer, Row, Col, Button, Form, Input, DatePicker, Rate } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import formItem from '../_common/form-item';

export default {
	name: 'archives-employee-customer-detail',
	components: {
		'i-drawer': Drawer,
		'i-button': Button,
		'i-row': Row,
		'i-col': Col,
		'i-rate': Rate,
		'oa-form-item': formItem
	},
	props: {
		info: Object,
		staff_id: String | Number
	},
	data() {
		return {
			closable: false,
			spin: true,
			customerData: {},
			editing: false
		};
	},
	mounted() {
		this.closable = true;
		(this.type === 'basic' || this.type == 1) ? this.editing = true : this.editing = false;
		this.loadData();
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
		loadData() {
			// _HR_ARCHIVES_EMPLOYEE_DATA_DETAIL_GET
			this.$request({
				url: '_HR_ARCHIVES_EMPLOYEE_DATA_DETAIL_GET',
				type: 'GET',
				param: {
					staff_id: this.staff_id,
					data_id: this.info.data_id,
					type: 4
				},
			}).then((res) => {
				this.customerData = res.data;
			}).catch((error) => {
			});
		}
	}
};
export const DetailDrawer = CreatePortal({ store: app.$store, alive: true }, module.exports.default);
</script>

<style lang="scss">
.v-archives-employee-customer-detail {
	._detail-header {
		._header {
			color: #000;
			font-size: 16px;
			height: 31px;
			line-height: 31px;
		}
		._desc {
			margin-top: 15px;
			margin-bottom: 10px;
			font-size: 14px;
		}
	}
}
</style>
