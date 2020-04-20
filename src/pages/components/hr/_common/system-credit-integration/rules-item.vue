<template>
	<i-form 
		ref="form"
		class="v-system-integration-item">
		<div class="_title g-flex g-jc-sb">
			<span>
				{{ info.system_name }} 
				<span 
					class="g-m-l-15"
					style="color: #e84c57"
				>{{ !showEdit ? '本月规则' : '下月生效' }}</span>
			</span>
			<span 
				v-if="showEdit" 
				class="g-operation" 
				@click="$emit('reset')">重置回本月规则</span>
		</div>
		<div 
			v-for="(item, index) of info.types"
			:key="index"
			class="_item g-flex"
		>
			<div style="width: 150px" class="_border">{{ item.type_name }}</div>
			<div style="width: 150px" class="_border">
				<div class="g-m-b-20">{{ name }}上限：{{ item.year_maximum === null ? '不限' : item.year_maximum }}</div>
				<div v-if="type === '2'">
					每月上限：{{ item.month_maximum === null ? '不限' : item.month_maximum }}
				</div>
			</div>
			<div :class="{'_border': !item.rule_info.length, 'g-flex': true, 'g-fd-c': true}" style="flex: 1">
				<div 
					v-for="(info, i) of item.rule_info"
					:key="i"
					class="g-flex">
					<div style="flex: 1" class="_border">
						<div class="g-m-b-20">
							<span class="g-c-black4">{{ info.display_text }}</span>
							<oa-explain 
								icon="icon-question"
								style="marginLeft: 2px"
							>
								<oa-integration-before
									v-if="type === '1'"
									slot="content"
									:id="info.rule_type + ''"
									:formdata="info"
								/>
								<oa-credit-before
									v-else
									slot="content"
									:id="info.rule_type + ''"
									:formdata="info" 
								/>
							</oa-explain>
							<span 
								v-if="showEdit && (type === '1' ? $auth[1162] : $auth[1180])"
								class="g-operation g-m-l-10" 
								@click="() => handleAdd(info, true)">编辑</span>
							<i-divider v-if="showEdit" type="vertical" />
							<span 
								v-if="showEdit && (type === '1' ? $auth[1163] : $auth[1181])" 
								class="g-operation" 
								@click="() => handleDel(info)">删除</span>
						</div>
						<div v-if="info.rules">
							<template v-for="(mess) of info.rules">
								<oa-integration-goal 
									v-if="type === '1'" 
									:key="mess.rule_id"
									:id="info.rule_type + ''" 
									:formdata="mess"
									class="g-m-t-10" />
								<oa-credit-goal
									v-else 
									:key="mess.rule_id"
									:id="info.rule_type + ''" 
									:formdata="mess"
									class="g-m-t-10" />
							</template>
						</div>
						<div v-else>
							<oa-integration-goal 
								v-if="type === '1'" 
								:disabled="true"
								:system-id="info.rank_system_type"
								:id="info.rule_type + ''" />
							<oa-credit-goal
								v-else 
								:disabled="true"
								:id="info.rule_type + ''" />
						</div>
					</div>
					<div v-if="type === '1'" style="width: 260px" class="_border">
						<template v-if="info.relate_info.relate_number">
							<span>
								<i :style="{background: handleColor(info.relate_info.relate_number)}" class="_dot" />
								<span>{{ item.type_name }}关联组{{ info.relate_info.relate_number }}</span>
							</span>
							<span 
								v-if="$auth[1167] && showEdit"
								class="g-operation" 
								@click="() => handleDelRelate(info.relate_info)">
								移除关联组
							</span>
						</template>
						<template v-else-if="showEdit">
							<span 
								v-if="$auth[1166]"
								class="g-operation" 
								@click="() => handleRelation(info, item.type_name)">关联</span>
							<oa-explain 
								style="marginLeft: 2px"
								content="关联项目中，位于同一个关联组内的规则将只取最高分项目增加积分"
							/>
						</template>
					</div>
				</div>
				<!-- <div class="g-flex">
					<div style="flex: 1" class="_border">
						<div>111</div>
					</div>
					<div style="width: 200px" class="_border">
						<span>
							<i class="_dot" style="background: #E84C57;"/>
							<span>关联组</span>
						</span>
						<span class="g-operation">
							移除关联组xxxx
						</span>
					</div>
				</div> -->
			</div>
			<div v-if="showEdit" style="width: 120px" class="_border">
				<span 
					v-if="(type === '1' ? $auth[1161] : $auth[1179])"
					class="_btn" 
					@click="() => handleAdd(item, false)">新增规则</span>
			</div>
		</div>
	</i-form>
