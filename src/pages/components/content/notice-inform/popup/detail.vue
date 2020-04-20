<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="查看通知详情"
		width="680px"
		class="v-notice-inform-detail"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-tc g-m-tb-30 g-fs-14">
			<i-row style="line-height: 30px">
				<i-col span="3" class="g-tr">通知类型：</i-col>
				<i-col span="3" class="g-tl g-pd-l-10 g-c-black1">{{ data.notice_type_name }}</i-col>
				<i-col span="4" class="g-tr">等待时间：</i-col>
				<i-col span="2" class="g-tl g-pd-l-10 g-c-black1">{{ data.wait_time }}秒</i-col>
			</i-row>
			<i-row style="line-height: 30px">
				<i-col span="3" class="g-tr">标题：</i-col>
				<i-col span="19" class="g-tl g-pd-l-10 g-c-black1">{{ data.title }}</i-col>
			</i-row>
			<i-row style="line-height: 30px">
				<i-col span="3" class="g-tr">内容：</i-col>
				<i-col span="19" class="g-tl g-pd-l-10 g-c-black1">{{ data.content }}</i-col>
			</i-row>
			<i-row style="line-height: 30px">
				<i-col span="3" class="g-tr">发送时间：</i-col>
				<i-col span="3" class="g-tl g-pd-l-10 g-c-black1">{{ data.send_type_name }}</i-col>
				<span v-if="data.send_type == 1">
					<i-col span="3" class="g-tr">开始时间：</i-col>
					<i-col span="5" class="g-tl g-pd-l-10 g-c-black1">{{ detailData.start_time }}</i-col>
					<i-col span="3" class="g-tr">结束时间：</i-col>
					<i-col span="6" class="g-tl g-pd-l-10 g-c-black1">{{ detailData.end_time }}</i-col>
				</span>
			</i-row>
			<i-row class="g-c-black1 g-fs-16 g-tr" style="line-height: 60px">
				<i-col span="3">接收权限</i-col>
			</i-row>
			<i-row style="line-height: 30px">
				<i-col span="3" class="g-tr">角色：</i-col>
				<i-col span="19" class="g-tl g-pd-l-10 g-c-black1">
					<span v-for="(role, i) in data.notice_role.split('/')" :key="i" class="_role">{{ role }}</span>
				</i-col>
			</i-row>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Col, Row } from 'iview';
import { CreatePortal } from 'wya-vc';
import ROOT_API from '@stores/apis/root';

export default {
	name: "vc-notice-add",
	components: {
		'i-modal': Modal,
		'i-col': Col,
		'i-row': Row
	},
	props: {
		// 传递过来的列表详情（没有时间）
		data: Object
	},
	data() {
		return {
			visible: false,
			detailData: '', // 后台读取详情
		};
	},
	computed: {
		
	},
	created() {
		this.$request({
			url: ROOT_API._CONTENT_NOTICE_INFORM_DETAIL_GET,
			type: 'GET',
			param: {
				notice_id: this.data.notice_id
			}
		}).then(res => {
			this.detailData = res.data;
		});
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const PModalDetail = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-notice-inform-detail {
	._role {
		display: inline-block;
		padding-right: 10px;
	}
}
</style>