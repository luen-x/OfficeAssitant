<template>
	<div v-show="showItem" class="g-fw-w v-hr-points">
		<div>
			<oa-title title="基本信息" class="g-m-l-15"/>
			<div v-if="spin" class="_info-wrapper">
				<oa-detail-item :content="customer_info.customer_name" label="客户姓名" />
				<!-- <oa-detail-item :content="customer_info.customer_phone" label="客户电话" /> -->
				<div v-for="(item, index) in customer_info.take_man_info" :key="index" style="display: inline-block;">
					<oa-detail-item :content="item.take_man" label="对接人" />
					<!-- <oa-detail-item :content="item.take_man_phone" label="对接电话" /> -->
				</div>
				<oa-detail-item :content="basic_info.area" label="地区" />
				<oa-detail-item :content="basic_info.company_money + '万元'" label="注册资金" />
				<oa-detail-item :content="basic_info.company_amount" label="公司规模" />
			</div>
			<oa-loading v-else />
		</div>
	</div>
</template>

<script>
import { Title, DetailItem } from '@components/hr/points';
import { Input, Message, Spin } from 'iview';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'sc-detail-tabs-customer',
	components: {
		'oa-title': Title,
		'oa-detail-item': DetailItem,
		'i-spin': Spin,
		'i-input': Input
	},
	props: {
		showItem: Boolean,
		type: String,
		contract_company_id: String
	},
	data() {
		return {
			basic_info: {},
			customer_info: {},
			isfetching: 0,
			spin: true,
		};
	},
	watch: {
		showItem(val, old) {
			val && this.isfetching === 0 && this.getInfoData();
		}
	},
	created() {
		this.showItem && this.getInfoData();
	},
	methods: {
		getInfoData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT['_HR_POINT_CUSTOMER_INFO_GET'], // eslint-disable-line
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then((res) => {
				this.contractList = res.data.contract_info;
				this.basic_info = res.data.basic_info;
				this.customer_info = res.data.customer_info;
				this.spin = true;
			}).catch((error) => {
				Message.error(error.msg);
				this.spin = true;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-points {
	position: relative;
	min-height: 300px;
	max-height: 100%;
	overflow-y: auto;
	._info-wrapper {
		padding: 0 20px 0 35px;
		margin: 20px 0 20px 0;
        .__item {
            display: inline-block;
            border-bottom: 1px solid #e7e7e7;
            width: 350px;
            padding-bottom: 5px;
            margin-right: 50px;
            margin-bottom: 20px;
            .__label {
                display: inline-block;
                color: #818794;
                width: 100px;
            }
            .__content {
                display: inline-block;
                color: #333;
            }
        }
	}
}
</style>