</template>

<script>
import { Input, Form, Divider } from 'iview';
import { ConfirmModal } from '@components/hr/_common/popup/confirm';
import Explain from '@components/_common/explain/explain';
import { RulesModal } from './rules-popup/rules';
import { RelationModal } from './rules-popup/relation';
import IntegrationGoal from './integration-condition/table-goal';
import CreditGoal from './credit-condition/table-goal';
import IntegrationBefore from './integration-condition/table-before';
import CreditBefore from './credit-condition/table-before';

export default {
	name: 'hr-system-assess-integration-item',
	components: {
		'i-input': Input,
		'i-form': Form,
		'oa-integration-goal': IntegrationGoal,
		'oa-credit-goal': CreditGoal,
		'oa-explain': Explain,
		'i-divider': Divider,
		'oa-integration-before': IntegrationBefore,
		'oa-credit-before': CreditBefore
	},
	props: {
		type: String,
		info: Object,
		showEdit: Boolean
	},
	data() {
		return {
			arr: [{}, {}],
			name: this.type === '1' ? '积分' : '学分',
		};
	},
	methods: {
		handleColor(num) {
			let numObj = {
				'1': '#E84C57',
				'2': '#2397F9',
				'3': '#ED8F4A',
				'4': '#4FC43D',
				'5': '#924CE8',
			};
			return numObj[num] || numObj['1'];
		},
		handleAdd(info, isEdit) {
			const { type_id, cycle_id } = info;
			RulesModal.popup({
				type: this.type,
				info: isEdit ? info : {},
				type_id,
				cycle_id,
				isEdit
			}).then(res => {
				this.$emit('load');
			}).catch(err => {

			});
		},
		handleRelation(info, type_name) {
			const { cycle_id, rule_info_id, type_id } = info;
			RelationModal.popup({
				cycle_id,
				rule_info_id,
				type_id,
				type_name,
				cate: this.type
			}).then(res => {
				this.$emit('load');
			}).catch(err => {

			});
		},
		handleDelRelate(info) {
			const { rule_info_id, relate_id } = info;
			ConfirmModal.popup({
				content: '确定要移出关联组吗'
			}).then(res => {
				this.$request({
					url: '_HR_SYSTEM_ASSESS_CREDITINTE_RELATE_REMOVE_GET',
					type: 'GET',
					param: {
						relate_id,
					},
				}).then(mess => {
					this.$Message.success(mess.msg);
					this.$emit('load');
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(err => {

			});
		},
		handleDel(info) {
			ConfirmModal.popup({
				content: '确定要删除这条规则吗'
			}).then(res => {
				this.$request({
					url: '_HR_SYSTEM_ASSESS_CREDITINTE_RULES_DEL_POST',
					type: 'GET',
					param: {
						cate: this.type,
						relate_id: info.relate_info.relate_id,
						rule_info_id: info.rule_info_id,
					},
				}).then(mess => {
					this.$Message.success(mess.msg);
					this.$emit('load');
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(err => {

			});
		},
	}
};
</script>

<style lang="scss">
.v-system-integration-item {
	border-radius: 4px;

	& > ._title {
		background: #F0F4FC;
		padding: 15px 20px;
	}
	& > ._item {
		border-left: 1px solid #EBEEF1;

		._border {
			padding: 20px 20px;
			border-right: 1px solid #EBEEF1;
			border-bottom: 1px solid #EBEEF1;
		}
		._btn {
			display: inline-block;
			border-radius: 4px;
			width: 80px;
			height: 32px;
			text-align: center;
			line-height: 32px;
			border: 1px solid #d4d7d8;
			cursor: pointer;
		}
		._btn:hover {
			border: 1px solid #e84c57;
			color: #e84c57 !important;
		}

		._dot {
			display: inline-block;
			width: 10px;
			height: 10px;
		}
	}
}
</style>


