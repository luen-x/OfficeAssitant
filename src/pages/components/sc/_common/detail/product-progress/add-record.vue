<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		class="v-sc-customer-intention-add-record"
		@on-ok="handleOk" 
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			添加记录
		</div>
		<div v-for="(item,index) in forms" :key="index">
			<oa-form-item 
				ref="form" 
				:configs="item"
			/>
		</div>

		<div v-if="flag != 1" style="margin-left: 60px;">
			<i-checkbox v-model="is_sync">将此条记录同步至跟进记录</i-checkbox>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Checkbox } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import moment from "moment";
import FromItem, { getRules, getItemType, formatProductDetail, formatCheckValue } from "../../../../sale/_common/customer/cus-form/cus-form";

export default {
	name: "sc-add-record-modal",

	components: {
		"i-modal": Modal,
		"i-checkbox": Checkbox,
		"oa-form-item": FromItem
	},

	props: {
		name: String,
		step_id: Number,
		flag: Number, 
		flags: Number, // 更进记录编辑
		record_id: Number,
		component_info: Array
	},

	data() {
		return {
			visible: false,
			forms: [],
			configs: {
				list: []
			},
			type: "",
			prop: "",
			rule: [],
			data: [], // 提交数据
			elementIds: [],
			editOrAdd: [],
			is_sync: "" // 	是否同步到跟进记录 1是 0否
		};
	},

	async mounted() {
		if (this.flag == 1 && this.flags != 1) {
			await this.handleEdit();
		} else if (this.flags == 1) {
			this.component_info.forEach(item => {
				this.elementIds.push(item.element_id);

				item.input_limit = +item.input_limit;

				if (item.component_type == 6 && item.component_value == "") {
					item.component_value = [];
				}
			});

			this.editOrAdd = this.component_info;

			this.configs.list = formatProductDetail(this.component_info).list;
			this.forms.push(this.configs);
		} else {
			await this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_COMPONENT_INFO_GET,
				type: "GET",
				param: {
					step_id: this.step_id
				}
			}).then(res => {
				res.data.forEach(item => {
					this.elementIds.push(item.element_id);

					item.input_limit = +item.input_limit;

					if (item.component_type == 6 && item.component_value == "") {
						item.component_value = [];
					}
				});

				this.editOrAdd = res.data;

				this.configs.list = formatProductDetail(res.data).list;
				this.forms.push(this.configs);
			}).catch(error => {});
		}

		this.visible = true;
	},

	methods: {
		handleOk() {	
			this.$refs.form[0].getForm().validateAndScroll((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleSave() {
			this.data = [];

			let flags = false;

			this.configs.list.forEach((item, index) => {
				this.data.push({
					field_code: item.label,
					info: this.$refs.form[0].getFormData()[item.prop],
					type: item.flag
				});
			});

			this.editOrAdd.forEach((item, index) => {
				this.data[index].element_id = item.element_id;
				this.data[index].type = item.component_type;
				this.data[index].has_other = item.has_other;
				this.data[index].check_type = item.check_type;
			});
			this.data.forEach((item) => {
				if (item.type == 7) {
					if (item.check_type == 1) {
						if (item.info.includes('value_')) {
							item.info = item.info.replace('value_', '');
						} else {
							item.info = 'other_' + item.info;
						}
					} else if (item.check_type == 2) {
						item.info.forEach((ele, index) => {
							if (item.info[index].includes('value_')) {
								item.info[index] = item.info[index].replace('value_', '');
							} else {
								item.info[index] = 'other_' + item.info[index];
							}
							
						});


					}
				}
				if (item.type == "4") {
					item.info = item.info && moment(item.info).format("YYYY-MM-DD");
				} 

				if (item.type == "6") {
					item.info.forEach(element => {
						if (element.uid) {
							this.$Message.warning("请等待" + item.field_code + "上传完成");
							flags = true;
						}
					});
				}
			});

			if (flags) {
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
				return;
			}

			let API = "";
			let is_sync = "";

			if (this.flag == 1 && !this.flags) {
				API = "_SC_CUSTOMER_COOPERATE_CHANGE_RECORD_POST";
			} else if (this.flags == 1) {
				API = "_SC_CUSTOMER_COOPERATE_EDIT_TRACK_RECORD_POST";
			} else {
				API = "_SC_CUSTOMER_COOPERATE_MAKE_RECORD_POST";
				is_sync = this.is_sync ? 1 : 0;
			}
			this.$request({
				url: API_ROOT[API],
				type: "POST",
				param: {
					step_id: this.step_id,
					content: this.data,
					record_id: this.flag == 1 ? this.record_id : "",
					is_sync
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleEdit() {
			return this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_EDIT_GET,
				type: "GET",
				param: {
					record_id: this.record_id
				}
			}).then(res => {
				res.data.component_info.forEach(item => {
					item.input_limit = +item.input_limit;

					if (item.component_type == 6 && item.component_value == "") {
						item.component_value = [];
					}
				});

				this.editOrAdd = res.data.component_info;
				this.configs.list = formatProductDetail(res.data.component_info).list;

				this.configs.list.forEach(item => {
					if (item.itemType == "region") {
						item.value.forEach((element, index, arr) => {
							arr[index] = (Number(element));
						});
					}
				});
				
				this.forms.push(this.configs);
			});
		}
	}
};
export const AddRecordModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-intention-add-record{
	.ivu-modal-body{
		max-height: 388px;
		overflow: auto;
	}
}
</style>