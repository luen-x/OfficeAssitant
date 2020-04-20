<template>
	<div >
		<oa-supermanager v-if="status.is_charge==1"/>
		<oa-staff v-else-if="status.depart_is_charge==0"/>
		<oa-manager v-else-if="status.depart_is_charge==1&&status.depart_lowest==1"/>
		<oa-chief v-else-if="status.depart_is_charge==1&&status.depart_lowest==0"/>
	</div>
</template>

<script type="text/ecmascript-6">
import moment from 'moment';
import API from '@stores/apis/root';
import staff from './staff';
import manager from './manager';
import chief from './chief';
import supermanager from './super-manager';

export default {
	components: {
		"oa-staff": staff,
		"oa-manager": manager,
		"oa-chief": chief,
		"oa-supermanager": supermanager,

	},
	data() {
		return {
			status: '',
			month: moment().format('YYYY-MM'),
		};
	},
	mounted() {
		this.$request({
			url: API._SALE_MAIN_DATA_ACHIEVEMENT_GET,
			type: "get",
			param: {
				month: this.month
			}
		}).then(res => {
			this.$emit("load");
		}).catch(error => {
			console.error(error);
		});
	},
	created() {
		this.status = this.$global.staff;
	}
};
</script>

<style lang="">
</style>
