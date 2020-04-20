<template>
	<div>
		<i-drawer
			ref="drawer"
			:mask="false"
			:mask-closable="false"
			:styles="styles"
			v-model="visible"
			:loading="true"
			:before-close="handleBeforeClose"
			width="720"
			class="v-collage-record-online g-fs-14"
			@on-close="handleClose"
		>
			<div slot="header">
				<div class="_header">
					{{ lessonInfo.contract_company_name }}
					<span class="__num">（合同编号：{{ lessonInfo.contract_num }}）</span>
					<oa-status :type="record_list.type || 1"/>
				</div>
			</div>

			<div v-if="!isLoading">
				<oa-title style="padding: 5px 0">客户信息</oa-title>
				<div class="g-pd-l-15">
					<i-row>
						<i-col
							v-for="item of CUSTOMER_INFO "
							:key="item.key"
							span="8"
							class="g-lh-30">
							<span class="g-c-black4">{{ item.label }}</span>
							<span class="g-c-black1">
								{{ customer_info[item.key] || '--' }}
							</span>
						</i-col>
					</i-row>
				</div>

				<oa-title style="padding: 16px 0 5px 0">录单信息</oa-title>
				<div class="g-pd-l-15">
					<div class="g-lh-30">
						<span class="g-c-black4">产品名称：</span>
						<span class="g-c-black1">{{ record_list.product_name }}</span>
						<i-button
							v-if="canEndLesson"
							type="primary"
							class="g-fr g-m-l-10"
							style="margin: -11px -10px 0 0"
							@click="handleCloseCourse"
						>
							结束课程
						</i-button>
						<i-button
							v-if="canWithdrawLesson"
							type="primary"
							class="g-fr"
							style="margin-right: -11px -10px 0 0"
							@click="handleReStartCourse"
						>
							撤回结束课程
						</i-button>
					</div>
					<div class="g-c-black2 g-lh-30">
						<span v-if="isOnline">{{ record_list.lecture_set_name }}</span>
					</div>
					<!-- COMPONENT_LIST -->
					<i-check-group
						v-if="showFooter"
						v-model="recordIds"
						@on-change="handleCheckAllGroup"
					>
						<div
							v-for="record in record_list.record"
							:key="record.record_id"
						>
							<i-check-box
								:label="record.record_id"
								:disabled="+record.record_status === 3"
								class="g-flex g-jc-sb"
							>
								<component
									:is="COMPONENT_LIST[record_list.lesson_type][record.role_type]"
									:detail-data="record"
									:auth-type="record_list.auth_type"
									:type="record_list.type"
									:load-data="loadData"
									class="g-m-b-10 g-m-t-10 g-m-l-10 g-of-h"
								/>
							</i-check-box>
						</div>
					</i-check-group>
					<div
						v-for="record in record_list.record"
						v-else
						:key="record.record_id"
					>
						<component
							:is="COMPONENT_LIST[record_list.lesson_type][record.role_type]"
							:detail-data="record"
							:auth-type="record_list.auth_type"
							:type="record_list.type"
							:load-data="loadData"
							class="g-m-b-10 g-m-t-10 g-of-h"
						/>
					</div>
				</div>
				<!-- <div v-if="canPassAll" class="_footer">
					<i-button
						type="primary"
						class="g-m-l-20"
						@click="handleAllPass"
					>
						全部通过
					</i-button>
				</div> -->
				<div v-if="showFooter" class="_footer">
					<i-check-box
						v-model="checkAll"
						class="g-m-l-10"
						@click.prevent.native="handleCheckAll"
					>
						全选
					</i-check-box>
					<i-button
						type="primary"
						class="g-m-lr-10"
						@click="handleOperate(1)"
					>
						批量通过
					</i-button>
					<i-button
						type="primary"
						@click="handleOperate(2)"
					>
						批量驳回
					</i-button>
				</div>
			</div>
			<div v-if="isLoading">
				<oa-loading/>
			</div>
		</i-drawer>
	</div>
