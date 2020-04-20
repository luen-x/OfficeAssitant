<template>
	<div class="v-collage-service-record">
		<oa-loading v-if="loading"/>
		<div class="g-m-l-20 g-m-r-30 g-m-t-30">
			<div class="g-m-b-30 g-fs-14">
				<span class="_title-bar"/>
				<span class="g-c-black4 g-pd-l-5">产品名称：</span>
				<span class="g-c-black2">{{ productName }}</span>
			</div>
		</div>
		<div 
			v-for="(item, index) in list" 
			:key="index"
			class="g-m-t-20 g-m-l-20"
		>
			<div class="g-m-r-30 g-flex g-jc-sb g-ai-c">
				<div 
					class="g-fs-14 g-c-black g-m-b-20 g-pointer"
					@click="handleToggle(`lesson_${item.lesson_id}`)"
				>
					<span class="_title-bar"/>
					<span class="g-pd-l-5">{{ item.lecture_set_name }}</span>
					<i
						:class="item.visible ? 'icon-triangle-down' : 'icon-triangle-up'"
						class="iconfont g-fs-10"
					/>
				</div>
				<div>
					<i-button 
						v-if="$auth[1307] && item.auth_type !== 3 && !item.lesson_status && item.record_status === 2"
						ghost 
						class="g-m-l-5 g-m-b-10 _btn"
						@click="handlePassAll(item.lesson_id)"
					>
						全部通过
					</i-button>
					<i-button 
						v-if="$auth[1308] && item.auth_type !== 3 && !item.lesson_status && item.record_status === 3"
						type="primary" 
						class="g-m-l-5 g-m-b-10" 
						style="height: 32px;"
						@click="handleEndCourse(item.lesson_id)"
					>
						结束课程
					</i-button>
					<i-button 
						v-if="$auth[1309] && item.auth_type !== 3 && item.lesson_status"
						type="primary" 
						class="g-m-l-5 g-m-b-10" 
						style="height: 32px;"
						@click="handleResetEndCourse(item.lesson_id)"
					>
						撤回结束课程
					</i-button>
				</div>
			</div>

			<vc-expand :ref="`lesson_${item.lesson_id}`" v-model="item.visible">
				<div 
					v-for="(_item, _index) in item.record"
					:key="_index"
					class="g-m-l-15 g-m-r-30 g-m-b-20 g-relative" 
					style="background: #fafafa;"
				>
					<div
						class="g-pd-l-20 g-flex g-jc-sb g-pointer"
						style="height: 50px;line-height: 50px;border-bottom: 1px solid #eaeef1;"
						@click="handleToggle(`record_${_item.record_id}`)"
					>
						<div class="g-absolute _position"/>
						<div>
							<i
								:class="_item.visible ? 'icon-triangle-down' : 'icon-triangle-up'"
								class="iconfont g-fs-10"
							/>
							<span class="g-c-black3 g-fs-14">{{ _item.staff_name }}</span>
							<span class="g-c-black3 g-fs-14">（{{ _item.role_name }}）</span>
						</div>
						<div class="g-fs-14">
							<span v-if="_item.record_status === 2" class="g-c-black-4 g-m-r-20">已添加</span>
							<span v-else-if="_item.record_status === 3" class="g-c-green-mid g-m-r-20">已通过</span>
							<span v-else-if="_item.record_status === 4" class="g-c-orange-mid g-m-r-20">待审核</span>
							<span v-else-if="_item.record_status === 5" class="g-m-r-20" style="color: #E84C57;">被驳回</span>
							<span v-else-if="_item.record_status === 6" class="g-c-black-4 g-m-r-20">驳回后提交</span>
							<i-button 
								v-if="_item.record_status === 1 && $auth[1304] && !item.lesson_status 
								&& (item.auth_type !== 3 || _item.is_edit)"
								ghost 
								class="g-m-r-20 _btn"
								@click="handleAdd($event, item, _item)"
							>
								添加记录
							</i-button>
							<span v-else>
								<span 
									v-if="$auth[1305] && !item.lesson_status && _item.is_edit"
									class="g-c-blue-mid g-m-r-20 g-pointer"
									@click="handleEdit($event, item, _item)"
								>
									编辑
								</span>
								<i-button 
									v-if="item.record_status === 2 && (_item.record_status === 4 || _item.record_status === 6) 
									&& $auth[1306] && item.auth_type !== 3"
									ghost 
									class="g-m-r-20 _btn"
									@click="handleAudit($event, item, _item)"
								>
									审核
								</i-button>
							</span>
						</div>
					</div>
					<vc-expand :ref="`record_${_item.record_id}`" v-model="_item.visible">
						<div v-if="_item.record_status !== 1" class="g-m-t-10 g-m-l-15 g-lh-30">
							<div v-if="_item.role_type === 1" class="g-c-black3 g-fs-12">
								<span class="g-inline-block _label">客户职位：</span>
								<span>
									{{ ['老板', '操盘手', '商学院院长', '董事长', '团队长', '市场总监', '创始人', '助理'][+_item.field.position - 1] || '--' }}
								</span>
							</div>
							<div v-if="_item.record_status === 5" class="g-c-black3 g-fs-12 g-flex">
								<span class="g-inline-block _label">驳回理由：</span>
								<div 
									style="width: calc(100% - 85px)" 
									class="g-pd-r-20"
								>
									{{ _item.audit_remark || '--' }}
								</div>
							</div>
							<div v-if="_item.role_type === 2" class="g-c-black3 g-fs-12">
								<span class="g-inline-block _label">入职时间：</span>
								<span>{{ _item.entry_date || '--' }}</span>
							</div>
							<div 
								v-if="lessonType === 2" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">课程类型：</span>
								<span>{{ item.lecture_set_name || '--' }}</span>
							</div>
							<div 
								v-if="_item.role_type === 4" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">课程主题：</span>
								<span 
									v-if="_item.field.subject_num"
									class="g-c-blue-mid g-pointer"
									@click="handleTopic(_item)"
								>
									共{{ _item.field.subject_num }}个主题
								</span>
								<span v-else>--</span>
							</div>
							<div 
								v-if="lessonType === 2 && _item.role_type === 4" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">讲课总时长：</span>
								<span>{{ _item.field.total_duration + '分钟' || '--' }}</span>
							</div>
							<div 
								v-if="lessonType === 2 && _item.role_type === 3" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">主持时间：</span>
								<span 
									v-for="(date, d) in formatDate(JSON.parse(_item.field.hosting_time))" 
									:key="d"
									class="g-m-r-10"
								>
									{{ date.join(' - ') || '--' }}
								</span>
							</div>
							<div 
								v-if="lessonType === 2 && _item.role_type === 3" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">主持天数：</span>
								<span>{{ _item.field.hosting_day + '天' || '--' }}</span>
							</div>
							<div 
								v-if="lessonType === 2 && _item.role_type === 3" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">主持人数：</span>
								<span>{{ _item.staff_num + '人' || '--' }}</span>
							</div>
							<div 
								v-if="lessonType === 2 && _item.role_type === 5" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">唱单时间：</span>
								<span 
									v-for="(date, d) in formatDate(JSON.parse(_item.field.singing_time))" 
									:key="d"
									class="g-m-r-10"
								>
									{{ date.join(' - ') || '--' }}
								</span>
							</div>
							<div 
								v-if="lessonType === 2 && _item.role_type === 6" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">音控时间：</span>
								<span 
									v-for="(date, d) in formatDate(JSON.parse(_item.field.voice_time))" 
									:key="d"
									class="g-m-r-10"
								>
									{{ date.join(' - ') || '--' }}
								</span>
							</div>
							<div 
								v-if="_item.role_type === 2" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">累计学习数：</span>
								<span class="g-c-red-mid">{{ _item.learning_times + '次' || '--' }}</span>
							</div>
							<div 
								v-if="_item.role_type === 2" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">本次是否计数：</span>
								<span>{{ ['否', '是'][+_item.field.is_count] || '--' }}</span>
							</div>
							<div 
								v-if="_item.role_type === 2" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">师傅：</span>
								<span>{{ _item.master_name || '--' }}</span>
							</div>
							<div 
								v-if="[1, 2].includes(_item.role_type)" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">对接时间：</span>
								<span>{{ formatDate(JSON.parse(_item.field.docking_time)).join(' - ') || '--' }}</span>
							</div>
							<div 
								v-if="lessonType === 2" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">是否出差：</span>
								<span>{{ ['否', '是'][+_item.field.is_business] || '--' }}</span>
							</div>
							<div 
								v-if="lessonType === 2 && +_item.field.is_business" 
								class="g-c-black3 g-fs-12"
							>
								<span class="g-inline-block _label">出差天数：</span>
								<span v-if="_item.field.business_day">{{ _item.field.business_day + '天' || '--' }}</span>
								<span v-else>--</span>
							</div>
							<div class="g-c-black3 g-fs-12 g-flex">
								<span class="g-inline-block _label">备注：</span>
								<div 
									style="width: calc(100% - 85px)" 
									class="g-pd-r-20"
								>
									{{ _item.remark || '--' }}
								</div>
							</div>
							<div class="g-c-black3 g-fs-12">
								<span class="g-inline-block _label">记录时间：</span>
								<span>{{ _item.update_time || '--' }}</span>
							</div>
						</div>
					</vc-expand>
				</div>
			</vc-expand>
		</div>
	</div>
