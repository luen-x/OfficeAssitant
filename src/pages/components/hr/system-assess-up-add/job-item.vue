<template>
	<div class="v-system-assess-up-job-item">
		<div v-if="arr.length === 0" class="g-m-b-20">
			<span>职位设置：</span>
			<span 
				v-if="$auth[1149]"
				class="g-red-btn-line" 
				@click="handleAdd">新增职位</span>
		</div>
		<div v-else class="_item g-m-b-20">
			<div class="_title">
				职位设置
			</div>
			<div class="g-pd-lr-20">
				<i-row 
					v-for="(item, index) of arr" 
					:key="index" 
					class="_border g-pd-tb-15 g-ai-c">
					<i-col span="6">
						<div class="g-m-r-30 g-flex g-jc-sb">
							<div>{{ item.position_name }}</div>
							<!-- <div>评定周期：xxxxx | 评定基准期：xxx</div> -->
						</div>
					</i-col>
					<i-col span="14">
						<div class="g-flex g-ai-c">
							<div class="_middle">
								<div 
									v-for="(info, i) of item.calculate_role"
									:key="i"
									class="g-m-tb-5"
								>核算角色：{{ info.role_name }}</div>
							</div>
							<div class="g-m-l-30">
								<div 
									v-for="(info, i) of item.calculate_role"
									:key="i"
									class="g-m-tb-5"
								>部门提成：{{ info.name }}</div>
							</div>
						</div>
					</i-col>
					<i-col span="4">
						<div>
							<span class="g-operation" @click="(e) => handleAdd(e,item)">修改</span>
							<i-divider type="vertical"/>
							<span class="g-operation" @click="() => handleDel(item.position_id)">删除</span>
						</div>
					</i-col>
				</i-row>
			</div>
			<div class="g-pd-15">
				<span 
					class="g-red-btn-line" 
					@click="handleAdd">新增职位</span>
			</div>
		</div>
	</div>
</template>

<script>
import { Row, Col, Divider } from 'iview';
import { ConfirmModal } from '@components/hr/_common/popup/confirm';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { cloneDeep } from 'lodash';

import { JobModal } from './popup/job';

export default {
	name: 'oa-system-assess-up-add-item',
	components: {
		'i-row': Row,
		'i-col': Col,
		'i-divider': Divider,
	},
	props: {
		label: String,
		btnLabel: String
	},
	data() {
		const { query = {} } = getParseUrl();
		return {
			arr: [],
			first_depart_id: query.first_depart_id,
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		handleAdd(e, position_info) {
			position_info = position_info && cloneDeep(position_info);
			JobModal.popup({
				depart_id: this.first_depart_id,
				position_info
			}).then(res => {
				this.loadData();
			}).catch(err => {
			});
		},
		handleDel(position_id) {
			ConfirmModal.popup({
			}).then(res => {
				this.$request({
					url: '_HR_SYSTEM_ASSESS_DPR_DELETE_POST',
					type: 'GET',
					param: { position_id },
					loading: false
				}).then(info => {
					this.$Message.success(info.msg);
					this.loadData();
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(err => {

			});
		},
		loadData() {
			this.$request({
				url: 'HR_SYSTEM_ASSESS_UP_GET',
				type: 'GET',
				param: { first_depart_id: this.first_depart_id },
				loading: false
			}).then(res => {
				this.arr = res.data;
			}).catch(err => {
				this.arr = [];
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-system-assess-up-job-item {
	& > ._item {
		border: 1px solid #E8E8E8;
		border-radius: 4px;

		._title {
			padding: 15px 20px;
			background: #f8f8f8;
		}

		._middle {
			border-left: 1px solid #EBEEF1;
			border-right: 1px solid #EBEEF1;
			padding-left: 30px;
			width: 240px;
		}

		._border {
			border-bottom: 1px solid #EBEEF1;
		}
	}
	.ivu-row {
		display: flex !important;
	}
}
</style>


