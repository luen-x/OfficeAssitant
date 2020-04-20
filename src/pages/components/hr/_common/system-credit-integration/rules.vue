<template>
	<div>
		<oa-item 
			:info="editInfo.new" 
			:show-edit="false" 
			:type="type" 
			class="g-m-b-20"
			@load="loadRules" />
		<oa-item 
			:info="editInfo.next" 
			:show-edit="true" 
			:type="type" 
			@reset="handleReset"
			@load="loadRules"/>
	</div>
</template>

<script>
import Item from "./rules-item";

export default {
	name: 'system-rules',
	components: {
		'oa-item': Item
	},
	props: {
		type: String
	},
	data() {
		const { query } = this.$route;
		return {
			query,
			editInfo: {
				new: {
					types: [
						{
							rule_info: [
								{
									rules: [{}],
									relate_info: {}
								}
							]
						}
					]
				},
				next: {
					types: [
						{
							rule_info: [
								{
									rules: [{}],
									relate_info: {}
								}
							]
						}
					]
				}
			}
		};
	},
	mounted() {
		this.loadRules();
	},
	methods: {
		loadRules() {
			this.$request({
				url: '_HR_SYSTEM_ASSESS_CREDITINTE_EDIT_INFO_GET',
				type: 'GET',
				param: {
					...this.query,
					need_rule: 1
				},
				loading: false
			}).then(res => {
				this.editInfo = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleReset() {
			this.$request({
				url: '_HR_SYSTEM_ASSESS_CREDITINTE_RESET_POST',
				type: 'GET',
				param: {
					cate: this.type,
					...this.query
				},
			}).then(res => {
				this.$Message.success(res.msg);
				this.loadRules();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

<style lang="scss" scoped>

</style>


