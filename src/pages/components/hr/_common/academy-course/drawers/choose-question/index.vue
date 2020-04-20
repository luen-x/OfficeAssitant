<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-hr-side-detail v-hr-academy-course-choose-question"
		@on-close="handleCancel"
		@click.native="closeDetail"
	>
		<oa-loading v-if="loading"/>
		<div
			class="_head-title"
			style="padding-bottom: 0px;padding-left:36px"
		>
			题库选题
		</div>
		<div class="g-pd-20">
			<oa-filter v-model="query" @search="handleSearch"/>
			<oa-list ref="list" :query="query" @save="handleSave"/>
		</div>
		
		<!-- <div style="height:60px"/> -->
		<!-- <div class="_footer">
			<i-button slot="extra" @click="handleSave">
				选好了
			</i-button>
		</div> -->
	</i-drawer>
</template>

<script>
import { Drawer, Button } from "iview";
import { CreatePortal } from "wya-vc";
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import { getHashUrl } from '@utils/utils';
import '../../../hr-side';
import Filter from './filter';
import List from './list';

export default {
	name: "c-hr-choose-question",
	components: {
		"i-drawer": Drawer,
		'oa-loading': Loading,
		'i-button': Button,
		'oa-filter': Filter,
		'oa-list': List
	},
	props: {
		paperId: Number
	},
	data() {
		return {
			visible: false,
			loading: false,
			query: {
				search: '',
				question_type: '',
				subject_id: '',
				subject_ids: []
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	beforeDestroy() {
	},
	methods: {
		handleOk(res) {
			this.visible = false;
			this.$emit("sure", res);
			this.closeDetail();
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
			this.closeDetail();

		},
		handleSave() {
			this.handleOk(this.$refs.list.selected);
		},
		handleSearch() {
			const table = this.$refs.list.$refs.tableTarget;
			this.$refs.list.handleResetFirst();
		},
		closeDetail(e) {
			this.$vc.emit('hr-academy-chooose-question-close');
		}
	}
};
export const ChooseQuestion = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss" >
</style>
