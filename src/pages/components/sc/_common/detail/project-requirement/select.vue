<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="400px"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				额外设定
			</div>
			<i-form
				ref="form"
				:model="formData"
				:label-width="100"
				class="g-m-t-20"
			>
				<i-formitem label="额外设定:">
					<i-select v-model="select" style="width: 220px;" clearable>
						<i-option 
							v-for="item in arr" 
							:value="item.value" 
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<oa-explain
						title="软件类产品可以设置开号时间和使用截止时间；视频类产品可以设置拍摄成本、配音成本和素材成本。"
						content=""
					/>
				</i-formitem>

				<i-formitem
					v-if="time"
					key="1"
					label="开号时间:"
					prop="start"
				>
					<i-datepicker
						v-model="formData.start"
						style="width: 220px;"
						placeholder="请选择开号时间"
						type="date"
						transfer
					/>
				</i-formitem>
				<i-formitem
					v-if="time"
					key="2"
					label="使用截止时间:"
					prop="end"
				>
					<i-datepicker
						v-model="formData.end"
						style="width: 220px;"
						placeholder="请选择截止时间"
						type="date"
						transfer
					/>
				</i-formitem>

				<i-formitem
					v-if="video_cost"
					key="3"
					label="拍摄成本:"
					prop="shot_cost"
				>
					<i-inputnumber
						v-model="formData.shot_cost"
						:max="1000000"
						:precision="2"
						:active-change="false"
						style="width: 220px;"
						placeholder="请填写拍摄成本"
					/>
				</i-formitem>
				<i-formitem
					v-if="video_cost"
					key="4"
					label="配音成本:"
					prop="dubbing_cost"
				>
					<i-inputnumber
						v-model="formData.dubbing_cost"
						:max="1000000"
						:precision="2"
						:active-change="false"
						style="width: 220px;"
						placeholder="请填写配音成本"
					/>
				</i-formitem>
				<i-formitem
					v-if="video_cost"
					key="5"
					label="素材成本:"
					prop="material_cost"
				>
					<i-inputnumber
						v-model="formData.material_cost"
						:max="1000000"
						:precision="2"
						:active-change="false"
						style="width: 220px;"
						placeholder="请填写素材成本"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import Explain from '@components/_common/explain/explain';
import { Modal, DatePicker, Form, FormItem, Select, Option, InputNumber } from "iview";
import { CreatePortal } from "wya-vc";
import moment from "moment";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-set-time",

	components: {
		"i-modal": Modal,
		"i-datepicker": DatePicker,
		"i-form": Form,
		"i-formitem": FormItem,
		"i-inputnumber": InputNumber,
		"i-select": Select,
		"i-option": Option,
		'oa-explain': Explain
	},

	props: {
		project_id: Number,
		v: Object
	},

	data() {
		return {
			visible: false,
			start_time: "", // 	开始时间
			end_time: "", // 结束时间
			select: "",
			formData: {
				start: "",
				end: "",
				shot_cost: null,
				dubbing_cost: null,
				material_cost: null
			},
			arr: [
				{
					value: "1",
					label: "系统使用时间设定"
				},
				{
					value: "2",
					label: "视频成本设定"
				}
			],
			time: false,
			video_cost: false
		};
	},
    
	watch: {
		select(val) {
			if (val == "1") {
				this.time = true;
				this.video_cost = false;
			} else if (val == "2") {
				this.time = false;
				this.video_cost = true;
			} else {
				this.time = false;
				this.video_cost = false;
			}
		}
	},

	mounted() {
		if (this.v && this.v.start_time) {
			this.formData.start = this.v.start_time;
			this.formData.end = this.v.end_time;
			this.time = true;
			this.video_cost = false;
			this.select = '1';
		} else if (this.v && this.v.shot_cost) {
			this.formData.shot_cost = +this.v.shot_cost;
			this.formData.dubbing_cost = +this.v.dubbing_cost;
			this.formData.material_cost = +this.v.material_cost;
			this.time = false;
			this.video_cost = true;
			this.select = '2';
		} else {
			this.time = true;
			this.video_cost = false;
			this.select = '1';
		}

		this.visible = true;
	},

	methods: {
		handleOk() {
			if (!this.select) {
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
				this.$Message.warning("请先进行额外设定选择，在进行其他操作！");

				return;
			}

			this.$refs.form.validateAndScroll(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			if (this.time) {
				this.start_time = this.formData.start
                && moment(this.formData.start).format("YYYY-MM-DD");
				this.end_time = this.formData.end
				&& moment(this.formData.end).format("YYYY-MM-DD");
				
				if (this.handleCompareDate(this.start_time, this.end_time)) {
					this.visible = true;
					this.$refs.modal.buttonLoading = false;
					this.$Message.warning("开号时间不能小于截止时间");

					return;
				}
			}
		
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_COST_SET_POST,
				type: "POST",
				param: {
					type: this.time ? 1 : 2,
					project_id: this.project_id,
					shot_cost: this.formData.shot_cost,
					dubbing_cost: this.formData.dubbing_cost,
					material_cost: this.formData.material_cost,
					start_time: this.start_time,
					end_time: this.end_time
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleCompareDate(data1, data2) {
			return (new Date(data1.replace("-", "/")) > new Date(data2.replace("-", "/")));
		}
	}
};
export const SelectModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>