<template>
	<div class="v-hr-recruit-school-tryassign-random">
		<div class="_header">
			<div class="g-inline-block g-m-b-10 g-m-r-30">
				<span>可分配期限：</span>
				<i-date-picker
					v-model="deadline_start_time"
					:editable="false"
					:options="options"
					:disabled="!startDateDisable"
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
				<span>可分配人数：
					{{ await_total_count + assigning_total_count + assigned_total_count }}人
					（{{ await_man_count + assigning_man_count + assigned_man_count }}男
					/{{ await_woman_count + assigning_woman_count + assigned_woman_count }}女）
				</span>
				<span>已分配人数：{{ assigned_total_count }}人（{{ assigned_man_count }}男/{{ assigned_woman_count }}女）</span>
			</div>
			<div class="g-red-btn-line g-fr g-m-r-15" @click="handleStop">
				中止分配
			</div>
		</div>
		<div class="_content">
			<div class="__cotent-wrapper g-m-t-15">
				<div class="__wrapper-left">
					<div class="g-m-b-10">
						<span class="__title-bar g-bg-red-mid"/>
						<span class="g-fs-14 g-m-lr-5">
							分配中（{{ assigningTotal }}人，
							{{ assigningMan }}男 
							{{ assigningWoman }}女）
						</span>
					</div>
					<div 
						v-for="(item, index) in assigning_depart_applicants" 
						:key="index" 
						class="__content-item"
						@drop="handleDragOver($event, item)"
						@dragover.prevent
					>
						<div style="padding: 15px 15px 10px 20px;">{{ item.manager }}</div>
						<div class="__item-wrapper">
							<div 
								v-for="(it, index1) in item.assigning_applicants"
								:draggable="true"
								:key="index1"
								:class="it.sex ? '__woman' : ''"
								class="__item"
								@dragstart="hadnleDragStart($event, it)"
							>
								{{ it.applicant_name }}
								<i 
									class="iconfont icon-close g-c-black1 g-fs-12 g-m-l-5"
									@click="handlePeopleAwait(item, index1, it)"
								/>
							</div>
						</div>
						<div class="__item-footer g-pd-t-10">
							<div class="g-flex g-jc-sa">
								<div class="__num">总数：
									{{ item.assigning_applicants.reduce((pre, cur) => {
										return Number(cur.hasOwnProperty('sex')) + pre;
									}, 0) }}
								</div>
								<span style="color: #DCDFE4">|</span>
								<div class="__num">男：
									{{ item.assigning_applicants.reduce((pre, cur) => {
										return Number(!cur.sex) + pre;
									}, 0) }}
								</div>
								<span style="color: #DCDFE4">|</span>
								<div class="__num">女：
									{{ item.assigning_applicants.reduce((pre, cur) => {
										return cur.sex + pre;
									}, 0) }}
								</div>
							</div>
							<!-- <div v-else class="g-flex g-jc-sa">
								<div class="__num">总数：{{ item.total_count }}</div>
							</div> -->
						</div>
					</div>
				</div>
				<div class="__wrapper-right">
					<div class="g-m-b-10">
						<span class="__title-bar g-bg-red-mid"/>
						<span class="g-fs-14 g-m-lr-5">
							待分配（{{ awaitTotal }}人，
							{{ awaitMan }}男 
							{{ awaitWoman }}女）
						</span>
					</div>
					<div 
						class="__item-wrapper"
						@drop="handleDragOver($event, await_assign_applicants)"
						@dragover.prevent
					>
						<div 
							v-for="(item, index) in await_assign_applicants.await_applicants"
							:key="index"
							:draggable="true"
							:class="item.sex ? '__woman' : ''"
							class="__item"
							@dragstart="hadnleDragStart($event, item)"
						>
							{{ item.applicant_name }}
						</div>
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
			await_assign_applicants: {
				await_applicants: []
			},
			assigning_depart_applicants: [], // 分配中战区
		};
	},
	computed: {
		startDateDisable() {
			return moment(this.deadline_start_time).isAfter(new Date());
		},
		awaitTotal() {
			return this.awaitMan + this.awaitWoman;
		},
		awaitMan() {
			return this.await_assign_applicants.await_applicants.reduce((pre, cur) => {
				return Number(!cur.sex) + pre;
			}, 0);
		},
		awaitWoman() {
			return this.await_assign_applicants.await_applicants.reduce((pre, cur) => {
				return cur.sex + pre;
			}, 0);
		},
		assigningTotal() {
			return this.assigningMan + this.assigningWoman;
		},
		assigningMan() {
			let count = 0;
			this.assigning_depart_applicants.forEach(item => {
				count += item.assigning_applicants.reduce((pre, cur) => {
					return Number(!cur.sex) + pre;
				}, 0);
			});
			return count;
		},
		assigningWoman() {
			let count = 0;
			this.assigning_depart_applicants.forEach(item => {
				count += item.assigning_applicants.reduce((pre, cur) => {
					return cur.sex + pre;
				}, 0);
			});
			return count;
		},
	},
	created() {
		this.loadData();
	},
	methods: {
		handleDragOver(event, item) {
			let data = JSON.parse(event.dataTransfer.getData('item'));
			let targetArr; // 被拖走的 element
			let targetIndex;
			const applicants = [...this.assigning_depart_applicants, this.await_assign_applicants];
			for (let i = 0; i < applicants.length; i++) {
				const arr = applicants[i].assigning_applicants || applicants[i].await_applicants;
				for (let j = 0; j < arr.length; j++) {
					const index = arr.findIndex(staff => staff.applicant_id === data.applicant_id);
					if (index > -1) {
						targetArr = arr;
						targetIndex = index;
						break;
					}
				}
			}
			if (targetArr) {
				if (!(item.assigning_applicants || item.await_applicants).find(staff => staff.applicant_id == data.applicant_id)) {
					targetArr.splice(targetIndex, 1);
					(item.assigning_applicants || item.await_applicants).push(data);
				}
			} else {
				console.error('找不到staff ', data);
			}
		},

		hadnleDragStart(event, it) {
			event.dataTransfer.setData('item', JSON.stringify(it));
		},

		handlePeopleAwait(item, index, it) {
			item.assigning_applicants.splice(index, 1);
			this.await_assign_applicants.await_applicants.push(it);
		},
		handleStop() {
			Confirm.popup({ 
				title: '提示', 
				msg: (this.await_total_count + this.assigning_total_count + this.assigned_total_count) == this.assigned_total_count
					? '中止分配后将结束此次分配，目前所有人员已全部分配完，确认要中止吗？' 
					: '中止分配后将结束此次分配，分配中的人员将恢复到待分配，总监将无法分配这些人员，确认要中止吗？', 
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
					assign_type: 1,
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
				url: '_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_RANDOM_GET',
				type: "GET",
				param: {
					assign_type: 1
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
				this.assigning_depart_applicants = res.data.assigning_depart_applicants;
				this.method = res.data.method;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleSave() {
			if (moment(this.deadline_end_time).isAfter(this.deadline_start_time)) {
				this.$request({
					url: '_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_SAVE_POST',
					type: "POST",
					param: {
						assign_type: 1,
						method: this.method,
						deadline_id: this.deadline_id,
						deadline_start_time: moment(this.deadline_start_time).format('YYYY-MM-DD'),
						deadline_end_time: moment(this.deadline_end_time).format('YYYY-MM-DD'),
						await_assign_applicants: this.await_assign_applicants,
						assigning_depart_applicants: this.assigning_depart_applicants,
					},
					loading: false
				}).then((res) => {
					this.loadData();
					this.$Message.success('最新分配结果保存成功');
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
.v-hr-recruit-school-tryassign-random {
	height: inherit;
	padding: 20px 0 20px 40px;
	overflow: hidden;
	._header {
		._header-number {
			height: 32px;
			line-height: 32px;
			background-color: #F8F8F8;
			padding: 0px 20px 0 20px;
		}
	}
	._content {
		height: inherit;
		margin-bottom: 130px;
		.__cotent-wrapper {
			display: flex;
			height: 80%;
			.__wrapper-left {
				flex: 7;
				padding: 5px;
				overflow-y: auto;
			}
			.__wrapper-right {
				flex: 3;
				overflow-y: auto;
				padding-left: 20px;
				.__item-wrapper {
					min-height: 94%;
					padding-bottom: 20px;
					.__item{
						display: inline-block;
						height: 24px;
						padding: 2px 10px 2px 10px;
						margin: 0 10px 10px 0px;
						line-height: 21px;
						font-size: 12px;
						text-align: center;
						background-color: #E9F5FE;
						border-radius: 3px;
						color: #2397F9;
						cursor: pointer;
						&.__woman {
							background-color:#FDEDEF;
							color:#E84C57;
						}
					}
				}
			}
		}
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
			height: 190px;
			background:rgba(255,255,255,1);
			box-shadow:0px 1px 7px 0px rgba(123,123,123,0.3);
			border-radius:4px;
			.__item-wrapper {
				height: 105px;
				padding: 0 10px 0 20px;
				overflow-y: auto;
				.__item{
					display: inline-block;
					height: 24px;
					padding: 2px 10px 2px 10px;
					margin: 0 10px 10px 0px;
					line-height: 21px;
					font-size: 12px;
					text-align: center;
					background-color: #E9F5FE;
					border-radius: 3px;
					color: #2397F9;
					cursor: pointer;
					&.__woman {
						background-color:#FDEDEF;
						color:#E84C57;
					}
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
}
</style>
