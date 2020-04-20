<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-sc-reply-change-modal"
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
			<i-form-item label="变更到：" prop="type">	
				<i-select
					v-model="form.type"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择变更状态"
					class="g-m-r-5"
				>
					<i-option
						v-for="item in change_types"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item 
				v-if="form.type === '3' || form.type === '4'"
				label="开始解决时间：" 
				prop="start_solve_time"
			>
				<i-datepicker 
					v-model="form.start_solve_time"
					transfer
					placeholder="请选择开始解决时间" 
					type="datetime" 
					style="width:220px;"
					format="yyyy-MM-dd HH:mm:ss"
				/>
			</i-form-item>

			<i-form-item 
				v-if="form.type === '4'"
				label="解决时间：" 
				prop="stop_solve_time"
			>
				<i-datepicker 
					v-model="form.stop_solve_time"
					transfer
					placeholder="请选择解决时间" 
					type="datetime" 
					style="width:220px;"
					format="yyyy-MM-dd HH:mm:ss"
				/>
			</i-form-item>

			<i-form-item 
				v-if="form.type === '5'"
				label="忽略原因：" 
				prop="ignore_msg"
			>
				<oa-limit-words
					v-model="form.ignore_msg"
					:max="500"
					placeholder="请输入忽略原因"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, DatePicker } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import moment from "moment";

export default {
	name: "sc-views-originator-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"i-datepicker": DatePicker
	},

	props: {
		issue_id: Number,
		start_solve_time: String,
		stop_solve_time: String,
		type: Number
	},

	data() {
		return {
			visible: false,
			change_types: [{
				label: "解决中",
				value: "3"
			}, {
				label: "已解决",
				value: "4"
			}, {
				label: "已忽略",
				value: "5"
			}],
			form: {
				type: "",
				start_solve_time: "",
				stop_solve_time: "",
				ignore_msg: ""
			},
			rule: {
				type: [
					{
						required: true, 
						message: "请选择变更状态", 
						trigger: "change"
					}
				],
				ignore_msg: [
					{
						required: true,
						message: "忽略原因是必填的！",
						trigger: "blur"
					}
				], 
				start_solve_time: [
					{
						required: true,
						type: "date",
						message: "请选择开始解决时间",
						trigger: "change"
					}
				],
				stop_solve_time: [
					{
						required: true,
						type: "date",
						message: "请选择解决时间",
						trigger: "change"
					} 
				]
			}
		};
	},
    
	watch: {
		"form.type": {
			deep: true,
			handler(value) {
				if (value === "5") {
					this.form.start_solve_time = "";
					this.form.stop_solve_time = "";
				} else if (value === "4") {
					this.form.ignore_msg = "";
				} else {
					this.form.stop_solve_time = "";
					this.form.ignore_msg = "";
				}
			}
		}
	},

	mounted() {
		this.handleGetChangeType();
		this.form.start_solve_time = this.start_solve_time.length > 2 ? this.start_solve_time : "";
		this.form.stop_solve_time = this.stop_solve_time.length > 2 ? this.stop_solve_time : "";
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			this.form.start_solve_time = this.form.start_solve_time
			    && moment(this.form.start_solve_time).format("YYYY-MM-DD HH:mm:ss");
			this.form.stop_solve_time = this.form.stop_solve_time
			    && moment(this.form.stop_solve_time).format("YYYY-MM-DD HH:mm:ss");

			this.$request({
				url: API_ROOT._SC_VIEWS_CHANGE_POST,
				type: "POST",
				param: {
					issue_id: this.issue_id,
					...this.form
				}
			}).then(res => {
				this.$Message.success(res.msg);
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
		},

		handleGetChangeType() {
			switch (this.type) {
				case 2:
					this.change_types = [{
						label: "解决中",
						value: "3"
					}, {
						label: "已解决",
						value: "4"
					}, {
						label: "已忽略",
						value: "5"
					}];

					break;

				case 3:
					this.change_types = [{
						label: "已解决",
						value: "4"
					}, {
						label: "已忽略",
						value: "5"
					}];

					break;
			
				case 4:
					this.change_types = [{
						label: "解决中",
						value: "3"
					}, {
						label: "已忽略",
						value: "5"
					}];
					
					break;
				
				case 5:
					this.change_types = [{
						label: "解决中",
						value: "3"
					}, {
						label: "已解决",
						value: "4"
					}];
					
					break;

				default:
					break;
			}
		}
	}
};

export const ChangeModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-reply-change-modal{
    .ivu-modal-body{
        max-height: 390px;
        overflow-y: auto;
        overflow-x: hidden;
    }
}
</style>