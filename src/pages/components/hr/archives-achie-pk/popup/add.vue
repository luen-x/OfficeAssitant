<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true" 
		:mask-closable="false"
		width="450"
		class="v-hr-entry-role-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">{{ tittle }}</div>
		<i-form
			ref="formInline"
			:model="formData"
			:rules="ruleValidate"
			:label-width="80"
			class="_form"
		>
			<!-- 上半部分开始 -->
			<div
				v-for="(item, index) in formData.guard_depart_ids"
				:key="index"
				:style="{ marginLeft: '30px' }"
				class="g-flex g-flex-ac"
			>
				<i-form-item :label="index==0?'擂主战区:':''">
					<i-select
						v-model="formData.guard_depart_ids[index]"
						placeholder="请选择擂主战区"
						style="width: 220px"
						clearable
						transfer
						class="g-m-r-5"
					>
						<i-option
							v-for="item in departList.filter((depart)=>{
								if( depart.depart_id ==item) return true;
								const arr = [...formData.guard_depart_ids,...formData.attack_depart_ids]
								return !arr.includes( depart.depart_id)

							})"
							:key="item.depart_id"
							:value="item.depart_id"
						>{{ item.depart_name }}</i-option>
					</i-select>
				</i-form-item>
				<span class="g-m-b-20 g-m-l-10">
					<i
						v-if="formData.guard_depart_ids.length != 1"
						class="iconfont icon-remove-circle g-fs-16 g-c-pink-mid"
						@click="handleGuardDepartDel(index)"
					/>
					<i
						v-if="formData.guard_depart_ids.length == index+1 && formData.guard_depart_ids.length < 6"
						class="iconfont icon-add1 g-fs-16 g-c-blue-mid"
						@click="handleGuardDepartAdd"
					/>
				</span>
			</div>
			<!-- 上半部分结束 -->
			<i-form-item label="PK金额:" class="g-m-l-30">
				<i-input-number
					v-model="formData.pk_amount"
					:max="99999"
					:min="0"
					style="width: 220px"
					placeholder="请输入PK金额"
					clearable
					@on-change="handleInputChange"
				/>
			</i-form-item>
			<!-- 下半部分开始 -->
			<div
				v-for="(item, index) in formData.attack_depart_ids"
				:key="item.depart_id"
				:style="{ marginLeft: '30px' }"
				class="g-flex g-flex-ac"
			>
				<i-form-item :label="index==0?'攻擂者战区:':''">
					<i-select
						v-model="formData.attack_depart_ids[index]"
						placeholder="请选择攻擂者战区"
						style="width: 220px"
						clearable
						transfer
						class="g-m-r-5"
					>
						<i-option
							v-for="item in departList.filter((depart)=>{
								if( depart.depart_id ==item) return true;
								const arr = [...formData.guard_depart_ids,...formData.attack_depart_ids]
								return !arr.includes( depart.depart_id)

							})"
							:key="item.depart_id"
							:value="item.depart_id"
						>{{ item.depart_name }}</i-option>
					</i-select>
				</i-form-item>
				<span class="g-m-b-20 g-m-l-10">
					<i
						v-if="attack_depart_ids.length != 1"
						class="iconfont icon-remove-circle g-fs-16 g-c-pink-mid"
						@click="handleAttackDepartDel(index)"
					/>
					<i
						v-if="attack_depart_ids.length == index+1 && attack_depart_ids.length < 6"
						class="iconfont icon-add1 g-fs-16 g-c-blue-mid"
						@click="handleAttackDepartAdd"
					/>
				</span>
			</div>
			<!-- 下半部分结束 -->
		</i-form>
	</i-modal>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import {
	Modal,
	Form,
	FormItem,
	Input,
	InputNumber,
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
		"i-select": Select,
		"i-option": Option,
		"i-input": Input,
		"i-input-number": InputNumber,
		 
	},
	props: {
		tittle: String,
		pk_id: String,
		pk_amount: Number,
		guard_depart_ids: Array,
		attack_depart_ids: Array,
	},
	data() {
		return {
			visible: false,
			cycleListArr: [],
			guard_depart: [],
			attack_depart: [],
			departList: [],
			formData: {
				pk_amount: this.pk_amount || 0,
				guard_depart_ids: this.guard_depart_ids.length ? this.guard_depart_ids : [],
				attack_depart_ids: this.attack_depart_ids.length ? this.attack_depart_ids : [],
				// roleListArr: this.extra_role.length == 0 ? [{ role_id: "" }] : JSON.parse(JSON.stringify(this.extra_role))
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
		// this.loadFormData();
		this.loadDepartList();

	},

	methods: {
		loadDepartList() {
			this.$request({
				url: API_ROOT._HR_DEPART_TWO_LEVEL_DEPART_GET,
				type: "GET",
				param: {
					type: 2,
				},
				loading: false
			}).then(res => {
				this.departList = res.data;
			});
		},
		loadFormData() {
			this.formData.guard_depart_ids.forEach((ele, index) => {
				this.loadData(ele, index, 'guard_depart');
			});
			this.formData.attack_depart_ids.forEach((ele, index) => {
				this.loadData(ele, index, 'attack_depart');
			});
		},
		handleInputChange(value) {
			this.formData.pk_amount = value;
		},
		handleGuardDepartAdd(index) {
			this.loadData('', this.formData.guard_depart_ids.length, 'guard_depart');
			this.formData.guard_depart_ids.push('');
		},
		handleGuardDepartDel(index) {
			if (this.formData.guard_depart_ids.length == 1) {
				return; 
			}
			this.guard_depart.splice(index, 1);
			this.formData.guard_depart_ids.splice(index, 1);

		},
		handleAttackDepartDel(index) {
			if (this.formData.attack_depart_ids.length == 1) {
				return; 
			}
			this.attack_depart.splice(index, 1);
			this.formData.attack_depart_ids.splice(index, 1);
			// this.loadData('', '', '', [arr]);
		},
		handleAttackDepartAdd(index) {
			this.loadData('', this.formData.attack_depart_ids.length, 'attack_depart');
			this.formData.attack_depart_ids.push('');
			
		},
		loadData(query, index, depart, id) {
			this.isLoading = true;
			this.$request({
				url: API_ROOT._HR_DEPART_TWO_LEVEL_DEPART_GET,
				type: "GET",
				param: {
					type: 2,
					selected_depart_id: id
				},
				loading: false
			}).then(res => {
				this.isLoading = false;
				this[depart][index] = res.data || {};
				this.$forceUpdate();
			});
		},
		handleDel(index) {
			if (this.formData.roleListArr.length == 1) {
				return; 
			}
			this.allRoles.splice(index, 1);
			this.formData.roleListArr.splice(index, 1);
		},
		handleOk() {
			let guard_depart_ids = this.formData.guard_depart_ids.filter(d => d);
			let attack_depart_ids = this.formData.attack_depart_ids.filter(d => d);
			if (guard_depart_ids.length == 0) {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('擂主战区必选');
				return; 
			}
			if (attack_depart_ids.length == 0) {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('攻擂者战区必选');
				return; 
			}
			if (!this.formData.pk_amount) {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('请输入PK金额');
				return; 
			}
			if (this.formData.pk_amount < 0) {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('PK金额必须大于0');
				return; 
			}
			if (guard_depart_ids.length !== attack_depart_ids.length) {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('PK战区个数需要对应');
				return; 
			}
			let param = {
				guard_depart_ids,
				attack_depart_ids,
				pk_amount: this.formData.pk_amount
			};
			if (this.pk_id) {
				param.pk_id = this.pk_id;
			}
			this.$request({
				url: API_ROOT._HR_ARCHIVES_ACHIE_PK_ZONE_DEPART_PK_SAVE_POST,
				type: "POST",
				param,
				loading: false
			}).then(res => {
				this.$store.commit('HR_ARCHIVES_ACHIE_PK_LIST_INIT');
				this.visible = false;
				this.$Message.success(res.msg);
			}).catch((error) => {
				console.error(error);
				this.$refs.modal.buttonLoading = false;
			});			
		},
		handleCancel() {
			this.$emit("close", false);
		},
		handleStaffChange(obj, index) {
			this.formData.roleListArr[index].role_id = obj && obj.value ? obj.value : '';
			this.formData.roleListArr[index].role_name = obj && obj.label ? obj.label : '';
		},
		handleQueryChange(query = '', index) {
			let targetQuery = this.formData.roleListArr[index].role_name || '';
			if (targetQuery.length > query.length) {
				this.loadData('', index);
				this.$refs[`staff${index}`][0].clearSingleSelect();
				this.formData.roleListArr[index].role_name = '';
			}
		},
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-entry-role-modal {
	.ivu-modal-body {
		padding: 3px  !important;
		min-height: 190px;
		max-height: 500px !important;
		overflow-y: auto !important;
	}
    ._form {
        margin: 26px 0px -35px 0px;
       
        ._icon {
            margin-top: -70px;
            margin-left: -30px;
        }
    }
}
</style>


