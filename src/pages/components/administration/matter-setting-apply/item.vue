<template>
	<div class="v-apply-item">
		<div class="_title">{{ data.depart_name }}</div>
		<div class="_content">
			<div class="g-flex g-jc-sb">
				<span style="font-weight: bold;">审核权限</span>
				<span class="g-operation" @click="() => handleAdd(data.first_depart_id)">新增类型</span>
			</div>
			<div class="_scroll">
				<div v-for="(info, index) of data.approve_set" :key="index" class="_item">
					<span>职位</span>
					<i-divider type="vertical"/>
					<span>{{ info.position_name }}</span>
					<span class="_close" @click="() => handleDel(info.approve_set_id)">x</span>
					<div v-if="info.role_id" class="_extra">
						<span>角色</span>
						<i-divider type="vertical"/>
						<span>{{ info.role_name }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Divider } from 'iview';
import API_ROOT from '@stores/apis/root';
import { ApplyModal } from './popup/modal';

export default {
	name: "setting-apply-item",
	components: {
		'i-divider': Divider
	},
	props: {
		data: Object,
		loadData: Function
	},
	methods: {
		handleDel(approve_set_id) {
			this.$request({
				url: API_ROOT._ADMINISTRATION_MATTER_APPLY_DEL_POST,
				type: 'POST',
				loading: false,
				param: {
					approve_set_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.loadData();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleAdd(first_depart_id) {
			ApplyModal.popup({
				first_depart_id,
				loadData: this.loadData
			}).then(res => {

			}).catch(err => {

			}); 
		}
	}
};
</script>

<style lang="scss" scoped>
.v-apply-item {
	margin-right: 20px;
	margin-bottom: 20px;
	width: 300px;
	height: 500px;
	background: #f7f7f7;
	box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
	border-radius: 5px;

	& > ._title {
		height: 40px;
		line-height: 40px;
		text-align: center;
		color: #fff;
		background: rgb(140, 179, 236);
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}

	& > ._content {
		padding: 10px;

		._item {
			border: 1px solid #eee;
			padding: 5px 8px;
			margin-top: 10px;
			background: #fff;
			position: relative;
			.ivu-divider {
				background-color: #e8eaec !important;
				margin: 0 5px;
			}
			._close {
				position: absolute;
				right: 5px;
				cursor: pointer;
			}
			._extra {
				border-top: 1px solid #eee;
				margin-top: 5px;
				padding-top: 5px;
			}
		}
		._scroll {
			height: 420px;
			overflow: auto;
		}
	}
}
</style>

