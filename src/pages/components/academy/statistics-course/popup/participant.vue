<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			title="参与人员"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div class="g-fs-14 g-m-b-20">共{{ participator.length }}人</div>
			<div class="g-flex g-fw-w v-academy-statistics-course-participant">
				<div 
					v-for="(item,index) in participator"
					:key="index"
					class="g-m-b-10 _content"
				>
					<span class="g-inline-block g-tc">
						{{ item }}
					</span>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'v-academy-statistics-course-participant-modal',
	components: {
		'i-modal': Modal
	},
	props: {
		participator: {
			required: true,
			type: Array
		}
	},
	data() {
		return {
			visible: false
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit('close');
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const Participant = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-statistics-course-participant{
    ._content{
        width: 25%;

        span{
            width: 140px;
            height: 30px;
            line-height: 30px;
            background: #e84854;
            color: #ffffff;
            border-radius: 4px;
        }
    }
}
</style>