</template>
<script>
import { Button, Drawer, Input, Row, Col, CheckboxGroup, Checkbox } from "iview";
import { CreatePortal } from "wya-vc";
import Loading from '@components/_common/loading/loading';
import API_ROOT from '@stores/apis/root';
import { Confirm } from '@common/confirm/confirm';
import Title from '../../_common/title';
import Status from './record-status';
import { OnlineLeader, OnlineHelpLeader, OnlineTeacher,
	OutlineLeader, OutlineHelpLeader, OutlineTeacher,
	OutlineHost, OutlineSing, OutlineSound } from '../components';

const CUSTOMER_INFO = [
	{ label: '客户姓名：', key: 'customer_name' },
	{ label: '客户手机号：', key: 'phone' },
	{ label: '谈判人：', key: 'negotiator_staff' },
	{ label: '邀约人：', key: 'invite_staff' },
	{ label: '下单人：', key: 'order_staff' },
	{ label: '下单时间：', key: 'order_time' }
];

// lesson_type = 1 线上 2 线下
// "role_type": 1,// 1流程对接人2协助流程对接人3主持人4讲师5唱单6音控
const COMPONENT_LIST = {
	'1': {
		'1': OnlineLeader,
		'2': OnlineHelpLeader,
		'4': OnlineTeacher
	},
	'2': {
		'1': OutlineLeader,
		'2': OutlineHelpLeader,
		'3': OutlineHost,
		'4': OutlineTeacher,
		'5': OutlineSing,
		'6': OutlineSound
	}
};

