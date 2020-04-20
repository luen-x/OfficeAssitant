<template>
	<div class="hr-recruit-school-summary-detail-remarks">

		<div class="_title g-flex g-ai-c g-fs-14">
			<span class="g-bg-red-mid g-m-r-10" />备注信息
		</div>

		<div
			class="_content g-m-t-20"
			style="marginLeft: 12px;">

			<div
				v-for="(item, index) in dataSource"
				:key="index"
				class="g-flex">
				<div
					v-if="item.remarks_info && item.remarks_info.length"
					class="g-c-black2 g-fs-14"
					style="white-space: nowrap;min-width: 70px;">
					{{ item.status_name }}:
				</div>
				<oa-steps
					v-if="item.remarks_info && item.remarks_info.length"
					:type="1"
					:data-source="item.remarks_info"
					:render-title="renderTitle"
					:render-content="renderContent"
					class="g-m-l-20 _steps"
				/>
			</div>

		</div>
		<div v-if="$auth[157] && isShow" class="g-m-tb-20" style="padding-left: 100px;">
			<oa-limit-words
				v-model="msg"
				:max="500"
				placeholder="添加备注"
				width="300px" />
			<vc-debounce-click
				style="width: 85px"
				class="g-red-btn g-m-t-20"
				@click="handleAdd">
				确认添加
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Button, Switch } from 'iview';
import { DebounceClick } from "wya-vc";
import API_ROOT from '@stores/apis/root';
import { getParseUrl } from '@utils/utils';
import Steps from '@components/_common/steps/steps';
import { delPModal } from './popup/delete';
import { editPModal } from './popup/edit';

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
			} else if (query.list_type == 'transport' && query.tabType + '' !== '6') {
				flag = false;
			}
			return flag;
		}  
	},
	methods: {
		renderTitle(h, params = {}) {
			const { staff_name } = params.rows;
			return (
				<div class="g-flex g-ai-c _item">
					<div class="g-fs-14 g-m-l-10" style="color: #666;min-width: 180px;">{staff_name}</div>
					{ this.isShow && <span class="g-c-blue-mid g-pointer _action">
						<span class="g-m-r-5" onClick={() => this.handleEdit(params.rows)}>编辑</span>
						<span onClick={() => this.handleDelete(params.rows)}>删除</span>
					</span>}
					{
						<Switch 
							value={params.rows.is_show_manager}
							trueValue={1}
							falseValue={0}
							size="small" 
							class="g-m-l-5"
							onOn-change={(e) => this.handleSwitch(params.rows, e)}>
						</Switch>
					}
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
		// 编辑备注
		handleEdit(sed) {
			editPModal.popup({
				info: { ...sed, isSchool: true }
			}).then(res => {
				this.onRefresh && this.onRefresh(false);
			}).catch(err => {});
		},
		// 删除备注
		handleDelete(sed) {
			delPModal.popup({
				info: { ...sed }
			}).then(res => {
				this.onRefresh && this.onRefresh(false);
			}).catch(err => {});
		},
		// 添加备注
		handleAdd() {
			this.$request({
				url: API_ROOT['_HR_RECRUIT_SCHOOL_SUMMARY_ADD_MSG_POST'],
				type: 'POST',
				param: {
					applicant_id: this.$route.params.id,
					remarks: this.msg
				},
				loading: false
			}).then((res) => {
				this.onRefresh && this.onRefresh(false);
				this.msg = '';
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
	}
};
</script>

<style lang="scss">
.hr-recruit-school-summary-detail-remarks {
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
		}
	}
	// ._footer {
	// 	position: absolute;
	// 	bottom: 0px;
	// }
}
</style>
