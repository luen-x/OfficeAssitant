<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="600"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<oa-steps 
			:data-source="data"
			:render-title="renderTitle"
			:render-content="renderContent"
		/>
	</i-modal>
</template>

<script>
import { Divider, Modal } from 'iview';
import { CreatePortal } from 'wya-vc';
import Steps from '@components/_common/steps/steps';

export default {
	name: 'finance-contract-record-modal',
	components: {
		'oa-steps': Steps,
		'i-modal': Modal
	},
	data() {
		return {
			visible: false,
			data: [{}, {}]
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
		renderTitle(h, param) {
			const { create_time, staff_name, index } = param.rows;
			return (
				<div class="g-fs-14 g-c-black2 g-m-l-10 g-nobreak">
					<span>xxxxx</span>
					<Divider type="vertical" />
					<span>实扣成本：xxxxx</span>
					<Divider type="vertical" />
					<span>xxxx</span>
				</div>
			);
		},
		renderContent(h, param) {
			const { data = [{ }] } = param.rows;
			return (
				<div>
					{
						data.map(item => {
							return (
								<div style="width: 540px; margin-top: 10px">
									<div>
										<span>成本归属: xxxx</span>
									</div>
									<div 
										class="g-flex g-jc-sb"
										style="background: #f1f1f1; padding: 10px; margin-top: 10px"
									>
										<span style="margin-right: 40px">xxxxx</span>
									</div>
									<div class="g-m-t-10 g-m-b-15">修改原因：xxxxxxxxx</div>
								</div>
							);
						})
					}
				</div>
			);
		}
	}
};
export const RecordModal = CreatePortal({ store: app.$store }, module.exports.default);

</script>

<style lang="scss" scoped>

</style>