export default {
	name: "oa-collage-record-online",
	components: {
		"i-button": Button,
		"i-drawer": Drawer,
		"i-input": Input,
		'oa-loading': Loading,
		'oa-title': Title,
		'oa-status': Status,
		"i-col": Col,
		"i-row": Row,
		"i-check-group": CheckboxGroup,
		"i-check-box": Checkbox
	},
	props: {
		lessonInfo: {
			required: true,
			type: Object
		}
	},
	data() {
		return {
			visible: false,
			styles: {
				height: "calc(100% - 55px)",
				overflow: "hidden",
				paddingBottom: "100px",
				position: "static"
			},
			isLoading: false,
			customer_info: {},
			record_list: {},
			recordIds: [], // 批量审核
			checkAll: false, // 是否全选
			CUSTOMER_INFO,
			COMPONENT_LIST
		};
	},
	computed: {
		isOnline() {
			// 线上为true  线下为false
			return this.record_list.lesson_type == 1;
		},
		type() {
			return this.$route.query.type || '1';
		},
		canEndLesson() {
			return this.type == 4
				&& this.record_list.auth_type < 3
				&& this.record_list.lesson_status == 0;
		},
		canWithdrawLesson() {
			return this.type == 4
				&& this.record_list.auth_type < 3
				&& this.record_list.lesson_status == 1;
		},
		canPassAll() {
			return this.type == 3
				&& this.record_list.auth_type < 3
				&& this.record_list.type == 3;
		},
		showFooter() {
			return this.record_list.type === 3 && [1, 2].indexOf(+this.record_list.auth_type) > -1;
		}
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData() {


			this.isLoading = true;
			return this.$request({
				url: API_ROOT._COLLEAGE_RECORD_LESSON_DETAIL_GET,
				type: 'GET',
				param: {
					lesson_id: this.lessonInfo.lesson_id
				},
				loading: false
			}).then(({ data: { customer_info, record_list } }) => {
				this.isLoading = false;
				record_list.record.forEach(v => {
					v.show = true;
					v.isEdit = false;
					v.lecture_set_name = record_list.lecture_set_name;
					v.lesson_type = record_list.lesson_type;
					v.auth_type = record_list.auth_type;
					v.lesson_status = record_list.lesson_status;
					v.customer_position = record_list.customer_position;
				});
				this.customer_info = customer_info;
				this.record_list = record_list;
				this.checkAll = false;
				this.recordIds = [];
			}).catch(err => {
			});
		},
		handleClose() {
			this.$emit('close');
		},
		handleCloseCourse() {
			Confirm.popup({
				msg: '提交课程结束后，将进入质检，是否确认结束？',
				title: '温馨提示'
			}).then(res => {
				return this.$request({
					url: API_ROOT._COLLEAGE_RECORD_LESSON_COMPLETE_POST,
					param: {
						lesson_id: this.record_list.lesson_id
					},
					type: "POST"
				});
			}).then(res => {
				this.loadData();
				this.$Message.success(res.msg);
			}).catch((err) => this.$Message.error(err.msg));
		},
		handleReStartCourse() {
			Confirm.popup({
				msg: '是否确认撤回结束课程的申请？',
				title: '温馨提示'
			}).then(res => {
				return this.$request({
					url: API_ROOT._COLLEAGE_RECORD_LESSON_COMPLETE_CANCEL_POST,
					param: {
						lesson_id: this.record_list.lesson_id
					},
					type: "POST"
				});
			}).then(res => {
				this.loadData();
				this.$Message.success(res.msg);
			}).catch((err) => this.$Message.error(err.msg));
		},
		handleBeforeClose() {
			if (this.$refs.drawer.$el.getElementsByTagName('form').length) {
				return Confirm.popup({
					msg: '离开后刚刚辛辛苦苦修改的数据将会丢失，你还要继续操作吗？',
					title: '温馨提示'
				}).then(res => {
				}).catch(() => {
					return new Promise(() => {});
				});
			}
		},
		handleAllPass() {
			Confirm.popup({
				msg: '是否确认全部审核通过？',
				title: '温馨提示'
			}).then(() => {
				return this.$request({
					url: API_ROOT._COLLEAGE_RECORD_LESSOM_AUDIT_ALL_POST,
					param: {
						lesson_id: this.record_list.lesson_id
					},
					type: "POST"
				});
			}).then((res) => {
				this.handleClose();
				this.$Message.success(res.msg);
			}).catch(err => this.$Message.error(err.msg));
		},
		handleCheckAll() {
			this.checkAll = !this.checkAll;

			if (this.checkAll) {
				this.recordIds = [];

				this.record_list.record.forEach(item => {
					+item.record_status != 3 && this.recordIds.push(item.record_id);
				});
			} else {
				this.recordIds = [];
			}
		},
		handleCheckAllGroup(data) {
			let checkArr = [];

			this.record_list.record.forEach(item => {
				+item.record_status != 3 && checkArr.push(item.record_id);
			});

			if (checkArr.length === data.length) {
				this.checkAll = true;
			} else {
				this.checkAll = false;
			}
		},
		// 批量操作
		handleOperate(status) {
			if (this.recordIds.length === 0) {
				this.$Message.warning("请先勾选具体数据在进行操作奥~");
				return;
			}

			this.$request({
				url: "_COLLEAGE_RECORD_LESSON_AUDIT_ALL_POST",
				param: {
					lesson_id: this.lessonInfo.lesson_id,
					status,
					record_ids: this.recordIds
				},
				type: "POST"
			}).then(res => {
				this.$Message.success(res.msg);
				this.loadData();
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-collage-record-online {
    ._header {
        font-size: 16px;
        color: #000;
        .__num {
            font-size: 13px;
        }
    }
	._footer {
		width: 100%;
		position: absolute;
		background-color: #fff;
		left: 0;
		bottom: 0;
		height: 60px;
		line-height: 60px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
    .ivu-drawer-header {
        line-height: 2.8;
    }
	.ivu-drawer-body {
		overflow: auto !important;
        padding: 20px;
	}

	.ivu-checkbox{
		line-height: 4;
	}

	.ivu-checkbox-group-item{
		display: flex !important;
		justify-content: space-between;
	}
}
</style>