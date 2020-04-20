<template>
	<div class="v-hr-drawer-head">
		<div class="_detail-header">
			{{ name }}情况
		</div>
		<div class="g-flex g-fw-w g-m-t-20">
			<span class="_item">
				<span>服务人：</span>
				<span>{{ info.staff_name }}</span>
			</span>
			<span class="_item">
				<span>手机号码：</span>
				<span>{{ info.mobile }}</span>
			</span>
			<span class="_item">
				<span>员工工号：</span>
				<span>{{ info.staff_number }}</span>
			</span>
			<span class="_item">
				<span>所属部门：</span>
				<span>{{ info.depart_name }}</span>
			</span>
			<span class="_item">
				<span>员工职位：</span>
				<span>{{ info.position_name }}</span>
			</span>
			<span class="_item">
				<span>员工工龄：</span>
				<span>{{ info.work_day }}</span>
			</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'hr-drawer-head',
	props: {
		name: String,
		staffId: Number
	},
	data() {
		return {
			info: {}
		};
	},
	watch: {
		staffId() {
			this.loadData();
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_HR_EMPLOYEE_SUMMARY_DETAILS_JOB_INFO_GET',
				type: 'POST',
				param: {
					staff_id: this.staffId
				},
				loading: false
			}).then(res => {
				this.info = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.v-hr-drawer-head {
	width: 100%;
	._item {
		width: 33.3%;
		margin-bottom: 20px;
	}
}
</style>


