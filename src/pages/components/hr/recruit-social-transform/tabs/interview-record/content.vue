<template>
	<div class="v-hr-interview-record">
		<oa-line :record="record"/>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import moment from 'moment';
import line from './line';

export default {
	name: 'oa-interview-record',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
		'oa-line': line
	},
	data() {
		const { query } = this.$route;
		return {
			record: {}
		};
	},
	watch: {
		$route(to, from) {
			this.fetchData();
		}
	},
	created() {},
	mounted() {
		this.fetchData();
	},
	methods: {
		fetchData() {
			const { query } = this.$route;
			this.$request({
				url: 'HR_RECRUIT_INTERVIEWER_RECORD_GET',
				type: 'GET',
				param: {
					...query,
				},
				loading: false
			}).then((res) => {
				this.record = res.data;
			}).catch((error) => {
			});
		},
	}
};
</script>

<style lang="scss">

</style>

