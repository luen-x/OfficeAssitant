<template>
	<div class="v-wroksheet-project-module g-m-r-30">
		<div 
			v-for="(item, index) in list" 
			:key="item.uid"
			:class="{'_module': curIndex === index}"
			class="g-flex g-jc-sb g-m-b-10 g-pd-lr-10 g-pointer" 
			style="width: 330px;box-sizing: border-box;"
			@click="handleClick(index)"
		>
			<span>
				<span>{{ item.module_name }}</span>
				<span>{{ `${item.staff_name ? ('（' + item.staff_name + '）') : ''}` }}</span>
			</span>
			<div v-if="!disabled" style="color: #818794;">
				<i class="icon iconfont icon-bianji" @click="handleEdit(item, index)"/>
				<i class="icon iconfont icon-delete1 g-m-l-10" @click="handleDel(item, index)"/>
			</div>
		</div>
		<div v-if="!disabled" class="g-pointer" @click="handleAdd">
			<i class="icon iconfont icon-add1 g-c-blue-mid" style="position: relative;top: 2px;left: 8px"/>
			<span class="g-m-l-10">添加{{ ['一','二','三'][+level - 1] }}级模块</span>
		</div>
	</div>
</template>
<script>
import { Confirm } from '@components/_common/confirm/confirm';
import { projectModuleAdd } from "../popup/module-add";

const MAX_MODULE_NUM = 30;
export default {
	name: 'oa-project-module',
	props: {
		level: String,
		disabled: Boolean,
		value: Number, // 当前选中项的index
		list: {
			type: Array,
			default: () => []
		},
		systemId: [String, Number],
		parentModuleId: [String, Number],
		parentStaffId: [String, Number]
	},
	data() {
		return {
			curIndex: this.value,
		};
	},
	watch: {
		value(val) {
			this.curIndex = val;
		}
	},
	methods: {
		handleClick(index) {
			this.curIndex = index;
			this.$emit('input', index);
		},
		handleAdd() {
			projectModuleAdd.popup({
				autoSave: this.$route.query.action == "update",
				systemId: this.systemId,
				parentModuleId: this.parentModuleId,
				parentStaffId: this.parentStaffId,
				max: MAX_MODULE_NUM - this.list.length,
				level: this.level
			}).then(res => {
				if (this.$route.query.action == "add") {
					this.list.push(...res.module_list);
					this.$vc.emit('WORKSHEET_CONTROL_PROJECT_ADD_MODULE');
				} else if (this.$route.query.action == 'update') {
					this.$vc.emit('WORKSHEET_CONTROL_PROJECT_UPDATE_MODULE');
				}
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleEdit(item, index) {
			projectModuleAdd.popup({
				inEdit: true,
				autoSave: this.$route.query.action == "update",
				systemId: this.systemId,
				moduleId: item.module_id !== undefined ? item.module_id : '',
				moduleName: item.module_name,
				staffId: item.staff_id !== undefined ? item.staff_id : '',
				staffName: item.staff_name || '',
				parentModuleId: this.parentModuleId,
				max: MAX_MODULE_NUM - this.list.length,
				level: this.level
			}).then(res => {
				if (this.$route.query.action == "add") {
					this.$set(this.list, index, res.module_list[0]);
					this.$vc.emit('WORKSHEET_CONTROL_PROJECT_ADD_MODULE');
				} else if (this.$route.query.action == 'update') {
					this.$vc.emit('WORKSHEET_CONTROL_PROJECT_UPDATE_MODULE');
				}
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleDel(item, index) {
			let msg = "是否确认删除该模块?";
			if (item.child && item.child.length) {
				msg += " 删除后，该模块下的所有子模块将都会被删。";
			}
			if (item.module_id) {
				Confirm.popup({
					title: "删除提示",
					msg
				}).then(() => {
					this.$request({
						url: '_WORKSHEET_CONTROL_MODULE_DEL_POST',
						type: 'POST',
						loading: false,
						param: {
							module_id: item.module_id,
							system_id: this.systemId
						},
						autoTip: true
					}).then(res => {
						this.list.splice(index, 1);
						item.inEdit = false;
						this.emitEditItem(item);
					}).catch(err => {});
				}).catch(err => {
					err && console.error(err);
				});
			} else {
				this.list.splice(index, 1);
			}
		}
	}
};

export const worksheetProjectModule = module.exports.default;
</script>
<style lang="scss">
.v-wroksheet-project-module {
	margin-left: 4px;
	._module {			
		background: #F8F8F8;
	}
}
</style>
