<template>
	<div v-show="showItem" class="g-fw-w v-hr-points">
		<div v-if="spin" class="g-pd-l-20">
			<oa-detail-expend type="expand" show-button>
				<template slot="title">
					<span class="g-fs-14">待确认服务（{{ waitAuditList.length }}）</span>
				</template>
				<div slot="content" class="g-fw-w g-pd-t-25">
					<i-table 
						v-if="waitAuditList.length"
						ref="selection"
						:columns="waitAuditTitle" 
						:stripe="true" 
						:border="false"
						:show-header="false" 
						:data="waitAuditList"
					/>
					<div v-else class="_img-wrapper">
						<img :src="OSS_SEARCH_EMPTY" >
						<span>暂无待审核数据</span>
					</div>
				</div>
			</oa-detail-expend>
			<oa-detail-expend type="expand" class="g-m-t-15">
				<template slot="title">
					<span class="g-fs-14">已确认服务（{{ auditedList.length }}）</span>
				</template>
				<div slot="content" class="g-fw-w g-pd-t-25">
					<i-table 
						v-if="auditedList.length"
						ref="selection"
						:columns="auditedTitle" 
						:stripe="true" 
						:border="false"
						:show-header="false" 
						:data="auditedList"
					/>
					<div v-else class="_img-wrapper">
						<img :src="OSS_SEARCH_EMPTY" >
						<span>暂无已审核数据</span>
					</div>
				</div>
			</oa-detail-expend>
		</div>
		<oa-loading v-else />
	</div>
</template>

<script>
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { Expend } from '@components/hr/points';
import { Table, Message, Spin } from 'iview';
import API_ROOT from '@stores/apis/root';
import auditData from './audit-data';

export default {
	name: 'hr-detail-tabs-audit',
	components: {
		'oa-detail-expend': Expend,
		'i-table': Table,
		'i-spin': Spin,
	},
	mixins: [auditData],
	props: {
		showItem: Boolean,
		type: String,
		contract_company_id: String
	},
	data() {
		return {
			isfetching: 0,
			spin: true,
			OSS_SEARCH_EMPTY
		};
	},
	watch: {
		showItem(val, old) {
			val && this.isfetching === 0 && this.getAuditList();
		}
	},
	created() {
		this.showItem && this.getAuditList();
	},
	methods: {
		getAuditList() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT['_HR_POINT_SERVICE_AUDIT_GET'], // eslint-disable-line
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then((res) => {
				this.auditedList = res.data.confirmed;
				this.waitAuditList = res.data.wait_confirm;
				this.spin = true;
			}).catch((error) => {
				Message.error(error.msg);
				this.spin = true;
			});
		},
	}
};
</script>

<style lang="scss">
.v-hr-points {
	position: relative;
	min-height: 300px;
	max-height: 100%;
	overflow-y: auto;
	._img-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.ivu-table:after {
		width: 0px;
	}
	.ivu-table:before {
		height: 0px;
	}
	.ivu-table-wrapper {
		border: none;
	}
	.ivu-table td {
		border: none;
	}
}
</style>