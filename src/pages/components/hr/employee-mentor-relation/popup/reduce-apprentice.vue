<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="400"
			class="hr-employee-reduce-apprentice"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				减少徒弟
			</div>
			<div class="g-m-t-10">
				<div 
					v-for="(apprentice,index) in apprenticesArr"
					:key="index"
					class="_apprentice-item g-flex-ac"
				>
					<span>{{ apprentice.staff_name }}-{{ apprentice.depart_name }}</span>
					<i 
						class="iconfont icon-close2 g-fs-12"
						@click="handleDel(apprentice.staff_id,index)"
					/>
				</div>
			</div>
			
		</i-modal>
	</div>
</template>

<script>
import { Modal, Button } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "hr-employee-reduce-apprentice",
	components: {
		"i-modal": Modal,
		"i-button": Button,
	},
	props: {
		master_id: Number,
		apprentice_arr: Array
	},

	data() {
		return {
			visible: false,
			apprenticesArr: this.apprentice_arr.length ? this.apprentice_arr : [],
			reduceArr: [],
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			if (this.reduceArr.length == 0) {
				this.visible = false;
				return; 
			}
			this.$request({
				url: API_ROOT._HR_MASTER_APPRENTICE_REDUCE_APPRENTICE_POST,
				type: "POST",
				param: {
					master_id: this.master_id,
					apprentice_id: this.reduceArr
				},
				loading: false
			}).then(res => {
				this.$emit("sure");
				this.$Message.success("操作成功");
			}).catch(err => {
				this.$Message.warning(err.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.visible = false;
			this.$store.commit('HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT');
		},
		handleDel(id, index) {
			this.reduceArr.push(id);
			this.apprenticesArr.splice(index, 1);
		}
	}
};

export const ReduceApprentice = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.hr-employee-reduce-apprentice{
	._apprentice-item {
		background-color: #e84c57;
		color: #ffffff;
		padding: 4px 6px;
		display: inline-block;
		border-radius: 4px;
		line-height: 1;
		font-size: 12px;
		margin:10px;
	}
}
</style>