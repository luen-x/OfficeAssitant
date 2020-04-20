<template>
	<div class="v-hr-recruit-detail-info">
		<div class="g-flex g-fw-w g-jc-sb">
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">应聘职位</div>
				<span>{{ data.position_name }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">备选职位</div>
				<span>{{ data.alternative_position_name ? data.alternative_position_name : '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">面试官</div>
				<span>{{ data.interview_name? data.interview_name : '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">面试时间</div>
				<span>{{ data.interview_time }}</span>
			</div>

			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">是否干部</div>
				<span>{{ data.is_leader ? data.is_leader : '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">干部职位</div>
				<span>{{ data.leader_position ? data.leader_position : '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">邮箱</div>
				<span>{{ data.email ? data.email : '--' }}</span>
			</div>
			<div class="g-bb _label-item g-flex">
				<div class="__label-item-text">微信号</div>
				<span>{{ data.wechat ? data.wechat : '--' }}</span>
			</div>

			<div class="g-bb g-flex _file">
				<div class="__label-item-text">简历附件</div>
				<oa-upload
					v-if="data.resume.length"
					v-model="data.resume"
					disabled
					style="width: 300px"
					class="__upload"
				/>
				<span v-else>--</span>
			</div>
		</div>

</div></template>

<script>
import Upload from '@components/_common/upload/upload';
import { getHashUrl } from '@utils/utils';
import { Poptip } from 'iview';

const STATUS = ['', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];

export default {
	name: "oa-tpl",
	components: {
		"oa-upload": Upload,
		"i-poptip": Poptip
	},
	props: {
		data: {
			type: Object
		}
	},
	data() {
		return {
			STATUS
		};
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
.v-hr-recruit-detail-info {
	padding-bottom: 20px;
    ._label-item {
        width: 400px;
        height: 40px;
        line-height: 40px;
        margin-top: 10px;
		font-size: 12px;
		color: #333;
		.__label-item-text {
			width: 120px;
			color: #8b919c;
		}
	}
	._pass, ._leave, ._ticket, ._file {
		.__label-item-text {
			width: 120px;
			color: #8b919c;
		}
		.__remarks {
			width: 280px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	._pass, ._leave, ._file {
		width: 400px;
		line-height: 40px;
		min-height: 40px;
        margin-top: 10px;
		font-size: 12px;
		color: #333;
	}
	._file {
		.__upload {
			margin-top: 14px;
		}
	}
}
</style>
