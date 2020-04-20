<template>
	<div class="v-system-assess-up-relation-item">
		<div v-if="!arr.length" class="g-m-b-20">
			<span>晋升关系：</span>
			<span 
				v-if="$auth[1150]"
				class="g-red-btn-line" 
				@click="handleAdd">新增关系</span>
		</div>
		<div v-else class="_item g-m-b-20">
			<div class="_title">
				晋升关系
			</div>
			<div class="g-pd-lr-20">
				<div class="g-flex _thead g-pd-tb-15">
					<div class="_cell">
						晋升全称
					</div>
					<div class="_cell _divider">
						晋升简称
					</div>
					<div class="_cell _divider">
						原职位
					</div>
					<div class="_cell _divider">
						晋升职位
					</div>
					<div class="_divider">
						操作
					</div>
				</div>
				<div 
					v-for="item of arr"
					:key="item.system_id"
					class="g-flex _content g-pd-tb-15"
				>
					<div>
						{{ item.full_name }}
					</div>
					<div class="_divider">
						{{ item.abbreviation }}
					</div>
					<div class="_divider">
						<div 
							v-for="(info, i) of item.relate"
							:key="i"
						>
							{{ info.before_position_name }}
						</div>
					</div>
					<div class="_divider">
						<div 
							v-for="(info, i) of item.relate"
							:key="i"
						>
							{{ item.promotion_position_name }}
						</div>
					</div>
					<div class="_divider">
						<span class="g-operation" @click="(e) => handleAdd(e, item)">修改</span>
						<i-divider type="vertical"/>
						<span class="g-operation" @click="() => handleDel(item.system_id)">删除</span>
					</div>
				</div>
			</div>
			<div class="g-pd-20">
				<span 
					class="g-red-btn-line" 
					@click="handleAdd">新增关系</span>
			</div>
		</div>
	</div>
</template>

<script>
import { Row, Col, Divider } from 'iview';
import { ConfirmModal } from '@components/hr/_common/popup/confirm';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { cloneDeep } from 'lodash';

import { RelationModal } from './popup/relation';

export default {
	name: 'oa-system-assess-up-add-relationitem',
	components: {
		'i-row': Row,
		'i-col': Col,
		'i-divider': Divider
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
		handleAdd(e, relation_info) {
			relation_info = relation_info && cloneDeep(relation_info);
			RelationModal.popup({
				depart_id: this.first_depart_id,
				relation_info
			}).then(res => {
				this.loadData();
			}).catch(err => {
			});
		},
		handleDel(system_id) {
			ConfirmModal.popup({

			}).then(res => {
				this.$request({
					url: '_HR_SYSTEM_PROSYSTEM_DEL_POST',
					type: 'GET',
					param: { system_id },
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
				url: '_HR_SYSTEM_ASSESS_RELATION_GET',
				type: 'GET',
				param: { depart_id: this.first_depart_id },
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
.v-system-assess-up-relation-item {
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
		}

		._border {
			border-bottom: 1px solid #EBEEF1;
		}
		._thead, ._content {
			border-bottom: 1px solid #EBEEF1;
			& > div {
				width: 20%;
			}
		}
		._cell {
			border-right: 1px solid #EBEEF1;
		}
		._divider {
			padding-left: 20px;
		}
	}
}
</style>


