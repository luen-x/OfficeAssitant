<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-hr-side-detail v-hr-academy-course-choose-question"
		@on-close="handleCancel"
		@click.native="closePaperDetail"
	>
		<oa-loading v-if="loading"/>
		<div
			class="_head-title"
			style="padding-bottom: 0;padding-left:36px"
		>
			选择试卷模板
		</div>
		<div class="g-pd-20">
			<oa-filter v-model="query" @search="handleSearch"/>
			<oa-list ref="list" :query="query" @event="handleSave"/>
		</div>
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
				paper_type: '',
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
			this.closePaperDetail();
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
			this.closePaperDetail();

		},
		handleSave: debounce(function () {
			if (!this.$refs.list.selectedPaper) {
				this.$Message.error("请选择试卷");
				return;
			}
			this.handleOk(this.$refs.list.selectedPaper);
		}, 100),
		handleSearch() {
			const table = this.$refs.list.$refs.tableTarget;
			this.$refs.list.handleResetFirst();
		},
		closePaperDetail(e) {
			this.$vc.emit('hr-academy-chooose-paper-close');
		}
	}
};
export const ChoosePaper = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss" >


</style>
