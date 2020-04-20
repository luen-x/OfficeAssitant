<template>
	<div class="v-archives-person-details-mindset g-flex g-fd-c">
		<div >
			<i-button style="width: 60px" type="primary" class="g-m-l-10" @click="handleAddModal">添加</i-button>
			<oa-item :data="itemData"/>
		</div>
		<div class="g-fr">
			<i-page :total="itemData.totalPage*10" class="_footpage g-m-t-20 " @on-change="handlePage" />
		</div>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Page, Button } from "iview";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
import LimitWords from '@components/_common/limit-words/limit-words';
// item
import item from './item';
import { AddModal } from "./popup/add";

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'oa-item': item,
		'oa-limit-words': LimitWords,
		'i-page': Page,
		'i-button': Button,
	},
	data() {
		const { query } = this.$route;
		return {
			itemData: {},
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.$request({
				url: '_HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_FOLLOW_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: 3,
					page,
					pageSize: 6
				},
			}).then((res) => {
				this.itemData = res.data;
			}).catch((error) => {
				console.error(error);
			});
		},
		handlePage(val) {
			this.loadData(val);
		},
		handleAddModal() {
			AddModal.popup({
				applicant_id: this.$route.query.applicant_id
			}).then(res => {
				this.loadData();
			}).catch(err => {
			});
		}
	}
};

</script>

<style lang="scss">
.v-archives-person-details-mindset{
	background-color: #fafafa;
	overflow-y: auto;
	padding: 10px;
	._footpage{
		position: relative;
		float:right;
		right:30px
	}
}
</style>
