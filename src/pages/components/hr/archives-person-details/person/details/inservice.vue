<template>
	<div class="v-hr-archives-person-details-person-details-inservice">
		<oa-title title="在职信息" class="_title"/>
		<oa-loading v-if="!inServiceData.staff_number"/>
		<div class="_con">
			<oa-item label="工号">{{ inServiceData.staff_number }}</oa-item>
			<oa-item label="是否管理">{{ inServiceData.is_charge_name }}</oa-item>
			<oa-item label="角色">{{ inServiceData.role_name }}</oa-item>
			<oa-item label="兼部门">{{ inServiceData.extra_depart.length }}个</oa-item>
			<oa-item label="兼角色">{{ inServiceData.extra_role.length }}个</oa-item>
			<oa-item label="入职时间">{{ inServiceData.create_time }}</oa-item>
			<oa-item label="转正时间">{{ inServiceData.regular_time }}</oa-item>
			<oa-item label="转正申请单">
				<span
					v-if="$auth[203]"
					class="g-operation"
					@click="handleUrl(inServiceData.jump_regular_apply_url,1)"
				>
					查看
				</span>
				<span v-else style="cursor: not-allowed;color:#ACA899">查看</span>
			</oa-item>
			<oa-item label="转正面谈单">
				<span
					v-if="$auth[203]"
					class="g-operation"
					@click="handleUrl(inServiceData.jump_regular_interview_url,2)"
				>
					查看
				</span>
				<span v-else style="cursor: not-allowed;color:#ACA899">查看</span>
			</oa-item>
			<oa-item label="试用期">{{ inServiceData.try_time_name }}</oa-item>
			<oa-item label="座机号码">{{ inServiceData.tel }}</oa-item>
			<oa-item label="工龄">{{ inServiceData.work_day }}</oa-item>
			<oa-item label="管理工龄">{{ inServiceData.manager_day }}</oa-item>
			<oa-item label="坐席号">{{ inServiceData.seat_number }}</oa-item>
			<oa-item label="外线号码">{{ inServiceData.pstn_number }}</oa-item>
			<oa-item label="企业邮箱">{{ inServiceData.email }}</oa-item>
		</div>

	</div>

</template>

<script>
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { DatePicker } from "iview";
import API_ROOT from "@stores/apis/root";
import Loading from '@common/loading/loading';
import Title from "../../../_common/title";
import DetailItem from "../../common/detail-item";

export default {
	name: "oa-filter",
	components: {
		'oa-title': Title,
		"oa-item": DetailItem,
		'oa-loading': Loading,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			inServiceData: {
				staff_number: '',
				is_charge: '',
				role_name: '',
				extra_depart: [],
				extra_role: [],
				create_time: '',
				regular_time: '',
				try_time_name: '',
				tel: '',
				work_day: '',
				manager_day: '',
				seat_number: '',
				pstn_number: '',
				email: '',
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
					scenario: this.$route.query.scenario,
					type: 3
				},
				loading: false
			}).then(res => {
				this.inServiceData = res.data;
			}).catch(err => {});
		},
		handleUrl(val, type) {

			this.$router.push({ path: val + '&from=person', query: { type } });
		}
	}
};
</script>

<style lang="scss" >
.v-hr-archives-person-details-person-details-inservice{
	._title{
		margin-top: 40px;
	}
	._con{
		padding-left: 10px;
		width: 1000px;
	}
}
</style>