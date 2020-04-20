<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true" 
		:mask-closable="false"
		width="400"
		class="v-hr-entry-role-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">兼角色</div>
		<!-- <div  v-if="is_show" class='_role'>
			<div v-for='item in extra_role' :key='item.role_id' class='g-flex  _item'>
				<div>兼角色：</div>
				<div>{{item.role_name}}</div>
			</div>
		</div> -->
		<i-form
			ref="formInline"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="60"
			class="_form"
		>
			<div
				v-for="(item, index) in formValidate.roleListArr"
				:key="index+item.role_id"
				:style="{ marginLeft: '30px' }"
				class="g-flex g-flex-ac"
			>
				<i-form-item label="兼角色:">
					<i-select
						v-model="item.role_id"
						:remote-method="(e)=>handleSelectRole(e,index)" 
						:loading="isLoading"
						:style="{ width: '220px' }"
						:multiple="false"
						:ref="`staff${index}`"
						:disabled="is_show"
						label-in-value 
						filterable
						remote
						clearable
						transfer
						@on-change="handleStaffChange($event, index)"
						@on-query-change="handleQueryChange($event,index)"
						@on-clear="handleClear(index)"
					>
						<i-option
							v-for="(role) in allRoles[index]"
							:value="role.role_id"
							:key="role.role_id"
						>{{ role.role_name }}</i-option>
					</i-select>
				</i-form-item>
				<span v-if="!is_show" class="g-m-b-20 g-m-l-10">
					<i
						v-if="formValidate.roleListArr.length != 1"
						class="iconfont icon-remove-circle g-fs-16 g-c-pink-mid"
						@click="handleDel(index)"
					/>
					<i
						v-if="formValidate.roleListArr.length == index+1 && formValidate.roleListArr.length < 3"
						class="iconfont icon-add1 g-fs-16 g-c-blue-mid"
						@click="handleAdd"
					/>
				</span>
			</div>
		</i-form>
	</i-modal>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import {
	Modal,
	Form,
	FormItem,
	RadioGroup,
	Radio,
	Cascader,
	Select,
	Option
} from "iview";
import { CreatePortal } from "wya-vc";
import { log } from "util";

export default {
	name: "v-hr-entry-role-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader
	},
	props: {
		extra_role: {
			type: Array,
			default() {
				return [];
			}
		},
		show: {
			type: Boolean,
		},
		is_auth: Number,
	},
	data() {
		return {
			visible: false,
			isLoading: false,
			allRoles: [],
			is_show: this.show || !this.is_auth,
			formValidate: {
				roleListArr: this.extra_role.length == 0 ? [{ role_id: "" }] : JSON.parse(JSON.stringify(this.extra_role))
			},
			ruleValidate: {
				role_id: [
					{
						required: false,
						message: "请选择兼角色",
						type: "number",
						trigger: "blur"
					}
				]
			}
		};
	},

	mounted() {
		this.visible = true;
		this.formValidate.roleListArr.forEach((ele, index) => {
			this.handleSelectRole(ele.role_name, index);
		});
	},

	methods: {
		handleSelectRole(query, index) {
			if (!Number(query)) {
				let param = {
					role_name: query
				};
				if (this.is_auth != 0) {
					param.is_level = 1;
				}
				this.isLoading = true;
				this.$request({
					url: API_ROOT._HR_ROLE_DATA_GET,
					type: "GET",
					param,
					loading: false
				}).then(res => {
					this.isLoading = false;
					this.allRoles[index] = res.data || [];
					this.$forceUpdate();
				});
			}
			
		},
		handleAdd() {
			this.handleSelectRole('', this.formValidate.roleListArr.length);
			this.formValidate.roleListArr.push({
				role_id: "" // 部门id
			});
		},
		handleDel(index) {
			if (this.formValidate.roleListArr.length == 1) {
				return; 
			}
			this.allRoles.splice(index, 1);
			this.formValidate.roleListArr.splice(index, 1);
		},
		handleOk() {
			this.formValidate.roleListArr = this.formValidate.roleListArr.filter(
				item => {
					if (
						item.length == 0 || item.role_id == "" || item.role_id == undefined
					) {
						return;
					}
					return item;
				}
			);
			let Len = this.formValidate.roleListArr.length;
			let newArr = [];
			for (let i = 0; i < Len; i++) {
				newArr.push(this.formValidate.roleListArr[i].role_id);
			}
			let uniqueNewArr = Array.from(new Set([...newArr]));
			if (uniqueNewArr.length != newArr.length) {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('兼角色不能有重复');

			} else {
				this.$emit("sure", this.formValidate.roleListArr);
			}			
		},
		handleCancel() {
			this.$emit("close", false);
		},
		handleStaffChange(obj, index) {
			this.formValidate.roleListArr[index].role_id = obj && obj.value ? obj.value : '';
			this.formValidate.roleListArr[index].role_name = obj && obj.label ? obj.label : '';
		},
		handleQueryChange(query = '', index) {
			let targetQuery = this.formValidate.roleListArr[index].role_name || '';
			if (targetQuery.length > query.length) {
				this.handleSelectRole('', index);
				this.$refs[`staff${index}`][0].clearSingleSelect();
				this.formValidate.roleListArr[index].role_name = '';
			}
		},
		handleClear(index) {
			this.handleSelectRole('', index);
		}
	}
};
export const RoleModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-entry-role-modal {
	._role {
		font-size: 14px;
		padding-top: 40px;
		padding-left: 60px;
		._item {
			margin-bottom: 20px;
		}
	}
    ._form {
        margin: 26px 0px -35px 0px;
        .ivu-modal-body {
            padding: 0px !important;
            max-height: 576px;
            overflow: auto;
        }
        ._icon {
            margin-top: -70px;
            margin-left: -30px;
        }
    }
}
</style>


