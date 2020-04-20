<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-academy-transfer-transfer-detail"
		@on-close="handleCancel"
	>
		<div class="g-pd-20 g-fs-16 g-bb">
			批量心态跟踪
		</div>

		<div class="_content">
			<i-form
				ref="form"
				:model="formData"
				:label-width="90"
			>
				<div 
					v-for="(item,index) in formData.participateList"
					:key="index"
					class="g-pd-t-30 g-pd-b-30 g-m-l-30 g-bb" 
					style="width: 876px;"
				>
					<div class="g-flex g-m-b-20">
						<div class="g-tr" style="color: #666666;width: 60px;">参与人：</div>
						<div>{{ item.applicant_name }}</div>
					</div>
			
					<i-form-item
						:key="index"
						:rules="{required: true, message: '请填写心态跟踪！', trigger: 'blur'}"
						:prop="`participateList[${index}].remarks`"
						label="心态跟踪："
					>
						<oa-limit-words
							v-model="item.remarks"
							:max="200"
							placeholder="请输入文字"
							style="width: 520px;"
						/>
					</i-form-item>
				</div>
			</i-form>
		</div>

		<div class="_footer">
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 g-red-btn-small"
				style="width: 60px;height:32px;margin-right: 8px;"
				@click="handleSubmit"
			>
				提交
			</vc-debounce-click>

			<i-button
				style="margin-right: 8px"
				@click="handleCancels"
			>
				取消
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Button, Form, FormItem } from "iview";
import { CreatePortal } from "wya-vc";

export default {
	name: "academy-transfer-transfer-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-form": Form,
		"i-form-item": FormItem
	},

	props: {
		participate: {
			required: true,
			type: Array
		}
	},

	data() {
		return {
			formData: {
				participateList: []
			},
			closable: false
		};
	},
    
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		this.participate.forEach(item => {
			this.formData.participateList.push({
				remarks: "",
				applicant_id: item.applicant_id,
				applicant_name: item.applicant_name
			});
		});

		this.closable = true;
	},

	methods: {
		handleSubmit() {
			this.$refs.form.validateAndScroll(valid => {
				if (valid) {
					let list = [];

					this.formData.participateList.forEach(item => {
						list.push(
							{
								remarks: item.remarks,
								applicant_id: item.applicant_id
							}
						);
					});

					this.$request({
						url: '_ACADEMY_TRANSFER_TRANSFER_MENTALITY_TRACKING_POST',
						type: 'POST',
						loading: false,
						param: list
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit("sure", true);
					}).catch(error => {
						this.$Message.error(error.msg);
					});
				}
			});
		},

		handleCancels() {
			this.formData.participateList.forEach(item => {
				item.remarks = "";
			});

			this.handleCancel();
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-academy-transfer-transfer-detail {
    .ivu-drawer-body{
        padding: 0px;
    }

	._content{
		max-height: 800px;
		overflow-y: auto;
		padding-bottom: 50px;
	}

	._footer {
		width: 940px;
		position: fixed;
		bottom: 0;
		right: 0;
		border-top: 1px solid #e8e8e8;
		padding: 13.5px 16px;
		text-align: left;
		background: #fff;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
	}
}
</style>