<template>
	<div class="v-hr-recruit-school-summary-detail-remarks">

		<div class="_title g-flex g-ai-c g-fs-14">
			<span class="g-bg-red-mid g-m-r-10" />备注信息
		</div>

		<div
			class="_content g-m-t-20"
			style="marginLeft: 12px;">
			<oa-steps
				:type="1"
				:data-source="dataSource"
				:render-title="renderTitle"
				:render-content="renderContent"
				class="g-m-l-20 _steps"
			/>
		</div>
		<!-- <div
			v-for="(item, index) in dataSource"
			:key="index"
			class="g-flex">
			<div
				class="g-c-black2 g-fs-14"
				style="white-space: nowrap;min-width: 70px;">
				{{ item.status_name }}:
			</div>
			<oa-steps
				:type="1"
				:data-source="[item]"
				:render-title="renderTitle"
				:render-content="renderContent"
				class="g-m-l-20 _steps"
			/>
		</div> -->

	</div>
</template>

<script>
import { Button, Switch } from 'iview';
import { DebounceClick } from "wya-vc";
import API_ROOT from '@stores/apis/root';
import { getParseUrl } from '@utils/utils';
import Steps from '@components/_common/steps/steps';

export default {
	name: "oa-tpl",
	components: {
		'i-button': Button,
		'oa-steps': Steps
	},
	props: {
		dataSource: {
			type: Array,
			default() {
				return [];
			}
		},
		onRefresh: Function
	},
	data() {
		return {
			msg: ''
		};
	},
	computed: {
		isShow() {
			const { query } = getParseUrl();
			let flag = true;
			if (query.list_type == 'try-data-detail-index'
				|| query.list_type == 'lecture-course-detail-index') {
				flag = false;
			} else if (query.list_type == 'transport' && query.tabType != '6') {
				flag = false;
			}
			return flag;
		}
	},
	methods: {
		renderTitle(h, params = {}) {
			const { staff_name, status_name } = params.rows;
			return (
				<div style="position: relative">
					<div
						class="g-c-black2 g-fs-14"
						style="white-space: nowrap;min-width: 70px;position: absolute;left: -80px;">
						{status_name }:
					</div>
					<div class="g-flex g-jc-sb g-ai-c _item">
						<div class="g-fs-14 g-m-l-10" style="color: #666;">{staff_name}</div>
					</div>
				</div>

			);
		},
		renderContent(h, params = {}) {
			const { create_time, content } = params.rows;
			return (
				<div class="_desc">
					<div class="g-fs-14 g-c-black2 g-m-l-10">{content}</div>
					<div class="g-c-black4 g-pd-t-5 g-pd-b-20 g-m-l-10 g-nobreak">{create_time}</div>
				</div>
			);
		},
		handleSwitch(row, e) {
			this.$request({
				url: API_ROOT['_HR_RECRUIT_SCHOOL_SUMMARY_IS_MANAGER_REMARK_POST'],
				type: 'POST',
				param: {
					remark_id: row.remark_id,
					is_show_manager: e
				},
				loading: false
			}).then((res) => {
				this.onRefresh && this.onRefresh(false);
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
	}
};
</script>

<style lang="scss">
.v-hr-recruit-school-summary-detail-remarks {
	display: flex;
    flex-direction: column;
	// position: relative;
	min-width: 300px;
	height: 100%;
	padding-left: 40px;
	padding-right: 20px;
    ._title {
        span {
            display: inline-block;
            width: 2px;
            height: 14px;
        }
	}
	._content {
		flex: 1;
		overflow-y: auto;
		._steps {
			word-break: break-all;
			margin-left: 70px;
		}
	}
	// ._footer {
	// 	position: absolute;
	// 	bottom: 0px;
	// }
}
</style>
