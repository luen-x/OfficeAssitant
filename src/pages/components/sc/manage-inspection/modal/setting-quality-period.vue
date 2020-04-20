<template>
	<i-modal
		ref="modal" 
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			{{ name === "1" ? "设置质检周期" : "修改质检周期" }}
		</div>

		<div class="g-tc">
			<span>{{ name === "1" ? "设置质检周期：" : "修改质检周期：" }}</span>
			<i-date-picker
				v-model="time"
				clearable
				transfer
				type="daterange" 
				split-panels
				placeholder="请选择质检日期"
				style="width: 220px;"
				formate="yyyy-MM-dd"
			/>
		</div>
	</i-modal>
</template>

<script>
import { DatePicker, Modal } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import moment from "moment";

export default {
	name: "sc-manage-inspection-quality-period",
    
	components: {
		"i-modal": Modal,
		"i-date-picker": DatePicker
	},
    
	props: {
		name: String,
		quality_ids: Array
	},

	data() {
		return {
			time: "",
			visible: false
		};
	},

	mounted() {
		this.visible = true;
	},
    
	methods: {
		handleOk() {
			let time = {
				begin_time: this.time[0] && moment(this.time[0]).format("YYYY-MM-DD"),
				end_time: this.time[1] && moment(this.time[1]).format("YYYY-MM-DD")
			};

			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_SET_PERIOD_GET,
				type: "GET",
				param: {
					...time,
					type: 1
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$store.commit("SC_MANAGE_INSPECTION_PERIOD", time);
				this.$emit('sure', true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
        
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const SettingQualityPeriodModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>