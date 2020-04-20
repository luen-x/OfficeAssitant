<template>
	<i-tabs
		:value="label"
		:animated="false"
		class="hr-integration-content-modal"
		@on-click="handleChange"
	>
		<i-tabpane
			v-for="(items, index) of tabs"
			:key="items.value"
			:name="items.value"
			:label="`${items.label} ${counts[index]}`"
		>
			<div class="g-pd-20">
				<div class="_filter">
					<i-datepicker 
						v-model="formdata.start_month"
						:options="option"
						type="month"
						placeholder="请选择提交查询开始月"
						style="width: 220px"
						clearable
						transfer
						@on-change="handleSearch"
					/>
					<i-datepicker 
						v-model="formdata.end_month"
						:options="option"
						type="month"
						placeholder="请选择提交查询结束月"
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
				<i-collapse 
					v-if="(label === items.value) && data.length"
					:value="service" 
					accordion 
					class="g-m-t-20 _collapse-father" 
					@on-change="handleCollpaseOutChange">
					<i-panel
						v-for="(item, index) of data"
						:key="index"
						:name="index + ''"
					>
						<span>
							{{ item.service_item_name }}
							<span style="color: #E84C57">({{ item.service_item_await }}待评分)</span>
						</span>
						<div slot="content">
							<i-collapse :value="nameArr" class="_collpase-child">
								<i-panel 
									v-for="(info, i) of item.company"
									:key="i"
									:name="i + ''"
								>
									<span>
										{{ info.company_name }}
										<span style="color: #E84C57">({{ info.contract_company_await }}待评分)</span>
									</span>
									<span class="g-absolute" style="right: 20px">
										本项合计: {{ info.item_total }}分
									</span>
									<div slot="content" style="padding: 0 20px 0 40px">
										<i-checkbox-group 
											v-model="(otherData[i] || {}).selectKeys" 
											style="paddingLeft: 10px; marginBottom: 10px"
											@on-change="() => handleSelect(info.detail, i)">
											<div
												v-for="(mess, idx) of info.detail"
												:key="idx"
												class="g-flex g-jc-sb"
												style="font-size: 12px"
											>
												<i-checkbox 
													:label="idx" 
													:disabled="mess.status !== 0"
													style="flex: 1">{{ mess.create_time }}</i-checkbox>
												<span v-if="label === '14' || label === '15'" style="flex: 1">服务{{ mess.service_times }}次</span>
												<div style="flex: 1">
													<span 
														v-if="label === '18'"
														class="g-operation" 
														@click="() => handlePopup(info.detail, 'add', idx)">投诉信息</span>
													<span 
														v-else-if="$auth[866]"
														class="g-operation" 
														@click="() => handlePopup(info.detail, 'look', idx)">
														<span v-if="label === '16'">查看回款&凭证</span>
														<span v-else>查看凭证&备注</span>									
													</span>
												</div>												
												<span style="flex: 1">{{ mess.audit_time }}</span>
												<div class="g-flex g-jc-sb" style="width: 80px">
													<template v-if="mess.status === 0">
														<span 
															v-if="$auth[862]"
															class="g-operation" 
															@click="() => handleGrade(mess)">评分</span>	
														<span 
															v-if="$auth[863]"
															class="g-operation g-m-l-5" 
															@click="() => handlePopup(mess, 'reject')">驳回</span>
													</template>
													<template v-if="mess.status === 1">
														<span v-if="mess.type === 1">已评</span>
														<span v-else>{{ mess.point }}</span>
														<span 
															v-if="$auth[864]"
															class="g-operation g-m-l-5" 
															@click="() => handlePopup(mess, 'edit')">修改</span>
													</template>
													<template v-if="mess.status === 2">
														<span>驳回</span>	
														<span 
															v-if="$auth[864]"
															class="g-operation g-m-l-5" 
															@click="() => handlePopup(mess, 'edit')">修改</span>
													</template>
												</div>						
											</div>
										</i-checkbox-group>
										<div v-if="$auth[865]" class="g-m-t-10" style="padding: 10px 0 10px 10px; background: #fff">
											<i-checkbox 
												v-model="(otherData[i] || {}).selectAll"
												:disabled="info.detail.every(item => item.status !== 0)"
												@on-change="() => handleSelectAll(info.detail, i)">全选</i-checkbox>
											<span class="g-gray-btn-line" @click="() => handleGrade(info.detail, i)">评总分</span>
											<span 
												v-if="label === '14'"
												class="g-red-btn-line" 
												@click="() => handleReject(info.detail, i)">驳回</span>
										</div>
									</div>
								</i-panel>
							</i-collapse>
						</div>
					</i-panel>
				</i-collapse>
			</div>
			<div v-if="!data.length" class="g-flex g-jc-c g-m-t-30">
				暂无数据
			</div>
		</i-tabpane>
	</i-tabs>
</template>

<script>
import { DatePicker, Button, Collapse, Panel, Checkbox, CheckboxGroup, Tabs, TabPane } from 'iview';
import moment from 'moment';
import { GradeModal } from './popup/grade';
import { LookModal } from './popup/look';
import { EditModal } from './popup/edit';
import { RejectModal } from './popup/reject';
// import { ResolveModal } from './popup/resolve';
import { AddModal } from './popup/add';

const initialSelectData = {
	nameArr: [],
	otherData: []
};

