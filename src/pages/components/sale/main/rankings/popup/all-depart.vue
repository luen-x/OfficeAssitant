<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		width="680"
		class-name="v-sale-main-rankings-all-depart"
		@on-ok="handleOk"
		@on-cancel="handleCancel">
		<div slot="header" class="g-flex g-jc-sb">
			<div class="g-tc _text-center">所有部门业绩排名</div>
			<div style="visibility: hidden;">
				<span>当前月份:</span>
				<span>2018-10</span>
				<span class="g-c-blue-light">重新选择</span>
			</div>
		</div>
		<div class="g-m-b-10 g-tc">
			<i-date-picker
				:value="value3"
				type="month"
				placeholder="选择日期"
				style="width: 220px;margin-right: 8px;"
				@on-change="handleChange"
			/>
			<i-input
				v-model="keyword"
				placeholder="请输入部门名称"
				style="width:220px"
				class="g-m-r-10"
				@on-enter="handleSearch"
			/>
			<vc-debounce-click :tag="Button" type="primary" @click="handleSearch">搜索</vc-debounce-click>
		</div>
		<div
			:style="{paddingRight:list.length>12?'15px':''}"
			class="g-flex g-fs-12 __heard g-c-black1"
		>
			<div class="g-col">排名</div>
			<div class="g-col">部门</div>
			<div class="g-col">业绩</div>
		</div>
		<div class="_body" >
			<div v-for="(item,i) in list" :key="i" class="g-flex g-fs-12  __table g-c-black2">
				<div class="g-col">{{ item.sort_count }}</div>
				<div class="g-col">{{ item.depart_name }}</div>
				<div class="g-col">{{ item.current_money }}</div>
			</div>
		</div>
		<div slot="footer"/>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, DatePicker } from 'iview';
import API from '@stores/apis/root';
import moment from 'moment';
import { CreatePortal } from 'wya-vc';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-date-picker": DatePicker
	},
	props: {
		data: Object,
	},
	data() {
		return {
			visible: false,
			open: false,
			list: '',
			value3: '',
			keyword: '',
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		let i = moment().format('YYYY-MM');
		this.value3 = i;
		this.loadData();
	},
	methods: {
		handleSave() {
			this.visible = false;
		},
		handleSearch() {
			this.loadData();
		},
		loadData() {
			this.$request({
				url: API._SALE_MAIN_ACHIEVEMENT_DEPART_ORDER_GET,
				type: "get",
				param: {
					month: this.value3,
					keyword: this.keyword
				}
			}).then(res => {
				this.data.type == 0 ? this.list = res.data.lowest_depart_list : this.list = res.data.brothers_depart_list;
			}).catch(error => {
				console.error(error);
			});
		},
		handleNull() {
			this.visible = false;
		},
		// 日历选择
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.value3 = date;
			this.open = false;
		},
		handleClear() {
			this.open = false;
		},
		handleDateClose() {
			this.open = false;
		},
		handleDateOk() {
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
		handleDetail() {
			this.$router.push({ name: "full-casedetail" });
		}
	}
};
export const AllDepart = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
.v-sale-main-rankings-all-depart{
	._text-center{
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	.__heard {
		height: 40px;
		padding-left:60px;
		line-height: 40px;
		background: #f0f4fc;
		& > div {
			text-align: left;
		}
	}
	._body {
		max-height:300px;
		overflow-y: auto;
		.__table {
			padding-left:60px;
			height: 38px;
			line-height: 38px;
			& > div {
			text-align: left;
			}
		}
		.__table:nth-child(2n ) {
			background: #fafafa;
		}
	}
}
</style>
