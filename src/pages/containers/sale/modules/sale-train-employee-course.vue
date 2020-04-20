<template>
	<set-title
		:routes="routes"
		title="计划课程查看"
		class="g-tabs-card v-sale-train-emplayee-course"
		style="padding: 20px"
	>
		<div class="_head">
			<oa-train-employee-detail-head
				:staff-id="$route.query.staff_id"
				:applicant-id="$route.query.applicant_id"
			/>
		</div>
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import List from '@components/sale/train-employee-course/list';
import Filter from '@components/sale/train-employee-course/filter';
import { TrainEmployeeDetailHead } from "@components/sale/train-employee/popup/detail-head";
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-train-employee-course',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
		'oa-train-employee-detail-head': TrainEmployeeDetailHead,
	},
	mixins: [navigator('SALE_TRAIN_EMPLOYEE_COURSE')],
	data() {
		return {
			routes: [
				{
					path: '',
					name: '计划课程查看'
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
.v-sale-train-emplayee-course {
	._head {
		width: 60%;
		margin: 20px auto;
		border: 1px solid #e8e8e8;
		box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
	}
}
</style>
