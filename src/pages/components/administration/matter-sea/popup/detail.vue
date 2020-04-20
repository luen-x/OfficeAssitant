<template>
	<div>
		<i-drawer
			ref="modal"
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-administration-matter-sea-detail"
			@on-close="$emit('close')"
		>
			<div v-if="spin" slot="header" class="_detail-header">事项详情</div>
			<div v-if="spin" style="padding: 0 28px 60px">
				<div class="_detail-info">
					<oa-title>
						<template slot="title">
							事项信息
							<span
								v-if="type == 2 && data.list_is_edit == 1"
								class="g-pointer g-c-blue-mid g-m-l-5">
								<span v-if="editing" @click="loadData">取消</span>
								<span v-if="editing" @click="handleSave">保存</span>
								<span v-if="!editing" @click="editing = true">编辑</span>
							</span>
						</template>
					</oa-title>
					<oa-info ref="infoForm" :edit="editing" :info="data" :type="type"/>
				</div>
				<div v-if="data.assign && data.assign.length" class="_detail-progress" style="marginTop: 46px;">
					<oa-title>
						<template slot="title">事项进度</template>
					</oa-title>
					<oa-progress :info="data" :type="type"/>
				</div>
				<div v-if="type == 4 || data.service_score || data.evaluate" class="_detail-comment" style="marginTop: 46px;">
					<oa-title>
						<template slot="title">事项评价</template>
					</oa-title>
					<div class="g-pd-t-20">
						<div>
							<span class="g-m-r-10">服务评价</span>
							<i-rate :value="data.service_score" allow-half disabled style="marginBottom: 8px;"/>
						</div>
						<div>
							反馈建议
							<span class="g-m-l-10">{{ data.evaluate }}</span>
						</div>
					</div>
				</div>
				<div v-if="type == 5" class="_detail-reason" style="marginTop: 46px;">
					<oa-title>
						<template slot="title">驳回理由</template>
					</oa-title>
					<div class="g-pd-t-20">
						驳回理由
						<span class="g-m-l-10">{{ data.refuse_reason }}</span>
					</div>
				</div>
				<div
					v-if="type != 3 && type != 4 && type != 5"
					class="_detail-footer g-flex g-flex-ac"
					style="marginTop: 46px;">
					<i-button
						v-if="type === 'basic'"
						class="g-m-r-10"
						@click="handleBasicAction(data, 'reject')">
						驳回申请
					</i-button>
					<i-button
						v-if="type === 'basic'"
						type="primary"
						@click="handleBasicAction(data, 'receive')">
						领取事项
					</i-button>
					<i-button
						v-if="type == '1'"
						class="g-m-r-10"
						type="primary"
						@click="handleMyAction(data, 'pass')">
						通过申请
					</i-button>
					<i-button
						v-if="type == '1'"
						@click="handleMyAction(data, 'reject')">
						驳回申请
					</i-button>
					<i-button
						v-if="type == '2' && data.list_is_edit == 1"
						class="g-m-r-10"
						type="primary"
						@click="handleMyAction(data, 'complete')">
						事项完成
					</i-button>
					<i-button
						v-if="type == '2' && data.list_is_edit == 1"
						@click="handleMyAction(data, 'assign')">
						事项指派
					</i-button>
				</div>
			</div>
			<oa-loading v-else />
		</i-drawer>
	</div>
</template>

<script>
import { Drawer, Row, Col, Button, Form, Input, DatePicker, Rate } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import orderModal from '@extends/mixins/orderModal';
import Title from '../_common/title';
import Info from './info';
import Progress from './progress';
import { PModal } from './modal.vue';
import { myModal } from '../../matter-my/popup/modal';

