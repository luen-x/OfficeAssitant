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
			<div 
				v-for="(apprentice,index) in apprenticesArr"
				:key="index"
				class="_apprentice-item g-flex-ac g-m-r-10 g-m-b-10"
			>
				<span>{{ apprentice.apprentice_name }}-{{ apprentice.depart_name }}</span>
				<i 
					class="iconfont icon-close2 g-fs-12"
					@click="handleDel(apprentice.apprentice_id,index)"
				/>
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
	},

	data() {
		return {
			visible: false,
			apprenticesArr: [],
			reduceArr: [],
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		handleOk() {
			if (this.reduceArr.length == 0) {
				this.visible = false;
				return; 
			}
			this.$request({
				url: API_ROOT._HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_REDUCE_APPRENTICE_DETAIL_POST,
				type: "POST",
				param: {
					master_id: this.master_id,
					apprentice_id: this.reduceArr
				},
				loading: false
			}).then(res => {
				this.$emit("sure");
				this.$Message.success("操作成功");
				this.$store.commit('HR_PERSONNEL_MEMBER_RELATIONSHIP_LIST_INIT');
			}).catch(err => {
				this.$Message.warning(err.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		loadData() {
			this.$request({
				url: API_ROOT._HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_REDUCE_APPRENTICE_DETAIL_LIST_GET,
				type: "GET",
				param: {
					master_id: this.master_id,
				},
				loading: false
			}).then(res => {
				this.apprenticesArr = res.data;
			}).catch(err => {
				this.$Message.warning(err.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.visible = false;
			this.$store.commit('HR_PERSONNEL_MEMBER_RELATIONSHIP_LIST_INIT');
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
	}
}
</style>