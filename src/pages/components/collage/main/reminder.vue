<template>
	<div class="v-collage-main-todo g-flex g-fd-c g-jc-sb g-ai-c">
		<div class="_content g-m-lr-5">
			<div class="_table-header g-fs-14">今日课程</div>
			<div class="_table-body g-pd-20">
				<i-table
					:data="courseList"
					:columns="columns"
					:width="400"
					:height="courseList.length > 3 ? 120 : ''"
					:show-header="false"
					class="_table" />
			</div>
		</div>
		<div class="g-m-tb-10">
			<span
				class="g-gray-btn-dash" 
				@click="handleAddSched"
			>
				查看本月安排
			</span>
		</div>
	</div>
</template>

<script>
import { Button, Poptip, Table, Row, Col, Tooltip } from 'iview';
import { OSS_EMPTY } from '@constants/constants';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	name: 'v-collage-main-todo',
	components: {
		'i-button': Button,
		'i-poptip': Poptip,
		'i-table': Table,
		'i-row': Row,
		'i-col': Col,
		'i-tooltip': Tooltip
	},
	props: {
		onRefresh: Function,
		data: Array
	},
	data() {
		return {
			OSS_EMPTY,
			columns: [
				{
					title: "部门",
					key: "contract_company_name",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.contract_company_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "部门",
					key: "lecture_set_name",
					minWidth: 100,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.lecture_set_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "部门",
					key: "lecture_time",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.lecture_time}
								labelClass=""
								theme="dark"
							/>
						);
					}
				}
			]
		};
	},
	computed: {
		courseList() {
			// return this.$store.state.collageMain.data.left_info || [];
			let list = this.data;
			return list;
		},
	},
	mounted() {},
	methods: {
		handleAddSched() {
			if (this.$auth[734] || this.$auth[1391]) {
				this.$router.push({
					path: '/collage/main/schedule',
					query: {
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
.v-collage-main-todo {
	position: relative;
	height: 362px;
	box-sizing: border-box;
	padding-top: 20px;
	overflow-y: auto;
	._content {
		// width: 98%;
		min-width: 260px;
		max-height: 206px;
		text-align: center;
		box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		._table-header {
			height: 46px;
			line-height: 46px;
			background:rgba(248,248,248,1);
		}
	}
}
</style>

<style lang="scss">
.v-collage-main-todo {
	.ivu-table-wrapper {
		border: none;
	}
	.ivu-table:before {
		height: 0;
	}
	.ivu-table:after {
		width: 0;
	}
	.ivu-table td, .ivu-table th {
		border-bottom: none;
	}
	.ivu-table-tbody tr:nth-of-type(odd) td {
		background-color: #F8F8F8;
	}
}
</style>

