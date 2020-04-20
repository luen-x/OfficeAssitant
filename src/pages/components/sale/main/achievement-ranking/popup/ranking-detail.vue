<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		:title="title+'排行'"
		width="680"
		class-name="v-sale-main-rankings-all-zone"
		@on-ok="handleOk"
		@on-cancel="handleCancel">
		<div class="g-flex" style="margin-bottom: 16px;line-height: 40px;">
			<div style="max-width: 457px;">
				<i-select v-if="tabType==2" v-model="quarterId" style="width: 220px;margin-right: 5px;" @on-change="handleChangeQuarter">
					<i-option v-for="item in cofigList" :key="item.config_id" :value="item.config_id">
						{{ item.start_time+'~'+item.end_time }}
					</i-option>
				</i-select>
				<i-date-picker
					v-else
					:value="date"
					:type="tabType>1?'year':'month'"
					placeholder="选择日期"
					style="width: 220px;margin-right: 5px;"
					@on-change="handleChange"
				/>
				<i-cascader
					v-if="status<3"
					v-model="depart_id"
					:data="departAll"
					style="width: 220px; display: inline-block;margin-right:5px;margin-left:2px"
					clearable
					transfer
					change-on-select
					trigger="click"
					placeholder="请选择组织"
					@on-change="handleChangeDepart"
				/>
				<i-input
					v-if="status<2"
					v-model="params.search"
					placeholder="请输入员工姓名"
					style="width:220px;margin-right:5px;margin-left:2px"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
			</div>
			<vc-debounce-click :tag="Button" class=" g-m-l-5 g-m-t-5" type="primary" @click="handleSearch()">搜索</vc-debounce-click>
		</div>
		<div
			class="g-flex _heard g-fs-12 g-c-black1">
			<div v-for="(item,i) in tableHeader" :key="i" style="width:191px" >{{ item }}</div>
		</div>
		<div class="_body">
			<div v-for="(item,i) in list" :key="i" class="g-flex __table g-c-black2">
				<div style="width:191px">{{ item.sort_count }}</div>
				<div style="width:191px">{{ item[type] }} <span v-if="type=='staff_name'">({{ item.depart_name }})</span> </div>
				<div style="width:191px">{{ item.current_money }}</div>
			</div>
		</div>
		<div slot="footer" class="g-tl">
			<div v-if="level==(status-1)">
				我的{{ title }}排名：{{ my_rank||'暂无' }}
			</div>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, DatePicker, Cascader, Select, Option } from 'iview';
import API from '@stores/apis/root';
import { services } from "@stores/services/sale";
import moment from 'moment';
import { CreatePortal } from 'wya-vc';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-date-picker": DatePicker,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		'i-cascader': Cascader,
	},
	mixins: [
		services.departAll()
	],
	props: {
		title: {
			type: String,
			default: '提示'
		},
		dateValue: {
			type: String,
			default: ''
		},
		quarter: {
			type: [String, Number],
			default: ''
		},
		status: {
			type: Number,
			default: 1 // 1.员工 2.经理 3超管、总监
		},
		level: {
			type: Number,
			default: 1 // 1.员工 2.经理 3超管、总监
		},
		tabType: {
			type: [Number, String],
			default: 1 // 1.月度 2.季度 3年度
		},
		type: {
			type: String,
			default: 'depart_name'
		},
		url: {
			type: String,
			default: ''
		},
		tableHeader: {
			type: Array,
			default() {
				return ['排名', '部门', '业绩'];
			}
		},
		params: {
			type: Object,
			default() {
				return {};
			}
		},
		cofigList: {
			type: Array,
			default() {
				return {};
			}
		},
	},
	data() {
		return {
			visible: false,
			open: false,
			date: this.dateValue,
			search: '',
			list: [],
			quarterId: this.quarter,
			my_rank: '',
			sort_name: '',
			depart_id: []
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData(v) {
			this.$request({
				url: this.url,
				type: "GET",
				loading: false,
				param: {
					...this.params,
					is_cut: 0
				 }
			}).then((res) => {
				const data = this.type == 'depart_name' ? (res.data.length && res.data[0]) || {} : res.data;
				this.my_rank = data.my_rank;
				this.sort_name = data.sort_name;
				this.list = data.data || [];
			}).catch((err) => {
				console.error(err);
			});
		},
		// 日历选择
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.date = date;
			this.open = false;
			this.tabType > 1 ? this.params.year = date : this.params.month = date;
			this.loadData();
		},
		handleChangeDepart(v) {
			const p = [...v];
			this.params.depart_id = p.pop();
			this.loadData();
		},
		handleSearch() {
			this.loadData();
		},
		handleClear() {
			this.open = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleChangeQuarter(v) {
			const quarter = this.cofigList.find(it => {
				return it.config_id == v;
			});
			this.params.end_month = quarter.end_time;
			this.params.start_month = quarter.start_time;
			this.loadData();
		}
	}
};
export const rankingDetail = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
.v-sale-main-rankings-all-zone{
	._text-center{
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	._heard {
		padding-left: 60px;
		height: 40px;
		line-height: 40px;
		background: #f0f4fc;
		& > div {
			text-align: left;
		}
	}
	._body{
		max-height: 300px;
		overflow-y:auto;
        .__table {
			padding-left:60px;
            height: 38px;
            line-height: 38px;
            & > div {
                text-align: left;
            }
        }
        .__:nth-child(2n) {
            background: #fafafa;
        }
	}
}
</style>
