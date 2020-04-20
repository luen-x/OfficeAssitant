<template>
	<div class="v-hr-recruit-school-tryassign-chief">
		<div class="_header">
			<div class="g-inline-block g-m-b-10 g-m-r-30">
				<span>可分配期限：</span>
				<i-date-picker
					v-model="deadline_start_time"
					:editable="false"
					:disabled="!startDateDisable"
					:options="options"
					:clearable="false"
					type="date"
					split-panels
					separator=" 至 "
					format="yyyy-MM-dd"
					style="width: 220px"
					class="g-m-r-5"
					placeholder="请选择可分配期限"
					transfer
				/>
				<i-date-picker
					v-model="deadline_end_time"
					:options="options"
					:editable="false"
					type="date"
					split-panels
					separator=" 至 "
					format="yyyy-MM-dd"
					style="width: 220px"
					placeholder="请选择可分配期限"
					transfer
				/>
			</div>
			<div class="g-inline-block g-m-b-10 _header-number">
				<span>可分配：
					{{ await_total_count + assigning_total_count + assigned_total_count }}人
					（{{ await_man_count + assigning_man_count + assigned_man_count }}男
					/{{ await_woman_count + assigning_woman_count + assigned_woman_count }}女）
				</span>
				<span>分配中：{{ assigning_total_count }}人（{{ assigning_man_count }}男/{{ assigning_woman_count }}女）</span>
				<span>已分配：{{ assigned_total_count }}人（{{ assigned_man_count }}男/{{ assigned_woman_count }}女）</span>
			</div>
			<div class="g-red-btn-line g-fr" @click="handleStop">
				中止分配
			</div>
		</div>
		<div class="_content">
			<div class="g-m-tb-20">
				<span class="__title-bar g-bg-red-mid"/>
				<span class="g-fs-14 g-m-lr-5">待分配（{{ await_total_count }}人，{{ await_man_count }}男{{ await_woman_count }}女）</span>
			</div>
			<div 
				v-for="(item, index) in await_assign_applicants" 
				:key="index" 
				class="__content-item"
			>
				<div style="padding: 15px 15px 5px 15px;">{{ item.manager }}</div>
				<div v-if="method == 1" class="__item-wrapper g-flex-cc g-pd-b-20 g-jc-sa">
					<div class="g-inline-block">
						<div style="color: #2397F9;" class="g-tc">男</div>
						<div class="__item">
							{{ item.await_man_count }}
						</div>
					</div>
					<div class="g-inline-block">
						<div style="color: #E84C57;" class="g-tc">女</div>
						<div class="__item __woman">
							{{ item.await_woman_count }}
						</div>
					</div>
				</div>
				<div v-else class="__item-wrapper g-flex-cc g-pd-b-20 g-jc-sa">
					<div>
						<!-- <div style="color: #2397F9;" class="g-tc">总数</div> -->
						<div class="__item-man">
							{{ item.await_total_count }}人
						</div>
					</div>
				</div>
				<div class="__item-footer g-pd-t-15">
					<div v-if="method == 1" class="g-flex g-jc-sa">
						<div class="__num">总数：{{ item.await_total_count }}/{{ item.conf_total_count }}</div>
						<span style="color: #DCDFE4">|</span>
						<div class="__num">男：{{ item.await_man_count }}/{{ item.conf_man_count }}</div>
						<span style="color: #DCDFE4">|</span>
						<div class="__num">女：{{ item.await_woman_count }}/{{ item.conf_woman_count }}</div>
					</div>
					<div v-else class="g-flex g-jc-sa">
						<div class="__num">总数：{{ item.await_total_count }}/{{ item.conf_total_count }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="_footer g-flex-cc">
			<div
				class="g-gray-btn-small g-m-r-10"
				@click="handleCancel"
			>
				取消
			</div>
			<div
				class="g-red-btn-small"
				@click="handleSave"
			>
				保存
			</div>
		</div>
	</div>
</template>

<script>
import { DatePicker, Divider } from 'iview';
import moment from 'moment';
import { Confirm } from "@components/_common/confirm/confirm";

export default {
	name: 'oa-tpl',
	components: {
		'i-date-picker': DatePicker,
		'i-divider': Divider
	},
	data() {
		return {
			options: {
				disabledDate(date) {
					return (moment().isAfter(moment(date)));
				}
			},
			deadline_id: '',
			method: 1,
			deadline_start_time: '',
			deadline_end_time: '',
			"assigned_woman_count": 0, // 已分配女生数
			"assigned_man_count": 0, // 已分配男生数
			"assigned_total_count": 0, // 已分配总数
			"assigning_woman_count": 0, // 分配中女生数
			"assigning_man_count": 0, // 分配中男生数
			"assigning_total_count": 0, // 分配中总数
			"await_total_count": 0, // 待分配总数
			"await_man_count": 0, // 待分配男生数
			"await_woman_count": 0, // 待分配女生数
			await_assign_applicants: [],
		};
	},
	computed: {
		startDateDisable() {
			return moment(this.deadline_start_time).isAfter(new Date());
		},
	},
	created() {
		this.loadData();
	},
	methods: {
		handleStop() {
			Confirm.popup({ 
				title: '提示', 
				msg: !this.await_total_count 
					? '中止分配后将结束此次分配，目前所有人员已全部分配完，确认要中止吗？' 
					: '中止分配后将结束此次分配，总监将无法对待分配的人员进行分配，确认要中止吗？', 
				showIcon: true 
			}).then((res) => {
				this.handleStopAllocate();
			}).catch((err) => err && console.error(err));
		},
		handleStopAllocate() {
			this.$request({
				url: '_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_DISCONTINUE_SAVE_POST',
				type: "POST",
				param: {
					assign_type: 2,
					deadline_id: this.deadline_id,
				},
				loading: false
			}).then((res) => {
				this.$Message.success(res.msg);
				this.$router.push('/hr/recruit/school/tryassign');
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		loadData() {
			this.$request({
				url: '_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_CHIEF_GET',
				type: "GET",
				param: {
					assign_type: 2
				},
				loading: false
			}).then((res) => {
				this.deadline_id = res.data.deadline_id;
				this.deadline_start_time = res.data.deadline_start_time;
				this.deadline_end_time = res.data.deadline_end_time;
				this.assigned_woman_count = res.data.assigned_woman_count;
				this.assigned_man_count = res.data.assigned_man_count;
				this.assigned_total_count = res.data.assigned_total_count;
				this.assigning_woman_count = res.data.assigning_woman_count;
				this.assigning_man_count = res.data.assigning_man_count;
				this.assigning_total_count = res.data.assigning_total_count;
				this.await_total_count = res.data.await_total_count;
				this.await_man_count = res.data.await_man_count;
				this.await_woman_count = res.data.await_woman_count;
				this.await_assign_applicants = res.data.await_assign_applicants;
				this.method = res.data.method;
			}).catch((error) => {

			});
		},
		handleSave() {
			if (moment(this.deadline_end_time).isAfter(this.deadline_start_time)) {
				this.$request({
					url: '_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_SAVE_POST',
					type: "POST",
					param: {
						assign_type: 2,
						method: this.method,
						deadline_id: this.deadline_id,
						deadline_start_time: moment(this.deadline_start_time).format('YYYY-MM-DD'),
						deadline_end_time: moment(this.deadline_end_time).format('YYYY-MM-DD'),
					},
					loading: false
				}).then((res) => {
					this.$Message.success('最新分配结果保存成功');
					this.loadData();
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			} else {
				this.$Message.warning('请输入正确可分配期限');
			}
		},
		handleCancel() {
			this.$router.go(-1);
		}
	},
};
</script>

<style lang="scss">
.v-hr-recruit-school-tryassign-chief {
	padding: 20px 20px 20px 40px;
	._header {
		._header-number {
			height: 32px;
			line-height: 32px;
			background-color: #F8F8F8;
			padding: 0px 20px 0 20px;
		}
	}
	._content {
		margin-bottom: 130px;
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			top: 2px;
			position: relative;
			background-color: #e84854;
		}
		.__content-item {
			display: inline-block;
			margin: 0px 20px 20px 0px;
			width: 366px;
			height: 180px;
			background:rgba(255,255,255,1);
			box-shadow:0px 1px 7px 0px rgba(123,123,123,0.3);
			border-radius:4px;
			.__item-wrapper {
				height: 95px;
				padding: 0 86px 20px 86px;
				.__item{
					width:72px;
					height:32px;
					line-height: 32px;
					font-size: 14px;
					text-align: center;
					background-color:#E9F5FE;
					border-radius:2px;
					font-weight:bold;
					color: #2397F9;
					&.__woman {
						background-color:#FDEDEF;
						color:#E84C57;
					}
				}
			}
			.__item-footer {
				border-top: 1px solid #DCDFE4;
				.__num {
					display: inline-block;

				}
			}
		}
	}
	._footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 60px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-divider-vertical {
		line-height: 12px;
		height: 15px !important;
		background-color: #DCDFE4 !important;
	}
}
</style>
