<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-sc-view-mc"
		ok-text="发送消息"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			发起反馈
		</div>

		<i-form
			ref="form"
			:label-width="106"
			:model="form"
			:rules="rule"
			class="g-m-t-20"
		>
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
					placeholder="请输入反馈标题"
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
import { Modal, Form, FormItem, Input, Select, Option } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Upload from "@components/_common/upload/upload";

export default {
	name: "sc-views-originator-modal",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"oa-upload": Upload
	},

	data() {
		return {
			visible: false,
			menus: [], // 根据父级ID获取子集功能列表
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
						message: "反馈建议是必填的！",
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
	},

	methods: {
		// 根据父级ID获取子集功能列表
		loadMenusDate(pid) {
			this.$request({
				url: API_ROOT._SC_VIEWS_LIST_GET,
				type: "POST",
				param: {
					pid
				}
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

		handleSave() {
			this.$request({
				url: API_ROOT._SC_VIEWS_TECH_ADD_GET,
				type: "POST",
				param: {
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

export const OriginatorModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-view-mc{
    .ivu-modal-body{
        max-height: 390px;
        overflow-y: auto;
        overflow-x: hidden;
    }

	.ivu-btn-large{
        width: 80px;
    }
}
</style>