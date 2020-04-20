<template>
	<div v-if="!loading || isFetched" class="v-hr-recruit-summary-info">
		<div class="g-flex _content">
			<oa-form-info
				:info="info.details"
				:on-refresh="loadData"
				:toggle="handleToggle"
				class="_left"
			/>
			<oa-remarks
				:data-source="info.content"
				:record="info.applicant_log"
				:on-refresh="loadData"
				class="_right"
			/>
			<oa-switch-bar
				v-if="status == 'look' && showSwitch"
				:next="info.details.next"
				:prev="info.details.prev"
				:on-refresh="loadData"
			/>
		</div>
	</div>
	<div v-else class="g-flex-cc v-loading">
		<i-spin fix/>
	</div>
</template>

<script>
import { Spin } from 'iview';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';
import FormInfo from './form-info';
import Remarks from './remarks';
import SwitchBar from './switch-bar';

export default {
	name: 'oa-tpl',
	components: {
		'oa-form-info': FormInfo,
		'oa-remarks': Remarks,
		'i-spin': Spin,
		'oa-switch-bar': SwitchBar
	},
	props: {
		toggle: Function,
		showSwitch: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			info: {
				content: [],
				details: {}
			},
			loading: false,
			isFetched: false,
			status: 'look'
		};
	},
	created() {
		this.loadData(true);
	},
	methods: {
		handleToggle(status) {
			this.status = status;
			this.toggle(status);
		},
		loadData(reLoad) {
			this.loading = true;
			this.isFetched = !reLoad;
			this.$request({
				url: API_ROOT['_HR_RECRUIT_APPLICANT_DETAIL_GET'], // eslint-disable-line
				type: "GET",
				param: {
					applicant_id: this.$route.params.id,
					is_talent: this.$route.params.type === 'talent' ? 1 : 0,
					...this.$route.query,
				},
				loading: false
			}).then((res) => {
				const { content, applicant_log, ...rest } = res.data;
				this.loading = false;
				this.isFetched = true;
				this.info.content = content;
				this.info.details = rest;
				this.info.applicant_log = applicant_log;
			}).catch((error) => {
				this.isFetched = true;
				this.$Message.error(error.msg);
			});
		},
	},
};
</script>

<style lang="scss">
.v-loading {
	background: #ffffff22;
	width: 100%;
	height: 450px;
}
.v-hr-recruit-summary-info {
	// position: relative;
	height: inherit;
	overflow: auto;
	padding: 40px 20px 40px 40px;
	._content {
		height: inherit;
		._left {
			height: inherit;
			flex: 6;
			padding: 5px 10px 0 5px;
		}
		._right {
			height: inherit;
			flex: 4;
		}
		._toggle {
			color: #c4c4c4;
			font-size: 40px;
			z-index: 999;
		}
		._prev {
			@extend ._toggle;
			position: fixed;
			left: 200px;
			top: 50%;
			margin-top: -20px;
		}
		._next {
			@extend ._toggle;
			position: fixed;
			right: 20px;
			top: 50%;
			margin-top: -20px;
		}
	}
}
</style>
