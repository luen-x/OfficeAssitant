<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		ok-text="发送消息"
		class="v-sc-views-reply-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			回复问题
		</div>

		<div class="_content">
			<div>
				<span class="__left">反馈人：</span>
				<span class="__right">{{ staff_name }}</span>
			</div>

			<div class="g-m-t-20">
				<span class="__left">部门：</span>
				<span class="__right">{{ depart_name }}</span>
			</div>

			<div class="g-m-t-20">
				<span class="__left">职位：</span>
				<span class="__right">{{ position_name }}</span>
			</div>

			<div class="g-m-t-20">
				<span class="__left">反馈板块：</span>
				<span class="__right">{{ title }}</span>
			</div>

			<div class="g-m-t-20">
				<span class="__left">反馈标题：</span>
				<span class="__right">{{ content }}</span>
			</div>

			<div class="g-m-t-20">
				<span class="__left">反馈时间：</span>
				<span class="__right">{{ create_time }}</span>
			</div>

			<div class="g-m-t-20 g-flex">
				<span class="__left">凭证：</span>
				<oa-upload
					v-model="credence" 
					:max="6"
					:upload="{multiple: true, max: 6}"
					disabled
					class="g-m-l-10"
					style="width: 250px"
				/>
			</div>

			<i-form
				ref="form"
				:label-width="90"
				:model="form"
				:rules="rule"
				class="g-m-t-20"
			>
				<i-form-item label="回复人：" prop="reply_staff_id">	
					<i-select
						v-model="form.reply_staff_id"
						clearable
						transfer
						filterable
						style="width:250px;"
						placeholder="请选择回复人"
						class="g-m-r-5"
					>
						<i-option
							v-for="item in staffs"
							:value="item.staff_id"
							:key="item.staff_id"
						>{{ item.staff_name }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="回复消息：" prop="reply_msg">
					<oa-limit-words
						v-model="form.reply_msg"
						:max="500"
						placeholder="请输入你的回复信息，回复信息会通知到反馈人员。"
						style="width: 250px"
					/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Upload from "@components/_common/upload/upload";
import { getItem } from '@utils/utils';

export default {
	name: "sc-views-edit-problem-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"oa-upload": Upload
	},
    
	props: {
		issue_id: Number
	},

	data() {
		return {
			visible: false,
			staffs: [], // 回复人集合
			staff_name: "", // 反馈人
			depart_name: "", // 部门
			create_time: "", // 反馈时间
			menus_id: "",
			title: "", // 反馈标题
			content: "", // 反馈内容
			credence: [], // 凭证
			reply_time: "", // 回复时间
			position_name: "", // 职位
			form: {
				reply_msg: "",
				reply_staff_id: ""
			},
			rule: {
				reply_msg: [
					{
						required: true,
						message: "回复消息是必填的！",
						trigger: "blur"
					}
				],
				reply_staff_id: [
					{
						required: true,
						message: "请选择回复人",
						trigger: "change"
					}
				]
			}
		};
	},

	mounted() {
		this.visible = true;
		this.form.reply_staff_id = "" + getItem(`staff_${this.$global.version}`).staff.staff_id;

		this.loadDate();
		this.loadStaffDate();
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
				this.title = res.data.title;
				this.content = res.data.content;
				this.create_time = res.data.create_time;
				this.credence = res.data.credence;
				this.reply_time = res.data.reply_time;
				this.position_name = res.data.position_name;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},


		// 获取回复人接口
		loadStaffDate() {
			this.$request({
				url: API_ROOT._SC_VIEWS_STAFF_GET,
				type: "GET",
				param: {
					type: 1,
					is_charge: 1
				}
			}).then(res => {
				this.staffs = res.data;

				this.staffs.forEach(item => {
					item.staff_id = "" + item.staff_id;
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleOk() {
			this.$refs.form.validateAndScroll(valid => {
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
			this.$request({
				url: API_ROOT._SC_VIEWS_APPLY_POST,
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
	}
};

export const ReplyModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-views-reply-modal{
    .ivu-modal-body{
        max-height: 390px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    ._content{
        .__left{
            display: inline-block;
            width: 80px;
            color: #818794;
            text-align: right;
        }

        .__right{
            display: inline-block;
            color: #000000;
        }
    }

    .ivu-btn-large{
        width: 80px;
    }
}
</style>