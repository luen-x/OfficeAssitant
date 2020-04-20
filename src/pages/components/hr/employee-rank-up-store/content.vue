<template>
	<div class="v-hr-employee-rank-up-store">
		<div class="_title g-flex g-ai-c g-m-b-10">
			<div class="_left"/>
			<div class="_right">固定规则</div>
		</div>
		<div class="g-m-b-20 _basic">
			<div
				v-for="item in regular_rules"
				:key="item.pro_rule_id"
				class="g-lh-32">
				<span style="color: #4B4F57">{{ item.rule_name }}</span>
				<span style="color: #818794">（{{ item.description }}）</span>
			</div>
		</div>
		<div class="_title g-flex g-ai-c g-m-b-10">
			<div class="_left"/>
			<div class="_right">自定义规则</div>
		</div>
		<div class="g-m-b-20 _self">
			<div
				v-for="item in man_made_rules"
				:key="item.pro_rule_id"
				class="g-lh-32">
				<span style="color: #4B4F57">{{ item.rule_name }}</span>
				<span style="color: #818794">{{ item.description ?'（' + item.description + '）': '' }}</span>
				<span v-if="$auth[848]" class="g-pointer g-c-blue-mid g-m-l-10" @click="handleDelete(item)">删除</span>
			</div>
			<i-button
				v-if="$auth[847]"
				type="primary"
				class="g-m-t-10"
				@click="handleAdd">
				新增
			</i-button>
		</div>
	</div>
</template>

<script>
import { Button } from 'iview';
import { DelTipModal } from '../_common/delete-tip';
import { PModal } from './popup/modal';

export default {
	name: 'oa-content',
	components: {
		'i-button': Button
	},
	data() {
		return {
			regular_rules: [],
			man_made_rules: []
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			const { query } = this.$route;
			this.$request({
				url: '_HR_EMPLOYEE_UP_RULE_DATABASE_GET',
				type: "GET",
				param: {
					system_id: query.system_id,
				},
				loading: false
			}).then(res => {
				this.regular_rules = res.data.regular_rules;
				this.man_made_rules = res.data.man_made_rules;
			}).catch(error => {});
		},
		handleAdd() {
			const { query } = this.$route;
			PModal.popup({
				data: {
					system_id: query.system_id,
					cycle_id: query.cycle_id
				},
			}).then(res => {
				this.loadData();
			}).catch(err => {});
		},
		handleDelete(item) {
			const { query } = this.$route;

			DelTipModal.popup({
				title: '提示',
				content: '确认删除该自定义规则？'
			}).then(res => {
				this.$request({
					url: '_HR_EMPLOYEE_UP_RULE_DATABASE_DELETE_POST',
					type: "POST",
					param: {
						system_id: query.system_id,
						pro_rule_id: item.pro_rule_id
					},
					loading: false
				}).then(res1 => {
					this.$Message.success('操作成功！');
					this.loadData();
				}).catch(error => {});
			}).catch(err => {});
		},
	},
};
</script>

<style lang="scss" scoped>
.v-hr-employee-rank-up-store {
	margin-top: 20px;
	margin-left: 40px;
	._title {
		._left {
			display: inline-block;
			width: 2px;
			height: 16px;
			background: #e84854;
			margin-right: 10px;
		}
		._right {
			display: inline-block;
			color: #e84854;
			font-size: 16px;
		}
	}
}
</style>
