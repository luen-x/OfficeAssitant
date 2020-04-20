<template>
	<div class="v-hr-recruit-entry-detail">
		<div class="g-flex g-jc-c">
			<oa-entry
				:info="info" />
		</div>

		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print-enter-talk :info="info" />
			</vc-print>
		</div>

		<div class="_footer g-flex-cc">
			<vc-debounce-click class="g-gray-btn-small" @click="handlePrint">打印</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Print } from 'wya-vc';
import PrintEnterTalk from '@components/hr/form/print/enter-talk';
import entryTalk from '@components/hr/_common/recruit-notes';

export default {
	name: 'oa-content',
	components: {
		'vc-print': Print,
		'oa-entry': entryTalk,
		'oa-print-enter-talk': PrintEnterTalk
	},
	data() {
		return {
			info: {}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_HR_FORM_ENTER_TALK_GET',
				type: "get",
				param: {
					depart_type: this.$route.query.depart_type,
					template_id: this.$route.query.template_id,
					applicant_id: this.$route.query.applicant_id,
				},
			}).then((res) => {
				this.info = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handlePrint() {
			this.$refs.pageTarget.print();
		}
	},
};
</script>

<style lang="scss" scoped>
.v-hr-recruit-entry-detail {
	._footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 60px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
</style>
