<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		width="680"
		class-name="v-sale-main-rankings-rank"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-flex g-jc-sb">
			<div class="g-tc _text-center">前20名员工业绩排行</div>
			<div style="visibility: hidden;">
				<span>当前月份:</span>
				<span>2018-10</span>
				<span class="g-c-blue-light">重新选择</span>
			</div>
		</div>
		<div class="g-tc" style="margin-bottom: 16px;">
			<i-date-picker
				:value="value3"
				type="month"
				placeholder="选择日期"
				style="width: 220px;margin-right: 8px;"
				@on-change="handleChange"
			/>
			<vc-debounce-click :tag="Button" type="primary" @click="getData()">搜索</vc-debounce-click>
		</div>
		<div
			:style="{paddingRight:list.length>13?'15px':''}"
			class="g-flex _heard g-c-black1">
			<div class="g-col">排名</div>
			<div class="g-col">所属部门</div>
			<div class="g-col">员工姓名</div>
			<div class="g-col">业绩</div>
		</div>
		<div class="_body">
			<div v-for="(item,i) in list" :key="i" class="g-flex __table g-c-black2">
				<div class="g-col">{{ item.sort }}</div>
				<div class="g-col">{{ item.depart_name }}</div>
				<div class="g-col">{{ item.staff_name }}</div>
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
	data() {
		return {
			visible: false,
			open: false,
			show: true,
			list: '',
			value3: ''
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		let i = moment().format('YYYY-MM');
		this.value3 = i;
		this.getData();
	},
	methods: {
		handleSave() {
			this.visible = false;
		},
		getData() {
			this.$request({
				url: API._SALE_MAIN_DATA_ACHIEVEMENT_TOP_GET,
				type: "get",
				param: {
					month: this.value3,
				}
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
		handleNull() {
			this.visible = false;
		},
		handleDateClose() {
			this.open = false;
		},
		handleOpenChange(v) {
			this.open = v;
		},
		handleDateOk() {
			this.open = false;
		},
		// 日历选择
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.value3 = date;
			// this.getData();
			this.open = !this.open;
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
		handleDetail() {
			this.$router.push({ name: "full-casedetail" });
		}
	}
};
export const ModalRank = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
	.v-sale-main-rankings-rank{
		._text-center {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}
		._heard {
			height: 40px;
			line-height: 40px;
			padding-left: 60px;
			background: #f0f4fc;
			& > div {
				text-align: left;
			}
		}
		._body {
			max-height: 350px;
			overflow-y: auto;
			.__table {
				height: 38px;
				padding-left: 60px;
				line-height: 38px;
				& > div {
					text-align: left;
				}
			}
			.__table:nth-child(2n) {
				background: #fafafa;
			}
		}
	}
</style>
