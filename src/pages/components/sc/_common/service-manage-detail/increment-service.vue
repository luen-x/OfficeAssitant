<template>
	<div class="g-m-t-30 g-pd-r-20 v-sc-inspection-increment-service">
		<i-table
			v-if="incrementData.length > 0"
			:columns="columns"
			:data="incrementData" 
			:stripe="true"
			class="g-m-t-20"
		/>

		<div v-else class="g-tc _empty">
			<img :src="OSS_NO_MESSAGE07">
			<p class="g-fs-14">还未上传任何服务凭证</p>
		</div>
	</div>
</template>

<script>
import { Title } from "@components/sc/_common";
import { Table } from "iview";
import { OSS_NO_MESSAGE07 } from "@constants/constants";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { LookServiceVocher } from "../detail/service-voucher/look-service-voucher";

export default {
	name: 'sc-class-record',

	components: {
		'oa-title': Title,
		'i-table': Table
	},

	props: {
		contract_company_id: {
			required: true,
			type: Number
		}
	},

	data() {
		return {
			OSS_NO_MESSAGE07,
			columns: [
				{
					title: '上传人',
					key: 'staff_name',
					minWidth: 100
				},
				{
					title: '上传时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '服务凭证',
					key: 'img',
					minWidth: 100,
					render: (h, params) => {
						return (
							<div 
								class="g-operation" 
								onClick={() => { this.handleLookVocher(params.row); }}
							>
								查看凭证
							</div>
						);
					}
				},
				{
					title: '备注',
					key: 'remark',
					minWidth: 145,
					render: (h, params) => {
						if (params.row.remark) {
							return (
								<AutoToolTip 
									content={params.row.remark}
									width="140px"
									theme="dark"
									placement="bottom" 
									labelClass=" "
								/>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				}
			],
			incrementData: []
		};
	},

	mounted() {
		this.loadData();
	},
    
	methods: {
		loadData() {
			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_TICKET_GET",
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				}
			}).then(res => {
				this.incrementData = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleLookVocher(obj) {
			LookServiceVocher.popup({
				obj
			}).then();
		}
	}
};
</script>

<style lang="scss">
.v-sc-inspection-increment-service{
    table{
        width: 880px !important;
    }

	._empty{
		height: 250px;
        margin-top: 100px;

		img{
			width: 200px;
			height: 200px;
		}
	}
}
</style>