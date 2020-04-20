<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-sc-views-edit-problem"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			问题反馈
		</div>

		<i-form
			ref="form"
			:label-width="106"
			:model="form"
			:rules="rule"
			class="g-m-t-20"
		>
			<i-form-item label="反馈人：" prop="staff_name">	
				<i-input
					v-model="staff_name"
					:maxlength="30"
					disabled
					style="width: 220px"
				/>
			</i-form-item>

			<i-form-item label="部门：" prop="depart_name">	
				<i-input
					v-model="depart_name"
					:maxlength="30"
					disabled
					style="width: 220px"
				/>
			</i-form-item>

			<i-form-item label="反馈板块：" prop="menus_id">	
				<i-select
					v-model="form.menus_id"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择板块"
					class="g-m-r-5"
				>
					<i-option
						v-for="item in menus"
						:value="item.menus_id"
						:key="item.menus_id"
					>
						{{ item.name }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item label="反馈标题：" prop="title">	
				<i-input
					v-model="form.title"
					:maxlength="30"
					clearable
					transfer
					style="width: 220px"
				/>
			</i-form-item>

			<i-form-item label="反馈建议：" prop="content">
				<oa-limit-words
					v-model="form.content"
					:max="500"
					placeholder="请告诉我们您在OA系统使用过程的遇到的问题，或是你希望改善的功能。我们在收到意见后会第一时间反馈"
					style="width: 220px"
				/>
			</i-form-item>

			<i-form-item label="反馈时间：" prop="create_time">	
				<i-datepicker
					v-model="create_time"
					disabled
					transfer
					type="datetime"
					format="yyyy-MM-dd HH:mm:ss"
					style="width: 220px"
				/>
			</i-form-item>

			<i-form-item label="上传凭证：" prop="credence">	
				<oa-upload
					v-model="form.credence" 
					:max="6"
					:upload="{multiple: true, max: 6}"
					style="width: 300px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, DatePicker } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Upload from "@components/_common/upload/upload";

export default {
	name: "sc-views-edit-problem-modal",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"i-datepicker": DatePicker,
		"oa-upload": Upload
	},
    
	props: {
		issue_id: Number
	},

	data() {
		return {
			visible: false,
			menus: [], // 根据父级ID获取子集功能列表
			staff_name: "", // 反馈人
			depart_name: "", // 部门
			create_time: "", // 反馈时间
			form: {
				menus_id: "",
				title: "",
				content: "",
				credence: []
			},
			rule: {
				menus_id: [
					{
						required: true, 
						message: "请选择模块", 
						trigger: "change"
					}
				],
				title: [
					{
						required: true,
						message: "反馈标题是必填的！",
						trigger: "blur"
					}
				],
				content: [
					{
						required: true,
						message: "修改原因是必填的！",
						trigger: "blur"
					}
				],
				credence: [
					{
						required: true, 
						type: "array", 
						message: '请上传凭证', 
						trigger: "change"
					}
				]
			}
		};
	},

	mounted() {
		this.visible = true;
		this.loadMenusDate();
		this.loadDate();
	},

	methods: {
		// 获取详情数据
		loadDate() {
			this.$request({
				url: API_ROOT._SC_VIEWS_ISSUE_DETAIL_GET,
				type: "POST",
				param: {
					issue_id: this.issue_id
				}
			}).then(res => {
				this.staff_name = res.data.staff_name;
				this.depart_name = res.data.depart_name;
				this.form.menus_id = "" + res.data.menus_id;
				this.form.title = res.data.title;
				this.form.content = res.data.content;
				this.create_time = res.data.create_time;
				this.form.credence = res.data.credence;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
        
		// 根据父级ID获取子集功能列表
		loadMenusDate() {
			this.$request({
				url: API_ROOT._SC_VIEWS_LIST_GET,
				type: "POST",
				param: {}
			}).then(res => {
				this.menus = res.data;
                
				this.menus.forEach(item => {
					item.menus_id = "" + item.menus_id;
				});
			}).catch(error => {
				this.$Message.error(error.msg);
				this.visible = true;

				this.$refs.modal.buttonLoading = false;
			});
		},

		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		async handleSave() {
			this.$request({
				url: API_ROOT._SC_VIEWS_TECH_ADD_GET,
				type: "POST",
				param: {
					issue_id: this.issue_id,
					...this.form,
					credence: this.form.credence
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.visible = true;

				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};

export const EditProblemModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-views-edit-problem{
    .ivu-modal-body{
        max-height: 390px;
        overflow-y: auto;
         overflow-x: hidden;
    }
}
</style>