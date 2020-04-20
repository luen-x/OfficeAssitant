<template>
	<div class="page">
		<i-modal
			v-model="visible"
			:mask-closable="false"
			class-name="v-sale-main-rankings-own-target"
			width="680"
			@on-ok="handleOk"
			@on-cancel="handleCancel">
			<div slot="header" class="g-flex g-jc-sb">
				<div class="g-tc _text-center">我的下级员工目标完成情况</div>
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
			<div class="g-flex _heard g-fs-12 g-c-black1">
				<div class="g-col">员工</div>
				<div class="g-col">业绩</div>
				<div class="g-col">保底目标</div>
				<div class="g-col">平衡目标</div>
				<div class="g-col">冲刺目标</div>
			</div>
			<div v-for="(item,i) in list" :key="i" class="g-flex _table g-c-black2">
				<div class="g-col">{{ item.staff_name }}</div>
				<div class="g-col">{{ item.current_money }}</div>
				<div class="g-col">{{ item.min_target }}</div>
				<div class="g-col">{{ item.target }}</div>
				<div class="g-col">{{ item.max_target }}</div>
			</div>
			<div slot="footer"/>
		</i-modal>
	</div>
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
				url: API._SALE_MAIN_DATA_ACHIEVEMENT_ORDER_GET,
				type: "get",
				param: {
					month: this.value3
				}
			}).then(res => {
				this.list = res.data.staff_proportion_order;
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
			this.open = false;
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
export const OwnTarget = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
.v-sale-main-rankings-own-target{
	._text-center{
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	._heard {
		height: 40px;
		line-height: 40px;
		padding-left: 60px;
		background: #f0f4fc;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
		& > div {
			text-align: left;
		}
	}
	._table {
		padding-left: 60px;
		height: 38px;
		line-height: 38px;
		& > div {
			text-align: left;
		}
	}
	._table:nth-child(2n ) {
		background: #edeef1;
	}
}
</style>
