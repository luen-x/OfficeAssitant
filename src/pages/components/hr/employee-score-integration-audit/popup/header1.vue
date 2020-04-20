<template>
	<div class="v-hr-drawer-head">
		<div class="_detail-header">
			{{ info.staff_name }}
		</div>
		<div class="g-flex g-fw-w g-m-t-20">

			<span class="_item">
				<span>手机号码：</span>
				<span>{{ info.mobile }}</span>
			</span>
			<span class="_item">
				<span>所属部门：</span>
				<span>{{ info.depart_name }}</span>
			</span>
			<span class="_item">
				<span>职位：</span>
				<span>{{ info.position_name }}</span>
			</span>
			<span class="_item">
				<span>总积分：</span>
				<span>{{ info.total_points }}</span>
			</span>
			<span class="_item">
				<span>总服务积分：</span>
				<span>{{ info.total_service_points }}</span>
			</span>
			<span v-if="0" class="_item">
				<span>总服务积分上限：</span>
				<span>{{ info.work_day||40 }}
					<i-poptip trigger="hover" placement="bottom">
						<i class="iconfont icon-question "/>
						<div slot="content">
							<div>积分上限:</div>
							<div>{{ info.staff_limit_total_points }}</div>
							<div>{{ info.base_limit_total_points }}</div>
							<div>{{ info.consult_limit_total_points }}</div>
							<div>{{ info.return_limit_total_points }}</div>
							<div>{{ info.satisfied_limit_total_points }}</div>
						</div>
					</i-poptip>
				</span>
			</span>
		</div>
	</div>
</template>

<script>
import { Poptip } from 'iview';

export default {
	name: 'hr-drawer-head',
	components: {
		'i-poptip': Poptip
	},
	props: {
		name: String,
		staffId: Number,
		info: Object,
	},
	data() {
		return {

		};
	},
	watch: {
		staffId() {

		}
	},
	mounted() {

	},
	methods: {
		loadData() {
			this.$request({
				url: 'HR_EMPLOYEE_DATA_STAFF_SERVICE_GET',
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