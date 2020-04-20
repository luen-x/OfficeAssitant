<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-employee-relation-try-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			进度详情
		</div>

		<div class="g-fs-14 g-pd-20 _content">
			<i-row>
				<i-col span="12">负责部门：{{ info.responsible_depart_name }}</i-col>
				<i-col span="12">负责人：{{ info.responsible_staff_name }}</i-col>
			</i-row>

			<div class="g-m-t-20">
				<oa-steps
					:type="1"
					:data-source="info.rate_detail"
					:render-title="renderTitle"
					:render-content="renderContent"
					class="g-m-l-10 _steps"/>

				<oa-limit-words
					v-if="type == 1 || type == 2"
					v-model="event_rate_detail"
					:max="100"
					placeholder="请填写进度详情"
					width="300px"
					class="g-m-t-5" />
			</div>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, Input, Form, FormItem, Row, Col } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import { services } from '@stores/services/hr';
import Steps from '@components/_common/steps/steps';
import LimitWords from "@common/limit-words/limit-words";
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "hr-employee-relation-try-modal",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-row": Row,
		"i-col": Col,
		'oa-steps': Steps,
		'oa-limit-words': LimitWords
	},
	mixins: [orderModal],
	props: {
		event_assign_id: String | Number,
		event_id: String | Number,
		type: String | Number,

	},
	data() {
		return {
			visible: false,
			info: {},
			event_rate_detail: ''
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._ADMINISTRATION_GET_RATE_DETAIL_POST,
				type: "GET",
				param: {
					event_assign_id: this.event_assign_id,
				},
				loading: false
			}).then(res => {
				this.info = res.data;
			}).catch(err => {
			});
		},
		renderTitle(h, params = {}) {
			const { create_time, operate_name } = params.rows;
			return (
				<div>
					<span class="g-fs-14 g-c-black2 g-m-l-10">{operate_name}</span>
					<span class="g-c-black4 g-m-l-30 g-nobreak">{create_time}</span>
				</div>
			);
		},
		renderContent(h, params = {}) {
			const { event_rate_detail } = params.rows;
			return (
				<div class="g-fs-14 g-m-l-10 g-pd-t-5 g-pd-b-20" style="color: #666;">{event_rate_detail}</div>
			);
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */

			if (this.info.rate_detail_is_edit == 1) {
				if (this.type == 1 || this.type == 2) {
					if (this.event_rate_detail) {
						this.$request({
							url: API_ROOT._ADMINISTRATION_ADD_RATE_POST,
							type: "GET",
							param: {
								event_assign_id: this.event_assign_id,
								event_id: this.event_id,
								event_rate_detail: this.event_rate_detail
							},
							loading: false
						}).then(res => {
							this.$emit("sure");
							this.$Message.success("操作成功");
							this.$store.commit('ADMINISTRATION_MATTER_MY_LIST_INIT');
						}).catch(err => {
							this.$Message.warning(err.msg);
							this.$refs.modal.buttonLoading = false;
						});
					} else {
						this.$refs.modal.buttonLoading = false;
						this.$Message.warning('请填写进度详情');
					}
				} else {
					this.$emit("sure");
				}
			} else {
				this.$Message.warning('您无权添加');
				this.$refs.modal.buttonLoading = false;
			}
		},
		handleCancel() {
			this.$emit("destory");
		}
	}
};
export const detailModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-employee-relation-try-modal {
	._content {
		._steps {
			min-width: 200px;
			max-width: 600px;
			word-break: break-all;
		}
	}
}
</style>
