<template>
	<div class="v-hr-system-table">
		<div class="_title g-flex g-jc-sb">
			<div>{{ data.type_name }}</div>
			<div style="color: #e84854">总分： {{ data.sum }}分</div>
		</div>
		<div 
			class="g-flex g-fw-w"
		>
			<div 
				v-for="(item, i) of arrHandle"
				:key="i"
				:class="{'_item': true, '_border': i < sum, '_right': ((i + 1) % 3 !== 0)}"
			>
				<div
					v-for="(info, a) of item"
					:key="a"
					class="g-flex g-jc-sb g-m-b-5"
				>
					<div class="g-flex">
						<template v-if="(info.is_update || info.is_manmade)">
							<i-tooltip
								v-if="info.remarks"
								:content="info.remarks"
								:max-width="240"
								:transfer="true"
								placement="top"
							>
								<span
									style="
										color: #ED8F4A;
										background: rgba(237,143,74,.3);
										display: inline-block;
										width: 23px;
										height: 14px;
										line-height: 14px;
										textAlign: center;
										marginTop: 2px;
										marginRight: 5px;
										borderRadius: 2px;
									"
								>
									{{ info.is_update ? '改' : ( info.is_manmade && '新') }}
								</span>
							</i-tooltip>
							<span
								v-else
								style="
									color: #ED8F4A;
									background: rgba(237,143,74,.3);
									display: inline-block;
									width: 23px;
									height: 14px;
									line-height: 14px;
									textAlign: center;
									marginTop: 2px;
									marginRight: 5px;
									borderRadius: 2px;
								"
							>
								{{ info.is_update ? '改' : ( info.is_manmade && '新') }}
							</span>
						</template>
						<oa-auto-tooltip 
							:content="info.reason"
							width="150px"
							label-class=""
							theme="dark"
						/>
					</div>
					<div>
						<span class="g-m-r-20" style="display: inline-block;width: 20px">{{ info.point >= 0 ? `+${info.point}` : info.point }}</span>
						<span 
							v-if="query.cate === '1' ? $auth[871] : $auth[885]"
							class="g-operation" 
							@click="(e) => handleEdit(info.record_id)">编辑</span>
						<i-divider type="vertical" />
						<span 
							v-if="query.cate === '1' ? $auth[872] : $auth[886]"
							class="g-operation" 
							@click="(e) => handleDel(info.record_id)">删除</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Tooltip, Divider } from 'iview';
import AutoToolTip from '@components/_common/auto-tooltip/auto-tooltip';
import { EditModal } from './credit-popup/edit';
import { ConfirmModal } from '../../popup/confirm';

export default {
	name: 'hr-system-table',
	components: {
		'i-tooltip': Tooltip,
		'i-divider': Divider,
		'oa-auto-tooltip': AutoToolTip
	},
	props: {
		dataInfo: Object,
		handleSearch: Function
	},
	data() {
		const { query = {} } = this.$route;
		return {
			arr: [{}, {}],
			arrHandle: [],
			data: this.dataInfo,
			// 取最近length的 4n
			sum: 0,
			query
		};
	},
	watch: {
		dataInfo(val) {
			this.handleData(val);
			this.data = val;
		}
	},
	mounted() {
		this.handleData(this.data);
	},
	methods: {
		// 处理数据
		handleData(data) {
			const arr = data.detail;
			let arrHandle = [];
			for (let i = 0; i < arr.length; i += 5) {
				arrHandle.push(arr.slice(i, i + 5));
			}
			this.arrHandle = arrHandle;
			if (this.arrHandle.length > 3) {
				this.sum = ((this.arrHandle.length / 3) | 0) * 3;
			}
		},
		handleEdit(record_id) {
			EditModal.popup({
				record_id,
			}).then(res => {
				this.handleSearch();
			}).catch(err => {

			});
		},
		handleDel(record_id) {
			ConfirmModal.popup({

			}).then(res => {
				this.$request({
					url: '_HR_EMPLOYEE_SCORE_CREDITINTE_DETAIL_DEL_POST',
					type: 'POST',
					loading: false,
					param: {
						record_id
					}
				}).then(info => {
					this.$Message.success(info.msg);
					this.handleSearch();
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(err => {

			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-system-table {
	border: 1px solid #E8E8E8;
	border-radius: 4px;

	& > ._title {
		padding: 15px 20px;
		background: #f8f8f8;
	}
	& > ._border {
		border-bottom: 1px solid #EBEEF1;
	}
	._item {
		width: 33.3%;
		padding: 20px;
	}
	._border {
		border-bottom: 1px solid #E9E9E9;
	}
	._right {
		border-right: 1px solid #E9E9E9;
	}
}
</style>


