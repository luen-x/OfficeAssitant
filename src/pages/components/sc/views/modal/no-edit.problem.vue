<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-sc-views-no-edit-problem"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			问题反馈
		</div>

		<div class="_content">
			<div class="g-flex">
				<span class="__left">反馈人：</span>
				<span class="__right">{{ staff_name }}</span>
			</div>

			<div class="g-m-t-20 g-flex">
				<span class="__left">部门：</span>
				<span class="__right">{{ depart_name }}</span>
			</div>

			<div v-if="flag === 2" class="g-m-t-20 g-flex">
				<span class="__left">职位：</span>
				<span class="__right">{{ position_name }}</span>
			</div>

			<div class="g-m-t-20 g-flex">
				<span class="__left">反馈板块：</span>
				<span class="__right">{{ menu_name }}</span>
			</div>

			<div class="g-m-t-20 g-flex g-flex-aa">
				<span class="__left">反馈标题：</span>
				<span class="__right">{{ title }}</span>
			</div>

			<div class="g-m-t-20 g-flex g-flex-aa">
				<span class="__left">反馈建议：</span>
				<span class="__right">{{ content }}</span>
			</div>

			<div class="g-m-t-20 g-flex">
				<span class="__left">反馈时间：</span>
				<span class="__right">{{ create_time }}</span>
			</div>

			<div class="g-m-t-20 g-flex">
				<span class="__left">凭证：</span>
				<oa-upload
					v-model="credence" 
					:max="6"
					:disabled="true"
					:upload="{multiple: true, max: 6}"
					style="width: 260px"
				/>
			</div>

			<div v-if="type != 1" class="g-m-t-20 g-flex g-flex-aa">
				<span class="__left">回复消息：</span>
				<span class="__right">{{ reply_msg }}</span>
			</div>

			<div v-if="type != 1" class="g-m-t-20 g-flex">
				<span class="__left">回复人：</span>
				<span class="__right">{{ reply_staff_name }}</span>
			</div>

			<div v-if="type != 1" class="g-m-t-20 g-flex">
				<span class="__left">回复时间：</span>
				<span class="__right">{{ reply_time }}</span>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Upload from "@components/_common/upload/upload";

export default {
	name: "sc-views-edit-problem-modal",

	components: {
		"i-modal": Modal,
		"oa-upload": Upload
	},
    
	props: {
		issue_id: Number,
		flag: Number,
		type: Number
	},

	data() {
		return {
			visible: false,
			staff_name: "", // 反馈人
			depart_name: "", // 部门
			create_time: "", // 反馈时间
			menu_name: "", // 板块
			title: "", // 反馈标题
			content: "", // 反馈内容
			credence: [], // 凭证
			reply_time: "", // 回复时间
			position_name: "", // 职位
			reply_msg: "", // 回复消息
			reply_staff_name: "" // 回复人
		};
	},

	mounted() {
		this.visible = true;
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
				this.title = res.data.title;
				this.content = res.data.content;
				this.create_time = res.data.create_time;
				this.credence = res.data.credence;
				this.reply_time = res.data.reply_time;
				this.position_name = res.data.position_name;
				this.menu_name = res.data.menu_name;
				this.reply_staff_name = res.data.reply_staff_name;
				this.reply_msg = res.data.reply_msg;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleOk() {
			this.visible = false;
		},
        
		handleCancel() {
			this.$emit("close");
		}
	}
};

export const NoEditProblemModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-views-no-edit-problem{
    .ivu-modal-body{
        max-height: 390px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    ._content{
        .__left{
            display: inline-block;
            width: 100px;
            color: #818794;
            text-align: right;
        }

        .__right{
            display: inline-block;
            color: #000000;
			width: 240px;
			word-wrap:break-word;
        }
    }
}
</style>