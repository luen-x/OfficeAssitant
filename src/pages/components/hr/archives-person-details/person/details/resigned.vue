<template>
	<div class="g-m-b-20 v-hr-archives-person-details-resigned">
		<oa-title title="离职信息"/>
		<div class="_content">
			<oa-item label="离职日期">{{ resignedData.leave_time }}</oa-item>
			<oa-item label="离职申请单">
				<span
					class="g-operation"
					@click="handleUrl(resignedData.jump_leave_apply_url)"
				>
					查看
				</span>
			</oa-item>
			<oa-item label="离职面谈单">
				<span
					class="g-operation"
					@click="handleUrl(resignedData.jump_leave_interview_url)"
				>
					查看
				</span>
			</oa-item>
		</div>

	</div>

</template>

<script>
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { DatePicker } from "iview";
import API_ROOT from "@stores/apis/root";
import Title from "../../../_common/title";
import DetailItem from "../../common/detail-item";

export default {
	name: "oa-filter",
	components: {
		'oa-title': Title,
		"oa-item": DetailItem,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			resignedData: {
				leave_time: '',
				jump_leave_apply_url: '',
				jump_leave_interview_url: '',
			}
		};
	},
	mounted() {
		this.loadBaseInfo();
	},
	methods: {
		loadBaseInfo() {
			this.$request({
				url: API_ROOT._HR_ARCHIVES_PERSON_DETAIL_PERSON_PERSON_GET,
				type: "GET",
				param: {
					staff_id: this.$route.query.staff_id,
					type: 5,
					scenario: this.$route.query.scenario
				},
				loading: false
			}).then(res => {
				this.resignedData = res.data;
			}).catch(err => {});
		},
		handleUrl(val) {
			this.$router.push(val + '&from=person');
		}
	}
};
</script>

<style lang="scss" >
.v-hr-archives-person-details-resigned{
	margin-top: 40px;
	width: 1000px;
	._content{
		padding-left: 10px;
	}
}
</style>