<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="查看"
		class="v-hr-employee-data-commissar-modal"
		width="680"
	>

		<div class="g-fs-14 g-flex g-ai-c _content">
			<i-table
				:data="list"
				:columns="columns"
				:height="(list && list.length) ? (list.length > 8 ? 340 : '') : ''"
				stripe
				class="_table"/>
		</div>

		<div slot="footer">
			<i-button type="primary" class="g-red-btn-small" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { Button, Modal, Table } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";

export default {
	name: "hr-academy-transfer-statistic-input-modal",
	components: {
		"i-modal": Modal,
		"i-button": Button,
		"i-table": Table,
		"vc-copy": Copy,
	},
	props: {
		list: Array,
		name: String
	},
	data() {
		return {
			visible: false,
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 120,
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 100,
				},
				{
					title: '任职时间',
					key: 'update_time',
					minWidth: 110,
				}
			],
		};
	},
	computed: {},
	// watch
	mounted() {
		this.visible = true;
		if (this.name === 'manage') {
			this.columns.splice(1, 0,
				{
					title: '职位',
					key: 'position_name',
					minWidth: 100,
				});
		} else {
			this.columns.splice(1, 0,
				{
					title: '职称',
					key: 'rank_name',
					minWidth: 100,
				});
		}
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$emit('sure');
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-employee-data-commissar-modal {
	._table {
		width: 100%;
		margin-left: 50px;
		margin-right: 50px;
		margin-top: 30px;
	}
}
</style>