</template>

<script>
import { Button } from "iview";
import { Expand } from "wya-vc";
import moment from 'moment';
import { Confirm } from "@components/_common/confirm/confirm";
import Loading from '@components/_common/loading/loading';
import { ServiceRecordEdit } from './popup/edit';
import { ServiceRecordAudit } from './popup/audit';
import { ServiceRecordTopic } from './popup/topic';

export default {
	name: 'oa-collage-service-record',
	components: {
		"i-button": Button,
		"vc-expand": Expand,
		'oa-loading': Loading
	},
	props: {
		type: [String, Number],
		projectId: [String, Number]
	},
	data() {
		return {
			loading: false,
			productName: '',
			lessonType: '',
			authType: '',
			customerPosition: '',
			list: []
		};
	},
	mounted() {
		this.loadData();
		this.$vc.on('COLLAGE_RELOAD_SERVICE_RECORD', () => {
			this.loadData();
		});
	},
	beforeDestroy() {
		this.$vc.off('COLLAGE_RELOAD_SERVICE_RECORD');
	},
	methods: {
		loadData() {
			this.loading = true;
			this.list = [];
			this.productName = '';
			this.lessonType = '';
			this.authType = '';
			this.$request({
				url: '_COLLAGE_BUSINESS_RECORD_INFO_GET',
				type: 'GET',
				loading: false,
				param: {
					project_id: this.projectId
				},
				autoTip: false
			}).then(res => {
				this.productName = res.data.product_name;
				this.lessonType = res.data.lesson_type;
				this.authType = res.data.auth_type;
				this.customerPosition = res.data.customer_position;
				if (res.data.lesson.length) {
					this.list = res.data.lesson.map(it => { 
						if (it.record.length) {
							it.record = it.record.map(_it => ({ ..._it, visible: true }));
						}
						return { ...it, visible: true };
					});
				}
			}).catch(error => {
				this.$Message.error(error.msg); 
			}).finally(() => {
				this.loading = false;
			});
		},
		handleToggle(value) {
			this.$refs[value][0].toggle();
		},
		formatDate(list) {
			let dateList = JSON.parse(JSON.stringify(list));
			dateList.forEach(date => {
				if (typeof date === 'object') {
					date = [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')];
				} else {
					date = moment(date).format('YYYY-MM-DD');
				}
			});
			return dateList;
		},
		handleAdd(e, item, _item) {
			e.stopPropagation();
			ServiceRecordEdit.popup({
				title: '添加记录',
				data: _item,
				productName: this.productName,
				lessonType: this.lessonType,
				lectureSetName: item.lecture_set_name,
				customerPosition: this.customerPosition
			}).then((res) => {
				if (this.lessonType == 2 && _item.role_type == 4 && res.toast_flag) {
					Confirm.popup({
						title: "提示",
						cancelText: '知道了',
						okText: '这就去',
						msg: res.msg,
						showIcon: true
					}).then(() => {
						this.loadData();
						this.$emit('reload', 'deliveryTable');
						this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
					}).catch(error => {
						error && console.error(error);
						this.loadData();
						this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
					});
				} else {
					this.loadData();
					this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
				}
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleEdit(e, item, _item) {
			e.stopPropagation();
			ServiceRecordEdit.popup({
				title: '编辑记录',
				data: _item,
				productName: this.productName,
				lessonType: this.lessonType,
				lectureSetName: item.lecture_set_name,
				customerPosition: this.customerPosition
			}).then(() => {
				this.loadData();
				this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleAudit(e, item, _item) {
			e.stopPropagation();
			ServiceRecordAudit.popup({
				data: _item,
				productName: this.productName,
				lessonType: this.lessonType,
				lectureSetName: item.lecture_set_name,
				customerPosition: this.customerPosition
			}).then(() => {
				this.loadData();
				this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleTopic(item) {
			ServiceRecordTopic.popup({
				subject: item.subject,
				lessonType: this.lessonType
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleEndCourse(lesson_id) {
			Confirm.popup({
				title: "提示",
				msg: "提交课程结束后，将进入质检，是否确认结束？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_COLLAGE_BUSINESS_RECORD_COMPLETE_POST',
					type: 'POST',
					loading: false,
					param: {
						lesson_id
					},
					autoTip: true
				}).then(res => {
					this.loadData();
					this.$vc.emit('COLLAGE_RELOAD_SERVICE_DISTRIBUTE');
					this.$vc.emit('COLLAGE_DELIVERY_TABLE');
					this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
				}).catch(error => {});
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleResetEndCourse(lesson_id) {
			Confirm.popup({
				title: "提示",
				msg: "是否确认撤回结束课程的申请？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_COLLAGE_BUSINESS_RECORD_COMPLETE_CANCEL_POST',
					type: 'POST',
					loading: false,
					param: {
						lesson_id
					},
					autoTip: true
				}).then(res => {
					this.loadData();
					this.$vc.emit('COLLAGE_RELOAD_SERVICE_DISTRIBUTE');
					this.$vc.emit('COLLAGE_DELIVERY_TABLE');
					this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
				}).catch(error => {});
			}).catch(error => {
				error && console.error(error);
			});
		},
		handlePassAll(lesson_id) {
			Confirm.popup({
				title: "提示",
				msg: "是否确认全部审核通过？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_COLLAGE_BUSINESS_RECORD_AUDIT_ALL_POST',
					type: 'POST',
					loading: false,
					param: {
						lesson_id
					},
					autoTip: true
				}).then(res => {
					this.loadData();
					this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
				}).catch(error => {});
			}).catch(error => {
				error && console.error(error);
			});
		}
	}
};
</script>

<style lang="scss">
.v-collage-service-record {
	._title-bar {
		display: inline-block;
		width: 2px;
		height: 16px;
		position: relative;
		top: 3px;
		background-color: #e84854;
	}
	._position{
		width: 0;
		height: 0;
		border-top: 16px solid #ff5461;
		border-right: 16px solid transparent;
		top: 0;
		left: 0;
	}
	._label {
		width: 85px;
		text-align: right;
	}
	._btn {
		height: 32px;
		line-height: 32px;
		color: #E84C57;
		border: 1px solid #E84C57;
	}
}
</style>