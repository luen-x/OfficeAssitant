<template>
	<div class="c-academy-elite-add-input" @click.stop="() => {}">
		<div v-if="showEdit" class="g-dp-ib">
			<i-input
				ref="input"
				v-model="purpose"
				:maxlength="maxlength"
				:autofocus="true"
				:style="{ width: width }"
				class="g-dp-ib"
				@on-blur="handleBlur"
			/>
			<span 
				class="g-c-blue-mid g-pointer"
				@click="handleBlur">保存</span>
		</div>
		<div v-else class="g-dp-ib">
			<span class="g-pd-r-20 __value" style="font-size: 14px">{{ value }}</span>
			<i 
				class="icon iconfont icon-bianji g-fs-16 g-pointer"
				style="color: #999; vertical-align: center"
				@click.stop="handleShowEdit"
			/>
			<i 
				class="icon iconfont icon-vertical-line g-fs-12 g-c-balck5"
			/>
			<i 
				class="icon iconfont icon-delete1 g-fs-16 g-m-r-20 g-pointer"
				style="color: #999; vertical-align: center"
				@click.stop="handleDelete"/>
		</div>
	</div>
</template>

<script>
import { Input, Icon } from 'iview';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'oa-text-input',
	components: {
		'i-input': Input,
		'i-icon': Icon
	},
	props: {
		value: String,
		maxlength: {
			type: Number,
			default: 6
		},
		width: {
			type: String,
			default: 'auto'
		}
	},
	data() {
		return {
			purpose: this.value,
			showEdit: false
		};
	},
	watch: {
		value(newVal) {
			this.purpose = newVal;
		}
	},
	methods: {
		handleShowEdit() {
			this.showEdit = true;
			this.$nextTick(() => {
				this.$refs.input.focus();
			});
		},
		handleBlur() {
			if (!this.purpose) {
				this.$Message.error('不能为空！');
				// this.handleShowEdit();
				// this.data.showEdit = false;
				// this.showEdit = true;
				this.$refs.input.focus();
				return;
			}
			const reg = /^[\u0391-\uFFE5A-Za-z]+$/;
			if (reg.test(this.purpose)) {
				this.showEdit = false;
				this.$emit('input', this.purpose);
			} else {
				this.$Message.error('仅限输入中英文');
				this.handleShowEdit();
			}
			
		},
		handleDelete() {
			this.$emit('delete');
		}
	}
};
</script>

<style lang="scss">
.c-academy-elite-add-input {
	// width: 100%;
	display: inline-block;
	line-height: 40px;
	padding-left: 20px;
	.ivu-input {
		border: none;
		background: rgba(244, 154, 88, 0.01);
		&:hover {
			box-shadow: 0 0 0 0px #fff;
		}
		&:focus {
			box-shadow: 0 0 0 0px #fff;
		}
	}
	.ivu-input-wrapper {
		width: auto;
		vertical-align: initial;
	}
}
</style>





