<template>
	<i-card v-if="info && info.length" class="v-system-assess-up-item">
		<div slot="title">
			<div class="g-flex g-ai-c g-jc-sb">
				<span style="fontSize: 14px">晋升体系</span>
				<span 
					v-if="$auth[1148]"
					style="fontSize: 14px"
					class="g-operation"
					@click="handleEdit">修改</span>
			</div>
		</div>
		<div class="g-pd-t-20 g-flex">
			<div class="g-tr" style="width: 60px;">职位信息</div>
			<div class="g-m-l-20 g-flex g-fw-w">
				<div
					v-for="item of info"
					:key="item.position_id"
					class="_info g-box-shadow"
				>
					<div class="_header">{{ item.position_name }}</div>
					<div class="_content">
						<div
							v-for="mess of item.calculate_role"
							:key="mess.relation_id"
						>{{ mess.name }}</div>
						<div class="g-tr" style="color: #818794">{{ item.count }}人</div>
					</div>
				</div>
			</div>
		</div>
	</i-card>
</template>

<script>
import { Card } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'v-system-assess-up-item',
	components: {
		'i-card': Card
	},
	props: {
		info: Array
	},
	data() {
		return {
			arr: [{}, {}, {}]
		};
	},
	methods: {
		handleEdit() {
			let { query = {} } = getParseUrl();
			this.$router.push(getHashUrl('/hr/system/assess/up/add', { first_depart_id: query.first_depart_id }));
		}
	}
};
</script>

<style lang="scss" scoped>
.v-system-assess-up-item {
	font-size: 12px !important;

	// .ivu-card-extra {
	// 	top: 12px !important;
	// }
	._info {
		width: 220px;
		border-radius: 5px;
		margin-right: 30px;
		margin-bottom: 30px;

		._header {
			background: #f0f4fd;
			padding: 10px 20px;
		}
		._content {
			padding: 14px 20px;
		}
	}
}
</style>


