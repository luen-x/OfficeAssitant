<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true"
		:mask-closable="false"
		:width="400"
		class="v-content-add-class"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			新增分类
		</div>
		<i-form 
			ref="form"
			:model="formData"
			:rules="rule"
			:label-width="100" 
			class="g-m-t-20"
		>
			<i-form-item label="分类名称:" prop="category_name">
				<i-input 
					v-model="formData.category_name" 
					style="width: 90%" 
					placeholder="请输入分类名称" 
				/>
			</i-form-item>

			<i-form-item label="上级分类:" prop="selectClass">
				<i-select 
					v-model="formData.selectClass" 
					:disabled="flag == 1 ? true : false" 
					transfer
					placeholder="请选择分类"
					style="width: 90%"
				>
					<i-option 
						v-for="item in parent_list" 
						:key="item.pid" 
						:value="item.pid"
					>
						{{ item.category_name }}
					</i-option>
				</i-select>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option } from "iview";
import { CreatePortal, imgsPicker } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "content-add-class-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		'i-select': Select,
		'i-option': Option
	},

	props: {
		category_id: String,
		del: Boolean,
		material_type: Number,
		flag: Number
	},

	data() {
		return {
			visible: false,
			formData: {
				category_name: "",
				selectClass: "",
				category_year: '',
			},
			rule: {
				category_name: [
					{
						required: true,
						message: "分类名称是必填的！",
						trigger: "blur"
					}
				],
				selectClass: [
					{
						required: true,
						type: 'number',
						message: "上级分类是必选的！",
						trigger: "change"
					}
				]
			},
			parent_list: []// 素材分类
		};
	},

	async mounted() {
		let pid = "";

		if (this.del) {
			let str = this.material_type == 2 ? "_CONTENT_INFORMATION_MATERIAL_DETAIL_GET"
				: "_CONTENT_MATERIAL_DETAIL_GET";
				
			await this.$request({
				url: API_ROOT[str],
				type: 'GET',
				param: {
					material_type: this.material_type,
					category_id: this.category_id,
					is_control_role: 0
				},
			}).then((res) => {
				pid = res.data.category_id;
				
				this.formData.selectClass = res.data.pid;
				this.formData.category_name = res.data.category_name;
			}).catch((error) => {
			});
		}

		let API = this.material_type == 2 ? "_CONTENT_INFORMATION_MATERIAL_ALL_GET"
			: "_CONTENT_MATERIAL_ALL_GET";

		await this.$request({
			url: API_ROOT[API],
			type: 'GET',
			param: {
				material_type: this.material_type,
				is_control_role: 0
			},
		}).then((res) => {
			let arr = [];

			pid ? res.data.list.forEach(item => {
				if (pid != item.pid) {
					arr.push(item);
				}
			}) : res.data.list.forEach(item => {
				arr.push(item);
			});

			this.parent_list = [{ pid: 0, category_name: '顶级分类' }, ...arr];
		}).catch((error) => {
		});

		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			let API = this.material_type == 2 ? "_CONTENT_INFORMATION_CLASSIFY_CREATE_AND_EDIT_POST"
				: "_CONTENT_MATERIAL_CLASSIFY_CREATE_AND_EDIT_POST";
			this.$request({
				url: API_ROOT[API],
				type: 'POST',
				param: {
					category_id: this.category_id,
					category_name: this.formData.category_name,
					material_type: this.material_type,
					pid: this.formData.selectClass
				},
			}).then((res) => {
				this.$emit("sure");
				this.$Message.success(res.msg);
			}).then(() => {
				let str = this.material_type == 1 ? "CONTENT_MATERIAL_CLASSIFY_LIST_RESET"
					: "CONTENT_INFORMATION_CLASSIFY_LIST_RESET";
				this.$store.commit(str, { type: "" });
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};
export const AddClassModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-content-add-class {
	textarea.ivu-input {
		resize: none;
		max-width: 90%;
		min-height: 100px;
	}
}
</style>