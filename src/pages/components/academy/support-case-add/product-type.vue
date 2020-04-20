<template>
	<div class="v-academy-support-case-add-product-type">
		<div v-if="!data.inEdit" class="_type-item" @click="handleClickName">
			<span class="g-fs-12 g-m-t-10 g-m-r-10">{{ data.product_type_name }} </span>
			<i class="icon iconfont icon-clear g-fs-12 g-pointer" @click="handleDelete"/>
			
		</div>
		<div v-else class="_type-input">
			<i-input
				ref="input"
				v-model="data.product_type_name"
				:clearable="false"
				:maxlength="10"
				placeholder="类型名称"
				style="width:100px"
				@on-enter="handleEnter"
				@on-blur="handleBlur"
			/>
		</div>
	</div>
</template>
<script>
import { Input, Button } from 'iview';

export default {
	name: 'oa-academy-product-type',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	props: {
		data: Object

	},
	data() {
		return {

		};
	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.input && this.$refs.input.focus();
		});

	},
	methods: {
		handleBlur() {
			if (this.data.inEdit == false) return;
			if (this.data.product_type_name) {
				this.saveType();

			} else if (this.data.product_type_id) {
				this.deleteType();
			} else {
				this.$emit('delete', this.data.product_type_id);
			}
		},
		handleEnter() {
			if (this.data.product_type_name) {
				this.saveType();

			} else {
				this.$Message.warning('请填写类型名称');
			}
		},
		saveType() {
			this.$request({
				url: "_ACADEMY_SUPPORT_CASE_PRODUCT_TYPE_SAVE_POST",
				type: "POST",
				param: {
					product_type_name: this.data.product_type_name,
					industry_id: this.data.industry_id,
					product_type_id: this.data.product_type_id
				},
				loading: false,
			}).then(res => {
				this.data.product_type_id = res.data.product_type_id;
				this.data.inEdit = false;
				this.$Message.success('保存成功');
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		deleteType() {
			this.$request({
				url: "_ACADEMY_SUPPORT_CASE_PRODUCT_TYPE_DELETE_POST",
				type: "POST",
				param: {
					product_type_id: this.data.product_type_id
				},
				loading: false,
			}).then(res => {
				this.$emit('delete', this.data.product_type_id);
				this.$Message.success('删除成功');
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleDelete(event) {
			event.stopPropagation();
			this.deleteType();
		},
		handleClickName() {
			this.data.inEdit = true;
			this.$nextTick(() => {
				this.$refs.input && this.$refs.input.focus();

			});
			
		}
	}
};
</script>
<style lang="scss">
.v-academy-support-case-add-product-type {
	display: inline-block;
	margin-right: 10px;
	margin-bottom: 10px;
	._type-item {
		background: #e84854;
		border-radius: 3px;
		padding: 4px 8px;
		color: white;

	}


}
</style>