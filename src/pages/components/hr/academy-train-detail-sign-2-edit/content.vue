<template>
	<div class="v-hr-academy-train-sign-add">
		<oa-add-sign ref="sign"/>
	</div>
</template>

<script>
import API_ROOT from '@stores/apis/root';
import addSign from '../academy-train-detail-sign-1-add/common/add-edit-sign';

export default {
	name: 'oa-tpl',
	components: {
		'oa-add-sign': addSign
	},
	data() {
		return {
			visible: false,
		};
	},
	mounted() {
		this.visible = true;
	},
	created() {
	},
	methods: {
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSubmit() {
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (valid) {
					this.$emit('sure');
				} else {
					this.$refs.modal.buttonLoading = false;
					this.visible = true;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
