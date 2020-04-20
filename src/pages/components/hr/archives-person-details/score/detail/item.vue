<template>
	<div class="v-hr-system-table">
		<div class="_title g-flex g-jc-sb">
			<div>{{ data.type_name }}</div>
			<div style="color: #E84C57;">总分 {{ data.sum }}</div>
		</div>
		<div 
			class="g-flex g-fw-w"
		>
			<div 
				v-for="(item, i) of arrHandle"
				:key="i"
				:class="{'_item': true, '_border': i < sum, '_right': ((i + 1) % 4 !== 0) && item.length === 5}"
			>
				<div
					v-for="(info, a) of item"
					:key="a"
					class="g-flex g-jc-sb"
				>
					<div>
						<i-tooltip
							:content="info.reason"
							transfer
							placement="top-start"
						>
							<span 
								style="
									display: inline-block; 
									width: 200px;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								"
							>{{ info.reason }}</span>
							<!-- <span style="display: inline-block; minWidth: 150px;">{{ info.reason }}</span> -->
							
						</i-tooltip>
						
					</div>
					<span class="g-fr g-m-r-5">{{ info.point }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import { EditModal } from './credit-popup/edit';
// import { ConfirmModal } from '../../popup/confirm';
import { Tooltip } from 'iview';

export default {
	name: 'hr-system-table',
	components: {
		'i-tooltip': Tooltip
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
	mounted() {
		this.handleData();
	},
	methods: {
		// 处理数据
		handleData() {
			const arr = this.dataInfo.detail;
			let arrHandle = [];
			for (let i = 0; i < arr.length; i += 5) {
				arrHandle.push(arr.slice(i, i + 5));
			}
			this.arrHandle = arrHandle;
			if (this.arrHandle.length > 4) {
				this.sum = ((this.arrHandle.length / 4) | 0) * 4;
			}
		},
		// handleEdit(record_id) {
		// 	EditModal.popup({
		// 		record_id,
		// 	}).then(res => {
		// 		this.handleSearch();
		// 	}).catch(err => {

		// 	});
		// },
		// handleDel(record_id) {
		// 	ConfirmModal.popup({

		// 	}).then(res => {
		// 		this.$request({
		// 			url: '_HR_EMPLOYEE_SCORE_CREDITINTE_DETAIL_DEL_POST',
		// 			type: 'POST',
		// 			loading: false,
		// 			param: {
		// 				record_id
		// 			}
		// 		}).then(info => {
		// 			this.$Message.success(info.msg);
		// 			this.handleSearch();
		// 		}).catch(err => {
		// 			this.$Message.error(err.msg);
		// 		});
		// 	}).catch(err => {

		// 	});
		// }
	}
};
</script>

<style lang="scss" >
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
		width: 25%;
		padding: 20px;
	}
	._border {
		border-bottom: 1px solid #E9E9E9;
	}
	._right {
		border-right: 1px solid #E9E9E9;
	}
	.ivu-tooltip-rel{
		display: flex;
		align-items: flex-start;
	}
}
</style>


