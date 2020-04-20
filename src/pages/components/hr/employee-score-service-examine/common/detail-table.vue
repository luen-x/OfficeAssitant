<template>
	<div class="page">
		<div
			class="g-m-t-30 g-m-b-20 g-flex g-jc-sb"
			style="cursor:pointer;"
			@click="handleToggle('confirmed_expand')"
		>
			<span>
				<i
					:class=" show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-m-l-5 g-fs-12"
				/>
				<span class="g-fs-14">
					{{ name }}
				</span>
				<span v-if="showNumber" class="g-fs-12 g-m-l-10">
					（ <span class="g-c-red-mid">{{ confirmedCount||'0' }}</span>待处理）
				</span>
			</span>
			<slot name="extra"/>
		</div>
		<vc-expand ref="confirmed_expand" v-model="show">
			<i-table
				ref="table"
				:columns="columns"
				:data="dataSource"
				:show-header="false"
				stripe
				@on-selection-change="handleSelectionChange"
			/>
			<div v-if="showSelect&&dataSource.length&&$auth[1739]" class="g-red-btn-line g-m-t-20" @click="handleWholeEvaluate">整体评定</div>
		</vc-expand>
	</div>
</template>

<script>
import { Expand } from "wya-vc";
import { Table, Tooltip } from "iview";

export default {
	components: {
		"vc-expand": Expand,
		"i-table": Table
	},
	props: {
		name: String,
		confirmedCount: {
			type: [Number, String],
			default: ''
		},
		showSelect: {
			type: Boolean,
			default: false
		},
		showNumber: {
			type: Boolean,
			default: false
		},
		columns: {
			type: Array,
			default() { return []; },
		},
		dataSource: {
			type: Array,
			default() { return []; },
		}
	},
	data() {

		return {
			show: false,
			selectRes: true,
			selectList: [],
		};
	},
	mounted() {
		this.$refs.table.$el.addEventListener(
			"scroll",
			this.tableBottom
		);
	},
	methods: {
		handleToggle(value) {
			this.$refs[value].toggle();
			this.$emit('expand', this.show);
		},
		loadConfirmData() {
			// this.$request({
			// 	url: API_ROOT._HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_SERVICE_LIST_GET,
			// 	type: "GET",
			// 	param: {
			// 		contract_company_id: this.contract_company_id,
			// 		type: this.type,
			// 		page: this.confirmPage
			// 	},
			// 	loading: false
			// }).then(res => {
			// 	this.confirmFlag = false;
			// 	if (res.data.list.length == 0) {
			// 		// 移除滚动事件
			// 		this.$refs.tableTable && this.$refs.confirmTable.$el.removeEventListener("scroll", this.tableBottom);
			// 		return;
			// 	}
			// 	this.confirm = [...this.confirm, ...res.data.list];
			// 	this.confirmCount = res.data.totalCount;
			// }).catch(error => {
			// 	console.error(error);
			// });
			this.$refs.tableTable && this.$refs.confirmTable.$el.removeEventListener("scroll", this.tableBottom);
		},
		handleSelectionChange(rows) {
			this.selectList = rows;
			if (rows.length > 1) {
				this.selectRes = rows.every((item) => {
					 return item.contract_ids == rows[0].contract_ids && item.service_name == rows[0].service_name
				&& item.material_month == rows[0].material_month;
				});
				!this.selectRes && this.$Message.error('选择项不可整体评定');
			}

		},
		handleWholeEvaluate() {
			if (!this.selectRes) {
				this.$Message.error('选择项不可整体评定');
			} else {
				this.$emit('select-evaluate', this.selectList);
			}

		},
		tableBottom(e) {
			// if (this.confirmFlag) {
			// 	return;
			// }
			// if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 10) {
			// 	this.confirmFlag = true;
			// 	this.confirmPage++;
			// 	this.loadConfirmData(this.confirmPage);
			// }
		},
	}
};
</script>

<style scoped lang="">
</style>
