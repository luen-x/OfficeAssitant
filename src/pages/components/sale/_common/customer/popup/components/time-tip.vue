<template>
	<span class="v-sale-customer-popup-time-tip g-fs-12">
		<i class="icon iconfont g-fs-16 icon-clock1 g-pointer g-c-blue-mid" @click="handleShowInput"/>
		<span v-show="!showInput" :class="'g-m-l-5 g-operation '" @click="handleShowInput">{{ timeStr }}</span>
		<i-date-picker
			v-show="showInput"
			v-model="curTime" 
			:editable="false" 
			:clearable="false"
			:open="open"
			:options="{disabledDate}"
			:class="dateClass"
			class="g-m-l-10"
			style="width:155px"
			placeholder="请选择提醒时间"
			type="datetime"
			confirm
			@input="$emit('input',$event)" 
			@on-change="handleTipTimeChange"
			@on-open-change="handleOpenChange"
			@on-ok="handleOk"
			@on-clear="handleClear"
		/>
	</span>
</template>
<script>
import { Input, Button, DatePicker } from 'iview';
import moment from 'moment';

export default {
	name: 'oa-sale-customer-popup-tip-time',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker
	},
	props: {
		value: [String, Date],
		disabled: Boolean

	},
	data() {
		return {
			open: false,
			showInput: false,
			curTime: this.value,
			lastValue: this.value
		};
	},
	computed: {
		dateClass() {
			return '';
			// return this.open ? '_open' : '_close';
		},
		timeStr() {
			if (this.curTime) {
				return moment(this.curTime).format('YYYY-MM-DD HH:mm:ss');
			} else {
				return '设置提醒';
			}
		}
	},
	watch: {
		value(val, valOld) {
			this.curTime = val;
		}

	},
	methods: {
		handleTipTimeChange(val) {
		},
		disabledDate(date) {
			return date.getTime() < new Date().getTime();
		},
		handleOpenChange(val) {
			if (val) {
				this.lastValue = this.curTime;
			}
			this.open = val;
			if (!val) {
				setTimeout(() => {
					this.showInput = false;
				}, 200);
			}
		},
		handleShowInput() {
			if (this.disabled) return;
			this.showInput = true;
			this.open = true;

		},
		handleOk(event) {
			this.open = false;
			if (!moment(this.curTime).isSame(moment(this.lastValue))) {
				this.$emit('on-ok', this.curTime);
			}
		},
		handleClear(event) {
			this.open = false;
			if (this.lastValue) {
				this.$emit('on-clear', event);
			}
		},
		back() {
			this.curTime = this.lastValue;
		}
	}
};
</script>
<style lang="scss">
.v-sale-customer-popup-time-tip {
	.ivu-date-picker{
		input{
			background-color: #f5f5f6;
			padding-top: 0;
			padding-bottom: 0;
			height:30px;
			cursor: pointer;
			&:focus{
				border-color: #dcdee2;
				box-shadow: none;
				border: none
			}
			&:hover{
				border-color: #dcdee2;
				box-shadow: none;
				border: none
			}
		}
		input::placeholder {
				color: #a0a1a3 !important;
			}
		.ivu-input {
			border:none
		}
	}
}
</style>