<template>
	<div class="c-academy-elite-settin-input">
		<div v-if="showEdit" style="height: 32px;">
			<i-input
				ref="input"
				v-model="purpose"
				:maxlength="500"
				:autofocus="true"
				style="width: 95%; padding-bottom: 2px"
				@on-blur="handleBlur"/>
			<span 
				class="g-c-blue-mid g-fr g-pointer"
				@click="handleBlur">保存</span>
		</div>
		<div v-else>
			<span>宗旨：</span>
			<span class="g-pd-r-5">{{ value }}</span>
			<i 
				class="g-fr icon iconfont icon-bianji g-fs-16 g-c-black-dark g-pointer" 
				style="color: rgb(153, 153, 153); vertical-align: middle;"
				@click="handleShowEdit"
			/>
			<!-- <i-icon
				:size="16"
				class="g-fr"
				style="cursor: pointer; margin-top: 5px"
				type="md-create"
				@click="handleShowEdit"/> -->
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
		depart_id: String | Number
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
				this.data.showEdit = false;
				this.showEdit = true;
				return;
			}

			this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_TALENT_SETTING_PURPOSE_POST,
				type: "POST",
				param: {
					depart_id: this.depart_id,
					purpose: this.purpose
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.showEdit = false;
				this.$emit('input', this.purpose);
			}).catch(err => {
				this.$Message.error(err.msg);
				this.$refs.input.focus();
			});
		}
	}
};
</script>

<style lang="scss">
.c-academy-elite-settin-input {
	width: 100%;
	line-height: 32px;
	padding: 0 20px;
	background: rgba(244, 154, 88, 0.05);
	color: #F49A58;
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
}
</style>





