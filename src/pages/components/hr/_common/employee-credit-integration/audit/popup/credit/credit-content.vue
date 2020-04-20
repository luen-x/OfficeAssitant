<template>
	<i-tabs
		:value="label"
		class="hr-credit-content-modal"
		@on-click="handleChange"
	>
		<i-tabpane
			v-for="(item, index) of tabs"
			:key="item.value"
			:name="item.value"
			:label="`${item.label} ${counts[index]}`"
		>
			<div v-if="label === item.value" class="g-pd-20">
				<div class="_filter">
					<i-datepicker 
						v-model="formdata.start_month"
						type="month"
						placeholder="请选择评定查询开始月"
						style="width: 220px"
						clearable
						transfer
						@on-change="handleSearch"
					/>
					<i-datepicker 
						v-model="formdata.end_month"
						type="month"
						placeholder="请选择评定查询结束月"
						style="width: 220px"
						class="g-m-l-5"
						clearable
						transfer
						@on-change="handleSearch"
					/>
					<i-button 
						type="primary"
						class="g-m-l-10"
						@click="handleSearch"
					>
						搜索
					</i-button>
				</div>
				<i-collapse v-if="data.list && data.list.length" value="1" class="g-m-t-20">
					<i-panel name="1">
						<span>结算学分 {{ data.point }}分</span>
						<div slot="content">
							<div
								v-for="(item, index) of data.list"
								:key="index"
								class="g-flex g-jc-sb _item">
								<div style="flex: 1">
									<oa-auto-tooltip 
										:content="item.display_content"
										label-class=""
										width="180px"
										theme="dark" 
									/>
								</div>
								<div style="flex: 1">{{ item.create_time }}</div>
								<div style="flex: 1">
									<span 
										v-if="(label === '5' || label === '10') && $auth[879]" 
										class="g-operation"
										@click="(e) => handlePopup(item, 'look')">查看凭证与备注</span>
									<span 
										v-if="label === '7' && $auth[880]" 
										class="g-operation" 
										@click="(e) => handlePopup(item, 'apply')">查看申请表单</span>
									<span 
										v-if="label === '8'" 
										class="g-operation" 
										@click="() => handleJumpSan(item)">查看课程详情</span>
								</div>
								<div style="flex: 1">{{ item.audit_time }}</div>
								<div class="g-flex g-jc-sb" style="width: 80px">
									<template v-if="label === '8'">
										<template v-if="item.status === 0">
											<span 
												v-if="$auth[876]"
												class="g-operation" 
												@click="(e) => handlePopup(item, 'grade')">评分</span>
											<span 
												v-if="$auth[877]"
												class="g-operation g-m-l-5" 
												@click="(e) => handlePopup(item, 'reject')">驳回</span>	
										</template>
										<template v-if="item.status === 1">
											<span>
												<span v-if="item.point > 0">+</span>
												{{ item.point }}
											</span>
											<span 
												v-if="$auth[878]"
												class="g-operation g-m-l-5" 
												@click="(e) => handlePopup(item, 'edit')">修改</span>	
										</template>
										<template v-if="item.status === 2">
											<span>+0</span>
											<span 
												v-if="$auth[878]"
												class="g-operation g-m-l-5" 
												@click="(e) => handlePopup(item, 'edit')">修改</span>	
										</template>
									</template>
									<template v-else>
										<template v-if="item.status === 0" >
											<span 
												class="g-operation" 
												@click="(e) => handlePopup(item, 'resolve')">通过</span>	
											<span 
												v-if="$auth[877]"
												class="g-operation g-m-l-5" 
												@click="(e) => handlePopup(item, 'reject')">驳回</span>	
										</template>
										<template v-if="item.status === 1">
											<span>通过</span>
											<span 
												v-if="$auth[878]"
												class="g-operation g-m-l-5"
												@click="(e) => handlePopup(item, 'edit')">修改</span>	
										</template>
										<template v-if="item.status === 2">
											<span>驳回</span>
											<span 
												v-if="$auth[878]"
												class="g-operation g-m-l-5" 
												@click="(e) => handlePopup(item, 'edit')">修改</span>	
										</template>
									</template>
								</div>						
							</div>
						</div>
					</i-panel>
				</i-collapse>
			</div>
		</i-tabpane>
	</i-tabs>
</template>

<script>
import { DatePicker, Button, Collapse, Panel, Tabs, TabPane } from 'iview';
import moment from 'moment';
import AutoToolTip from '@components/_common/auto-tooltip/auto-tooltip';
import { GradeModal } from './popup/grade';
import { LookModal } from './popup/look';
import { EditModal } from './popup/edit';
import { RejectModal } from './popup/reject';
import { ResolveModal } from './popup/resolve';
import { ApplyModal } from './popup/apply';

export default {
	name: 'hr-drawer-credit-content',
	components: {
		'i-datepicker': DatePicker,
		'i-button': Button,
		'i-collapse': Collapse,
		'i-panel': Panel,
		'i-tabs': Tabs,
		'i-tabpane': TabPane,
		'oa-auto-tooltip': AutoToolTip
	},
	props: {
		staffId: Number
	},
	data() {
		return {
			formdata: {},
			data: {},
			counts: [0, 0, 0, 0],
			label: '5',
			tabs: [
				{
					label: '选修课条件项',
					value: '5',
				},
				{
					label: '素材上传条件项',
					value: '7',
				},
				{
					label: '培训开课条件项',
					value: '8',
				},
				{
					label: '自定义条件项',
					value: '10',
				}
			]
		};
	},
	watch: {
		staffId() {
			this.loadData();
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_CREDIT_AUDIT_DETAIL_GET',
				type: 'POST',
				param: {
					staff_id: this.staffId,
					rule_type: this.label,
					start_month: this.formdata.start_month && moment(this.formdata.start_month).format('YYYY-MM'),
					end_month: this.formdata.end_month && moment(this.formdata.end_month).format('YYYY-MM'),
				},
				loading: false
			}).then(res => {
				let counts = [];
				let resCounts = res.data.counts;
				resCounts.forEach(item => {
					counts.push(item.count);
				});
				this.counts = counts;
				this.data = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleChange(value) {
			this.label = value;
			this.loadData();
		},
		handleSearch() {
			this.loadData();
		},
		handleJumpSan(item) {
			window.open(`https://${window.location.host}/hr/academy/statistic/course/?search=${item.display_content}`);
		},
		handlePopup(item, name) {
			const popupObj = {
				"apply": ApplyModal,
				"edit": EditModal,
				"resolve": ResolveModal,
				"reject": RejectModal,
				"grade": GradeModal,
				"look": LookModal
			};
			popupObj[name].popup({
				item,
				staffId: this.staffId,
				rule_type: this.label
			}).then(res => {
				name !== 'look' && this.loadData();
			}).catch(err => {

			});
		},
	}
};
</script>

<style lang="scss">
.hr-credit-content-modal {
	.ivu-collapse-header {
		background: #F0F4FC;
		height: 40px;
		line-height: 40px;
	}
	.ivu-icon-ios-arrow-forward:before {
		content: "\eb97" !important;
		font-family: "iconfont" !important;
	}
	.ivu-collapse {
		border: 0;

		.ivu-collapse-content {
			padding: 0;
		}

		.ivu-collapse-content-box {
			padding: 0;
		}
	}
	._item {
		padding: 0 20px;
		height: 40px;
		line-height: 40px;

		&:nth-child(2n) {
			background: #fafafa;
		}
	}
}
</style>


