<template>
	<div>
		<div v-if="ranksArr.length" class="g-m-b-20 v-rank-name-talbe">
			<div 
				v-for="(item, index) in ranksArr"
				:key="index"
				:class="index < ranksArr.length - 1 && 'g-bb'"
				class="_item g-flex-ac"
				style="margin-bottom: -1px"
			>
				<div 
					v-for="(it, index) in nameItem"
					:key="index"
					:class="index < nameItem.length - 1 && 'g-br'"
					class="g-col g-pd-l-20"
				>
					{{ it.label }}{{ item[it.value] }}{{ it.unit }}
				</div>
				<div class="__options">
					<span 
						class="g-c-blue-mid g-fs-12 g-pointer g-m-r-5"
						@click="handleShowAddName('edit', item.sort_id)"
					>
						修改
					</span>
					<span 
						class="g-c-blue-mid g-fs-12 g-pointer" 
						@click="handleDelName(item.sort_id)"
					>
						删除
					</span>
				</div>
			</div>
		</div>
		<button 
			type="button" 
			class="g-red-btn-line"
			style="line-height: 1"
			@click="handleShowAddName('add')"
		>
			新增级称
		</button>
	</div>
</template>

<script>
import emitter from '@extends/mixins/emitter';
import { Message } from 'iview';
import { AddNameModal } from '../popup/add-name';
import { DelTipModal } from '../../_common/delete-tip';

export default {
	name: 'c-hr-rank-form',
	mixins: [emitter],
	model: {
		prop: 'ranks',
		event: 'change'
	},
	props: {
		ranks: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			ranksArr: this.ranks,
			nameItem: [
				{
					value: 'rank_name',
				},
				{
					value: 'regular_subsidy',
					label: '固定补贴：',
					unit: '元/月'
				},
				{
					value: 'commission_rate',
					label: '业绩提成：',
					unit: '%'
				},
				{
					value: 'staff_num',
					label: '人数：'
				}
			],
		};
	},
	watch: {
		ranks(val) {
			this.setCurrentValue(val);
		}
	},
	methods: {
		setCurrentValue(ranks) {
			if (ranks === this.ranksArr) return;
			
			this.ranksArr = ranks;
			this.dispatch('FormItem', 'on-form-change', ranks);
		},
		handleShowAddName(type, id) {
			AddNameModal.popup({
				type,
				info: type === 'edit' ? { 
					...this.ranksArr.filter((item) => item.sort_id === id)[0],
				 } : {},
				ranks: this.ranksArr
			}).then((res) => {
				Message.success(`${type === 'edit' ? '修改' : '新增'}级称成功！`);
				if (type === 'add') {
					let arr = [...this.ranksArr];
					arr.splice(res.level, 0, res);

					let ranks = this.handleResetLevle(arr);
					this.$emit('sure', ranks);
					this.$emit('change', ranks);
					this.setCurrentValue(ranks);
				} else {
					let arr = this.ranksArr.map((item) => {
						if (item.sort_id === res.sort_id) {
							return {
								...item,
								...res,
							};
						}
						return item;
					});
					arr.sort((obj1, obj2) => {
						let objVal1 = obj1.level;
						let objVal2 = obj2.level;
						if (objVal2 < objVal1) {
							return 1;
						} else if (objVal2 > objVal1) {
							return -1;
						} else {
							return -1;
						}
					});

					let ranks = this.handleResetLevle(arr);
					this.$emit('change', ranks);
					this.setCurrentValue(ranks);
				}
			});
		},
		handleDelName(id) {
			DelTipModal.popup({
				title: '删除提示',
				content: '是否确认删除该级称'
			}).then((res) => {
				let arr = this.ranksArr.filter((item) => item.sort_id != id);
				
				let ranks = this.handleResetLevle(arr);
				this.$emit('change', ranks);
				this.setCurrentValue(ranks);
			}).catch((res) => {

			});
		},
		handleResetLevle(arr) {
			return arr.map((item, index) => {
				return {
					...item,
					level: index + 1,
				};
			});
		},
	}
};
</script>

<style lang="scss">
.v-rank-name-talbe {
	border: 1px solid #d9dde0;
	border-radius: 4px;
	margin-right: 140px;
	._item {
		position: relative;
		height: 40px;
		line-height: 40px;
		.__options {
			position: absolute;
			top: 0;
			bottom: 0;
			right: -80px;
			margin: auto 0;
		}
	}	
}
</style>

