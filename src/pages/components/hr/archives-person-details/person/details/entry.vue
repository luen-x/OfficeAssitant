<template>
	<div class="v-hr-archives-person-details-person-details-entry">
		<oa-title title="基本信息" class="_title"/>
		<div class="_content">
			<oa-item label="民族" >{{ entryData.nation_name }}</oa-item>
			<oa-item label="婚否" >{{ entryData.is_married }}</oa-item>
			<oa-item label="招商银行卡号" >{{ entryData.bank }}</oa-item>
			<oa-item label="身份证号" >{{ entryData.id_card }}</oa-item>
			<oa-item label="职称/技能" >{{ entryData.school_job }}</oa-item>
			<oa-item label="公历生日" >{{ entryData.birthday }}</oa-item>
		</div>
		<oa-title title="学历证明" class="_title"/>
		<div class="_content">
			<oa-item label="证明方式" >{{ entryData.has_degree_prove }}</oa-item>
			<oa-item label="证明人" >{{ entryData.degree_witness }}</oa-item>
			<oa-item label="证明人手机" >{{ entryData.degree_witness_phone }}</oa-item>
		</div>
		<oa-title title="离职证明" class="_title"/>
		<div class="_content">
			<oa-item label="证明方式" >{{ entryData.has_leaving_prove }}</oa-item>
			<oa-item label="原公司名" >{{ entryData.leaving_witness_company }}</oa-item>
			<oa-item label="原公司地址" >{{ entryData.leaving_witness_address }}</oa-item>
			<oa-item label="直接上级" >{{ entryData.leaving_superior }}</oa-item>
			<oa-item label="直接上级手机号" >{{ entryData.leaving_superior_phone }}</oa-item>
		</div>
		<oa-title title="紧急联系人" class="_title"/>
		<div class="_content">
			<oa-item label="紧急联系人" >{{ entryData.important_name }}</oa-item>
			<oa-item label="与本人关系" >{{ entryData.important_relation }}</oa-item>
			<oa-item label="紧急联系人手机号" >{{ entryData.important_phone }}</oa-item>
			<oa-item label="工作单位" >{{ entryData.important_company }}</oa-item>
			<oa-item label="现住地址" >{{ entryData.important_address }}</oa-item>
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
			entryData: {
				nation_name: '',
				is_married: '',
				bank: '',
				id_card: '',
				school_job: '',
				birthday: '',
				has_degree_prove: '',
				degree_witness: '',
				degree_witness_phone: '',
				has_leaving_prove: '',
				leaving_witness_company: '',
				leaving_witness_address: '',
				leaving_superior: '',
				leaving_superior_phone: '',
				important_name: '',
				important_phone: '',
				important_company: '',
				important_address: '',
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
					type: 2
				},
				loading: false
			}).then(res => {
				this.entryData = { ...res.data };
			}).catch(err => {});
		},
	}
};
</script>

<style lang="scss" >
.v-hr-archives-person-details-person-details-entry{
	width: 1000px;
	._title{
		margin-top: 40px;
		margin-bottom:25px;
	}
	._content{
		padding-left: 10px;
	}
}
</style>