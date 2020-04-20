<template>
	<div class="v-content-rules-sale-customer-edit">
		<oa-edit-item
			ref="private"
			:edit-show="private_fields.edit_show"
			:edit-hide="private_fields.edit_hide"
			class="g-m-t-10"
			title="意向客户/成交客户/关联客户编辑"/>
		<oa-edit-item
			ref="normal"
			:edit-show="normal_fields.edit_show"
			:edit-hide="normal_fields.edit_hide"
			class="g-m-t-20"
			title="公海客户/黑名单编辑"/>
		<footer >
			<vc-debounce-click style="display: inline-block;" class="g-red-btn-small" @click="handleSubmit">提交</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import EditItem from './_common/edit-item';

export default {
	components: {
		'oa-edit-item': EditItem
	},
	data() {
		return {
			private_fields: {
				edit_show: [],
				edit_hide: []
			},
			normal_fields: {
				edit_show: [],
				edit_hide: []
			},
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			return this.$request({
				url: "_CONTENT_SYSTEM_SALE_CUSTOMER_EDIT_CONFIG_GET",
				type: 'GET',
				param: { type: 1 }
			}).then((res) => {
				this.private_fields = res.data.private_fields;
				this.normal_fields = res.data.normal_fields;

			}).catch(err => {
				this.$Message.error(err.msg);
			});




		},
		handleSubmit() {
			let normal_fields = [];
			let private_fields = [];
			private_fields = this.$refs.private.edit_show.map(ele => ele.key);
			normal_fields = this.$refs.normal.edit_show.map(ele => ele.key);
			this.$request({
				url: "_CONTENT_SYSTEM_SALE_CUSTOMER_EDIT_CONFIG_SAVE_POST",
				type: 'post',
				param: { normal_fields, private_fields }
			}).then((res) => {
				this.$Message.success(res.msg);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

<style  lang="scss">
.v-content-rules-sale-customer-edit{
	position: relative;
	height: 100%;
	footer {
		position: absolute;
		bottom: 0;
		z-index: 2;
		text-align: center;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		line-height: 60px;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
</style>
