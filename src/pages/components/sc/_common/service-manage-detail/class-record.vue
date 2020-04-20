<template>
	<div class="g-m-t-30 g-pd-r-20 v-sc-sevice-class-record">
		<oa-title title="上课记录"/>

		<i-table
			:columns="columns"
			:data="classRecord" 
			:stripe="true"
			class="g-m-t-20"
		/>
	</div>
</template>

<script>
import { Title } from "@components/sc/_common";
import { Table } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

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
			columns: [
				{
					title: '课程名称',
					key: 'activity_name',
					minWidth: 140
				},
				{
					title: '课程时间',
					key: 'start_time',
					minWidth: 260,
					render: (h, params) => {
						return (
							<div>{params.row.start_time}至{params.row.end_time}</div>
						);
					}
				},
				{
					title: '参与人数',
					key: 'join_num',
					minWidth: 100
				},
				{
					title: '参与人',
					key: 'join_people',
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.join_people}
								width="90px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '是否起盘',
					key: 'lift_plate',
					minWidth: 180
				},
				{
					title: '已招代理数',
					key: 'proxy_num_name',
					minWidth: 100
				}
			],
			classRecord: []
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.$request({
				url: "_SC_MANAGE_INSPECTION_RECORD_GET",
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				}
			}).then(res => {
				this.classRecord = res.data.list;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-sevice-class-record{
	padding-left: 32px;
}
</style>