<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="添加员工"
		width="680px"
		class="v-hr-train-elite-add-staff"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-l-30 g-m-t-10 g-fs-14 g-c-black2 g-m-b-20">
			<div>
				<i-input
					v-model="param.keyword"
					:maxlength="11"
					style="width: 300px"
					placeholder="请输入姓名或手机号码搜索"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button
					type="primary"
					class="g-m-l-10"
					@click="handleSearch"
				>
					搜索
				</i-button>
				<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
					更多搜索条件
					<i
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
						class="iconfont g-fs-12 g-c-black-dark"
					/>
				</span>
			</div>
			<vc-expand ref="expand" v-model="show">
				<div
					class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
					style="padding-top: 3px;padding-bottom: 7px;"
				>
					<i-select
						v-model="param.position_id"
						placeholder="请选择职位"
						style="width: 220px"
						clearable
						transfer
						class="g-m-r-5"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item in positionList"
							:key="item.position_id"
							:value="item.position_id"
						>{{ item.position_name }}</i-option>
					</i-select>

					<i-input-number
						v-model="param.start_seniority"
						:number="true"
						:min="0"
						transfer
						clearable
						placeholder="请输入工龄最小月"
						style="width: 220px; margin-right: 5px" 
						@on-change="handleChange"/>

					<i-input-number
						v-model="param.end_seniority"
						:number="true"
						:min="param.end_seniority ? param.end_seniority : 0"
						transfer
						clearable
						placeholder="请输入工龄最大月"
						style="width: 220px" 
						class="g-m-r-5"
						@on-change="handleChange"/>
					<i-date-picker
						v-model="param.start_time"
						clearable
						transfer
						type="month"
						placeholder="请选择开始月份"
						style="width: 220px;"
						class="g-m-l-5"
						@on-change="handleSearch"
					/>
					<i-date-picker
						v-model="param.end_time"
						clearable
						transfer
						type="month"
						placeholder="请选择结束月份"
						style="width: 220px"
						class="g-m-r-5"
						@on-change="handleSearch"
					/>
				</div>
			</vc-expand>
			<div class=" __table">
				<i-table 
					:columns="columns" 
					:data="data" 
					tooltip-theme ="light"
					stripe
					class="g-m-b-20"
					@on-selection-change="handleSelectChange"/>
			</div>
		</div>
		<i-page 
			:total="totalCount"
			:current.sync="param.page"
			:page-size="param.pageSize"
			size="small" 
			show-elevator 
			show-sizer 
			transfer
			class="__page"
			@on-change="handleChange"
			@on-page-size-change="handlePageSizeChange"/>
			<!-- <div class="__select">
				<i-checkbox
					v-model="isAll"
					@on-change="handleIsAll"
				>
					全选
				</i-checkbox>
			</div> -->
	</i-modal>
</template>

<script>
import moment from 'moment';
import { Modal, Button, Select, Option, DatePicker, 
	Page, Table, Input, Checkbox, InputNumber } from 'iview';
import { CreatePortal, Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { services, staffByMutiTerm } from "@stores/services/hr";
import CustomTooltip from '@components/hr/academy-train-detail/_common/custom-tooltip';

const columns = [
	{ type: 'selection', align: 'center', width: 50, },
	{ title: '姓名', key: 'staff_name', tooltip: true },
	{ title: '部门', key: 'depart_name', tooltip: true },
	{ title: '手机号码', width: 90, key: 'mobile', tooltip: true },
	{ title: '职称', key: 'position_name', tooltip: true },
	{ title: '工龄', key: 'seniority', tooltip: true, width: 80 },
	{ title: '业绩', key: 'achievement', tooltip: true, width: 60 },
	{ title: '人才梯队',
		key: 'all_echelon', 
		width: 90,
		render(h, { row }) {
			const content = row.all_echelon.join('、');
			return (<div style="width: 45px; white-space: nowrap">
				<CustomTooltip options={{ content: content || '--' }} length={ 4 }/>
			</div>);
		} }
];

export default {
	name: "oa-hr-train-elite-related-subject",
	components: {
		'i-modal': Modal,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"vc-expand": Expand,
		'i-page': Page,
		'i-table': Table,
		'i-button': Button,
		'i-input': Input,
		'i-checkbox': Checkbox,
		'i-input-number': InputNumber
	},
	mixins: [services.departAll(), staffByMutiTerm],
	props: {
		depart_id: {
			type: [Number, String],
			required: true
		}
	},
	data() {
		return {
			select: [],
			visible: false,
			isAll: false,
			param: {
				keyword: '',
				start_time: '',
				end_time: '',
				position_id: '',
				start_seniority: null,
				end_seniority: null,
				page: 1,
				pageSize: 10,
			},
			positionList: [],
			show: false,
			columns,
			data: [],
			totalCount: 0,
		};
	},
	created() {
		this.hanldePositionList();
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData() {
			const { query } = this.$route;
			this.$request({
				url: API_ROOT.HR_ACADEMY_ELITE_TALENT_LIST_GET,
				type: "GET",
				param: {
					...this.param,
					add_staff: 1,
					depart_id: query.depart_id,
					echelon_id: query.echelon_id,
					stage_id: query.stage_id,
					start_time: this.param.start_time && moment(this.param.start_time).format("YYYY-MM"),
					end_time: this.param.end_time && moment(this.param.end_time).format("YYYY-MM")
				}
			}).then(({ data }) => {
				this.data = data.list;
				this.totalCount = data.totalCount;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleChange(page) {
			this.loadData();
		},
		handlePageSizeChange(pageSize) {
			this.param = {
				...this.param,
				pageSize
			};
			this.loadData();
		},
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('sure', this.select);
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch() {
			this.param = {
				...this.param,
				page: 1,
			};
			this.loadData();
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleSelectChange(select) {
			this.select = select;
		},
		handleIsAll() {

		},
		hanldePositionList() {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false,
			}).then((res) => {
				this.positionList = res.data.filter(item => item.depart_id == this.depart_id)[0].positions;
			}).catch((error) => {});
		}
	}
};
export const AddStaff = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-train-elite-add-staff {
    .ivu-modal-body {
        
		position: relative;
		.__table {
			height: 400px;
			overflow: auto;
			margin-top: 20px;
		}
		.__page {
			position: absolute;
			bottom: -5px;
			right: 20px;
		}
		.__select {
			position: absolute;
			bottom: 5px;
			left: 50px;
		}
    }
}
</style>

