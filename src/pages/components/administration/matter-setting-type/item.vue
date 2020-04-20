<template>
	<div :key="id" style="cursor: pointer">
		<div class="_title">{{ event_type_name }}</div>
		<div class="_content">
			<div v-if="event_type_name === '其它'" class="_other">
				<span>选择此类型，则自动进入公海。</span>
			</div>
			<div v-else class="_normal" @click="handleEdit">
				<div class="_col-item">
					<span class="_left">负责部门</span>
					<span class="_right">
						<oa-tailor :content="depart_name" />
					</span>
				</div>
				<div class="_col-item">
					<span class="_left">负责人</span>
					<span class="_right">
						<oa-tailor :content="staff_name" />
					</span>
				</div>
				<div class="_col-item">
					<span class="_left">创建日期</span>
					<span class="_right">
						<oa-tailor :content="create_time" />						
					</span>
				</div>
			</div>
		</div>
		<i v-if="event_type_name !== '其它'&&$auth['801']" class="iconfont icon-icon-test _close" @click="handleDel"/>
	</div>
</template>

<script>
import { Modal } from 'iview';
import API_ROOT from '@stores/apis/root';
import { TypeModal } from './popup/modal';
import Tailor from '../_common/tailor/tailor';
import { TipModal } from './popup/tip';

export default {
	name: "oa-item",
	components: {
		'oa-tailor': Tailor
	},
	props: {
		id: [String, Number],
		event_type_name: String,
		create_time: String,
		depart_name: String,
		staff_name: String,
		depart_id: Array | Number,
		event_type_id: Number,
		staff_id: Array
	},
	methods: {
		handleEdit() {
			if (this.$auth['800']) {
				TypeModal.popup({
					type: 2,
					info: {
						create_time: this.create_time,
						depart_id: this.depart_id,
						staff_name: this.staff_name,
						event_type_name: this.event_type_name,
						event_type_id: this.event_type_id,
						staff_id: this.staff_id
					}
				}).then(res => {

				}).catch(err => {

				});
			}
		
		},
		handleDel(e) {
			TipModal.popup({ title: "删除确认", eventTypeId: this.event_type_id }).then(res => {});
		}
	}
};
</script>

<style lang="scss" scoped>
._close {
	position: absolute;
	top: 10px;
	right: 10px;
	font-size: 12px;
	color:#999;
	cursor: pointer;
	z-index: 100;
}
._title {
	font-size: 14px;
}
._content {
	
	._other {
		margin-top: 40px;
		
	}
	._normal {
		._col-item {
			margin-top: 10px;
			display: flex;
			& > ._left {
				display: inline-block;
				color: #818794;
				flex: 1;
			}
			& > ._right {
				flex: 2;
			}
		}
	}
}
</style>