export default {
	name: 'administration-matter-sea-detail-drawer',
	components: {
		'i-drawer': Drawer,
		'i-button': Button,
		'vc-imgs-preview': ImgsPreview,
		'oa-title': Title,
		'oa-info': Info,
		'oa-progress': Progress,
		'i-row': Row,
		'i-col': Col,
		'i-rate': Rate
	},
	mixins: [orderModal],
	props: {
		info: Object,
		type: String | Number
	},
	data() {
		return {
			closable: false,
			spin: true,
			data: {},
			editing: false
		};
	},
	mounted() {
		this.closable = true;
		(this.type === 'basic' || this.type == 1) ? this.editing = true : this.editing = false;
		this.loadData();
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
		handleSave() {
			let formInfo = this.$refs['infoForm'].formValidate;
			this.$refs['infoForm'].$refs['form'].validate(valid => {
				if (valid) {
					// 可以编辑同时进度百分百
					if (this.data.list_is_edit == 1 && formInfo.completion_rate == 100) {
						myModal.popup({
							info: formInfo,
							type: 'complete',
							requestFn: (res) => this.handleCompleteEvent({
								...res,
								data: {
									...res.data,
									priority: formInfo.priority,
									head_staff_id: formInfo.head_staff_id,
									completion_rate: formInfo.completion_rate,
									participant_id: formInfo.participant_infos.map(item => item.staff_id).join(',')
								},
							})
						}).then(res => {});
					} else {
						this.$request({
							url: API_ROOT._ADMINISTRATION_EVENT_EDIT_POST,
							type: 'POST',
							param: {
								event_id: formInfo.event_id,
								priority: formInfo.priority,
								head_staff_id: formInfo.head_staff_id,
								completion_rate: formInfo.completion_rate,
								participant_id: formInfo.participant_infos.map(item => item.staff_id).join(',')
							},
							loading: false
						}).then(res => {
							this.$Message.success('保存成功');
							this.editing = !this.editing;
							this.loadData();
							this.$store.commit('ADMINISTRATION_MATTER_MY_LIST_INIT');
						}).catch(err => {
							this.$Message.error(err.msg);
						});
					}
				} else {
					this.$Message.error('请按照提示完善表单信息！');
				}
			});
		},
		loadData() {
			this.spin = false;
			this.$request({
				url: API_ROOT._ADMINISTRATION_EVENT_DETAIL_GET,
				type: 'GET',
				param: {
					event_id: this.info.event_id
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				this.spin = true;
				if (this.type == 2) {
					this.editing = false;
				}
			}).catch(err => {
				this.spin = true;
			});
		},
		// 完成事件
		async handleCompleteEvent(param) {
			// 完成事件
			await this.$request({
				url: '_ADMINISTRATION_COMPLETE_EVENT_POST',
				type: "POST",
				param: { ...param.data },
				loading: false
			}).then(response => {
				param.cb && param.cb();
				this.$store.commit('ADMINISTRATION_MATTER_MY_LIST_INIT');
				this.$Message.success('事项完成，赞一个');
				this.$emit('destory');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleBasicAction(info, name) {
			if (name === 'receive') {
				let formInfo = this.$refs['infoForm'].formValidate;
				this.$refs['infoForm'].$refs['form'].validate(valid => {
					if (valid) {
						PModal.popup({
							data: {
								...formInfo,
								participant_id: formInfo.participant_infos.map(item => item.staff_id).join(','),
							},
							type: name,
							requestFn: (res) => {
								res.cb();
								this.$emit('destory');
							}
						}).then(res => {
						}).catch(err => {});
					} else {
						this.$Message.error('请按照提示完善表单信息！');
					}
				});
			} else {
				PModal.popup({
					data: { ...info },
					type: name,
					requestFn: (res) => {
						res.cb();
						this.$emit('destory');
					}
				}).then(res => {
				}).catch(err => {});
			}
		},
		handleMyAction(info, name) {
			if (name === 'pass') {
				let formInfo = this.$refs['infoForm'].formValidate;
				this.$refs['infoForm'].$refs['form'].validate(valid => {
					if (valid) {
						myModal.popup({
							info: {
								...formInfo,
								participant_id: formInfo.participant_infos.map(item => item.staff_id).join(','),
							},
							type: name,
							requestFn: (res) => {
								res.cb();
								this.$emit('destory');
							}
						}).then(res => {
						}).catch(err => {});
					} else {
						this.$Message.error('请按照提示完善表单信息！');
					}
				});
			} else if (name === 'complete') {
				myModal.popup({
					info,
					type: name,
					requestFn: (res) => this.handleCompleteEvent({
						...res,
						data: {
							...res.data,
							event_id: info.event_id,
							priority: info.priority,
							head_staff_id: info.head_staff_id,
							completion_rate: info.completion_rate,
							participant_id: info.participant_infos.map(item => item.staff_id).join(',')
						}
					})
				}).then(res => {});
			} else {
				myModal.popup({
					info,
					type: name,
					requestFn: (res) => {
						res.cb();
						this.$emit('destory');
					}
				}).then(res => {
				}).catch(err => {});
			}
		}
	}
};
export const DetailDrawer = CreatePortal({ store: app.$store, alive: true }, module.exports.default);
</script>

<style lang="scss">
.v-administration-matter-sea-detail {
	._detail-header {
		color: #000;
		font-size: 16px;
		height: 31px;
		line-height: 31px;
	}
	._detail-info {
		margin-top: 14px;
	}
	._detail-footer {
		width: 940px;
		height: 61px;
		position: fixed;
		bottom: 0;
		right: 0;
		border-top: 1px solid #e8e8e8;
		padding: 10px 16px;
		text-align: left;
		background: #fff;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
	}
}
</style>
