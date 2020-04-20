<template>
	<div v-show="show" class="v-finance-tab">
		<div v-if="spin && (data.contract_image && data.contract_image.length !== 0)" class="g-m-b-30">
			<vc-imgs-preview :data-source="data.contract_image || []"/>
		</div>
		<oa-title v-if="spin && data.audit_info">
			<template slot="title">
				<span class="g-fs-14">审核信息</span>
			</template>
			<div slot="content" class="g-fw-w g-pd-t-25">
				<oa-detail-item :content="data.audit_info.status_name" label="审核状态">{{ data.audit_info.status_name }}</oa-detail-item>
				<oa-detail-item :content="data.audit_info.audit_staff_name" label="审核人">{{ data.audit_info.audit_staff_name }}</oa-detail-item>
				<oa-detail-item :content="data.audit_info.audit_time" class="g-m-t-15" label="审核时间">{{ data.audit_info.audit_time }}</oa-detail-item>
				<oa-detail-item 
					v-if="data.audit_info.status !== 1"
					:content="data.audit_info.audit_remark"
					:label="data.audit_info.status === 2 ? '通过说明' : '驳回原因'" 
					class="g-m-t-15">{{ data.audit_info.audit_remark }}</oa-detail-item>
			</div>
		</oa-title>
		<oa-loading v-if="!spin" fix />
		<div v-show="!data.audit_info" class="g-flex-cc" style="height: 300px">
			暂无数据
		</div>
	</div>
</template>

<script>
import { Spin } from 'iview';
import Loading from '@components/_common/loading/loading';
import { ImgsPreview } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import DetailItem from '../../detail-item';
import Title from '../../title';

export default {
	name: 'finance-detail-tabs-elec',
	components: {
		'oa-detail-item': DetailItem,
		'vc-imgs-preview': ImgsPreview,
		'oa-title': Title,
		'oa-loading': Loading
	},
	props: {
		contractId: Number,
		electronicId: Number,
		show: Boolean,
		type: String,
	},
	data() {
		return {
			data: {
				contract_image: [],
				audit_info: {

				}
			},
			spin: true,
			isfetching: 0
		};
	},
	watch: {
		show(val, old) {
			val && this.isfetching === 0 && this.loadData();
		},
		contractId() {
			this.loadData();
		}
	},
	created() {
		this.show && this.loadData();
	},
	methods: {
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_ELECTRONIC_GET,
				type: 'GET',
				param: {
					contract_id: this.contractId,
					electronic_id: this.electronicId
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				this.spin = true;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.spin = true;
			});
		}
	}
};
</script>

<style lang="scss">

</style>


