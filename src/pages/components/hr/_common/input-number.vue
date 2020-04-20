<template>
	<div class="v-hr-input-number">
		<div class="g-flex g-lh-32 _number">
			<!-- 切换按钮 -->
			<div class="_prepend g-fs-12 g-flex g-relative">
				<div
					:class="[actived === '1' ? '_actived' : '', disabled ? '' : 'g-pointer']"
					:style="{width: getWidth(name) }"
					class="g-tc _item"
					@click="handleClickNumber">
					{{ name }}
				</div>
				<div
					:class="[actived === '2' ? '_actived' : '', disabled ? '' : 'g-pointer']"
					:style="{width: getWidth(disabledName) }"
					class="g-tc _item"
					@click="handleClickString">
					{{ disabledName }}
				</div>
			</div>
			<!-- 输入框 actived为1时手动输入，为2时默认值 -->
			<i-input-number
				v-if="actived === '1' && type === 'number'"
				v-model="number"
				:min="min"
				:max="max"
				:disabled="disabled"
				:style="{ width: width + 'px' }"
				@on-change="handleChange" />
			<i-input
				v-if="actived === '1' && type === 'string'"
				v-model="number"
				:maxlength="maxLength"
				:disabled="disabled"
				:style="{ width: width + 'px' }"
				@on-change="handleChange" />
			<i-input
				v-if="actived === '2'"
				v-model="number"
				:style="{ width: width + 'px' }"
				disabled
				@on-change="handleChange" />
		</div>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, InputNumber, Input } from "iview";

export default {
	name: 'oa-input-number',
	components: {
		'i-input': Input,
		'i-input-number': InputNumber,
	},
	props: {
		value: String | Number, 	// 输入框绑定值 必传
		type: {		// 输入框类型 （number|string）
			type: String,
			default: 'number'
		},
		maxLength: {	// type为string时参数
			type: Number,
			default: 15
		},
		width: {	// 输入框宽度
			type: Number,
			default: 152
		},
		min: {		// type为number时参数
			type: Number,
			default: null
		},
		max: {		// type为number时参数
			type: Number,
			default: 10000
		},
		name: {		// 按钮文字
			type: String,
			default: '数字'
		},
		disabledName: {		// 默认值按钮文字
			type: String,
			default: '不限'
		},
		disabledValue: { 	// 默认值
			type: String,
			default: '不限'
		},
		disabled: {		// 是否可点击编辑
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			actived: '',
			number: ''
		};
	},
	mounted() {
		if (typeof this.value === 'string') {
			this.actived = '2';
			this.number = this.disabledValue;
		} else if (typeof this.value === 'number') {
			this.actived = '1';
			this.number = +this.value;
		}
	},
	methods: {
		getWidth(name) {
			switch (name.length) {
				case 2:
					return '34px';
				case 3:
					return '46px';
				case 4:
					return '58px';
				default:
					return '34px';
			}
		},
		handleClickNumber() {
			if (!this.disabled) {
				this.actived = '1';
				if (this.type === 'number') {
					this.number = typeof this.value === 'string' ? null : this.value;
				} else {
					this.number = this.value;
				}
				this.handleChangeFormValue(this.number);
			}
		},
		handleClickString() {
			if (!this.disabled) {
				this.actived = '2';
				this.number = this.disabledValue;
				this.handleChangeFormValue(this.number);
			}
		},
		handleChange(value) {
			let current = this.type === 'number' ? value : value.target.value;
			this.handleChangeFormValue(current);
		},
		handleChangeFormValue(value) {
			this.current = value;
			this.$emit("input", value);
			this.dispatch("FormItem", "on-form-change", value);
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-input-number {
	._number {
		width: 220px;
		height: 32px;
		._prepend {
			border:1px solid rgba(217, 217, 217, 1);
			border-right: 0;
			border-top-left-radius: 4px;
			border-bottom-left-radius: 4px;
			._item {
				width:34px;
				height:30px;
				border-radius:2px 0px 0px 2px;
				border-radius: 0;
			}
			.item:nth-of-child(2) {
				border-radius: 0;
			}
			._actived {
				background:rgba(229,229,229,1);
			}
		}
	}
}
</style>

<style lang="scss">
.v-hr-input-number {
	.ivu-input-number {
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
	}
	.ivu-input {
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
	}
}
</style>



