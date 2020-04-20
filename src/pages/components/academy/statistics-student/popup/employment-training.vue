<template>
	<div class="v-academy-statistics-training g-m-t-30 g-pd-lr-20">
		<i-table
			:columns="columns"
			:data="preTrain"
			:no-data-text="noDateText"
			stripe
		/>
	</div>
</template>

<script>
import { Table } from "iview";
import { OSS_SEARCH_EMPTY } from '@constants/constants';

export default {
	name: "academy-statistics-student",

	components: {
		"i-table": Table
	},

	props: {
		staffId: Number,
		applicantId: Number
	},

	data() {
		return {
			preTrain: [],
			columns: [
				{
					title: "课程名称",
					key: "course_name",
					minWidth: 220
				},
				{
					title: "授课时间",
					key: "start_time",
					minWidth: 160
				},
				{
					title: "授课讲师",
					key: "lecture",
					minWidth: 120
				}
			],
			noDateText: `
				<div class="g-m-tb-20 g-flex" style="justify-content: space-evenly;" >
					<div>
						<div>
							<img style="width:200px;" src="${OSS_SEARCH_EMPTY}" />
						</div>
						<div>
							暂无数据
						</div>
					</div>
				</div>`
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.$request({
				url: "_ACADEMY_STATISTICS_STUDENT_PRE_TRAIN_GET",
				type: "GET",
				param: {
					staff_id: this.staffId || 0,
					applicant_id: this.applicantId || 0
				},
				loading: false
			}).then(res => {
				this.preTrain = res.data.list;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-academy-statistics-training{
    .ivu-table th {
		font-weight: normal;
	}

	.ivu-poptip-rel{
		display: inline;
	}

    .ivu-table-wrapper {
		border: none;
	}

	.ivu-table {
		th,td {
			border: none;
		}
	}

	.ivu-table:after {
		width: 0;
	}

	.ivu-table:before {
		height: 0;
	}
}
</style>