export default {
	name: 'hr-drawer-integration-content',
	components: {
		'i-datepicker': DatePicker,
		'i-button': Button,
		'i-collapse': Collapse,
		'i-panel': Panel,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-tabs': Tabs,
		'i-tabpane': TabPane,
	},
	props: {
		staffId: Number
	},
	data() {
		let month = moment().subtract(1, 'months').format('YYYY-MM');
		return {
			service: '0',
			formdata: {
				start_month: month,
				end_month: month,
			},
			month,
			selectAll: false,
			loading: false,
			selectKeys: [],
			nameArr: [],
			otherData: [],
			counts: [0, 0, 0, 0, 0],
			label: '14',
			data: [],
			tabs: [
				{
					label: '基础服务',
					value: '14',
				},
				{
					label: '咨询服务',
					value: '15',
				},
				{
					label: '客户跟踪',
					value: '16',
				},
				{
					label: '客户满意度',
					value: '17',
				},
				{
					label: '客户投诉',
					value: '18',
				}
			]
		};
	},
	computed: {
		option() {
			// let day = moment().dates();
			// return {
			// 	disabledDate: (date) => {
			// 		return day < 25 && (date && date.valueOf() > new Date(this.month).valueOf());
			// 	}
			// };
			return {};

		}
	},
	watch: {
		staffId() {
			this.loadData();
		},
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.data = [];
			this.otherData = [];
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_DETAIL_GET',
				type: 'POST',
				param: {
					staff_id: this.staffId,
					rule_type: this.label,
					start_month: this.formdata.start_month && moment(this.formdata.start_month).format('YYYY-MM'),
					end_month: this.formdata.end_month && moment(this.formdata.end_month).format('YYYY-MM'),
				},
				loading: false
			}).then(res => {
				let resCounts = res.data.counts;
				resCounts.forEach((item, index) => {
					this.counts[index] = item.count;
				});
				res.data.list.length && this.handleSelectData(res.data.list);
				this.data = res.data.list;
			}).catch(err => {
				console.error(err);
				this.$Message.error(err.msg);
			});
		},
		handleSelectData(list) {
			const data = (list || this.data)[this.service] || {};
			let objData = {
				nameArr: [],
				otherData: []
			};
			data.company.forEach((item, index) => {
				objData.nameArr.push(index + "");
				let obj = {};
				obj.selectAll = false;
				obj.selectKeys = [];
				objData.otherData.push(obj);
			});
			this.nameArr = objData.nameArr;
			this.otherData = objData.otherData;
		},
		handleSearch() {
			this.loadData();
		},
		handleCollpaseOutChange() {
			this.handleSelectData();
		},
		handleChange(value) {
			this.label = value;
			this.loadData();
		},
		handleSelectAll(arr, i) {
			const data = this.otherData[i];
			let arrData = [];
			if (data.selectAll) {
				arr.forEach((item, index) => {
					item.status === 0 && arrData.push(index);
				});	
				data.selectKeys = arrData;		
			} else {
				data.selectKeys = [];
			}
		},
		handleSelect(arr, i) {
			const data = this.otherData[i];
			data.selectAll = arr.length === data.selectKeys.length;
		},
		handlePopup(item, name, idx) {
			const popupObj = {
				"edit": EditModal,
				"reject": RejectModal,
				"look": LookModal,
				"add": AddModal
			};
			popupObj[name].popup({
				item,
				label: this.label,
				idx
			}).then(res => {
				this.loadData();
			}).catch(err => {
				name === 'look' && this.loadData();
			});
		},
		handleReject(item, index) {
			if (index || index === 0) {
				const data = this.otherData[index];
				item = data.selectKeys.map(info => {
					return item[info];
				});
				if (!item.length) {
					this.$Message.error('没有服务项');
					return;
				}
			}
			RejectModal.popup({
				item
			}).then(res => {
				this.loadData();
			}).catch(err => {

			});
		},
		handleGrade(item, index) {
			if (index || index === 0) {
				const data = this.otherData[index];
				item = data.selectKeys.map(info => {
					return item[info];
				});
				if (!item.length) {
					this.$Message.error('没有服务项');
					return;
				}
			} else {
				item = [item];
			}
			GradeModal.popup({
				item,
				label: this.label,
			}).then(res => {
				this.loadData();
			}).catch(err => {

			});
		}
	}
};
</script>

<style lang="scss">
.hr-integration-content-modal {

	._collapse-father {
		.ivu-collapse-header {
			background: #F0F4FC;
			height: 40px;
			line-height: 40px;
		}
		.ivu-collapse-content-box {
			padding: 0;
		}
	}
	._collpase-child {
		.ivu-collapse-header {
			background: #fff;
			padding-left: 36px;
		}
		.ivu-collapse-content-box {
			padding-top: 20px;
			padding-bottom: 20px;
		}
	}
	.ivu-collapse {
		border: 0;

		.ivu-collapse-content {
			padding: 0;
		}
	}
	.ivu-icon-ios-arrow-forward:before {
		content: "\eb97" !important;
		font-family: "iconfont" !important;
	}
	.ivu-collapse-item .ivu-collapse-item-active {
		.ivu-collapse-header {
			background: #f5f5f5;
		}
		.ivu-collapse-content {
			background: #fafafa;
		}
	}
}
</style>


