<template>
	<div class="c-academy-elite-manage-input" @click.stop="() => {}">
		<div v-if="showEdit" class="g-dp-ib">
			<i-input
				ref="input"
				v-model="value.subject_name"
				:maxlength="30"
				:autofocus="true"
				class="g-dp-ib"
				@on-blur="handleBlur"
			/>
			<span 
				class="g-c-blue-mid g-pointer"
				@click="handleBlur">保存</span>
		</div>
		<div v-else class="g-dp-ib __item">
			<span class="__value" >{{ value.subject_name }}</span>
			<span class="__icon">
				<i 	
					v-if="$auth[1098]"
					:style="{ verticalAlign: 'center' }"
					class="icon iconfont icon-remove-circle g-c-red-light g-fs-18"
					title="删除课题"
					@click="handleDelete"
				/>
				<i 
					v-if="$auth[1097]"
					:style="{ verticalAlign: 'center', color: '#ED8F4A', marginLeft: '5px' }"
					class="icon iconfont icon-bianji g-fs-18 g-pointer"
					title="编辑课题名称"
					@click="handleShowEdit"/></span>
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
		value: Object,
		handleDelete: Function
	},
	data() {
		return {
			showEdit: false
		};
	},
	methods: {
		handleShowEdit() {
			this.showEdit = true;
			this.$nextTick(() => {
				this.$refs.input.focus();
			});
		},
		handleBlur() {
			if (!this.value.subject_name) {
				this.$Message.error('不能为空！');
				this.$refs.input.focus();
				return;
			}
			this.showEdit = false;
			this.$emit('input', this.value.subject_name);
		}
	}
};
</script>

<style lang="scss">
.c-academy-elite-manage-input {
	display: inline-block;
	padding-left: 5px;
	.ivu-input {
		border: none;
		padding: 3px 0 0 0;
		height: auto;
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
		margin-left: -5px;
	}
	.__item {
			display: inline-block;
			width: 100%;
			height: 20px;
			line-height: 20px;
			cursor: pointer;
			&:hover {
				.__icon {
					display: inline;
				}
				.__value {
					background-color: rgba(35, 151, 249, 0.1);
				}
			}
			.__value {
				padding: 2px 10px 2px 10px;
				display: inline-block;
				margin-left: -15px;
			}
			.__icon {
				display: none;
				opacity: 0.5;
				transition: 1s all;
				padding-left: 5px;
				&:hover {
					opacity: 1;
				}
			}
		}
}
</style>





