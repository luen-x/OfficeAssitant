<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		:footer-hide="true"
		class="v-collage-select-nesting"
		width="400px"
	>
		<div slot="header" class="g-tc">
			选择套系
		</div>

		<i-form 
			ref="form" 
			:model="form" 
			:rules="rule" 
			:label-width="100"
		>
			<i-form-item label="申诉套系：" prop="nest">
				<i-select 
					v-model="form.nest" 
					placeholder="请选择申诉套系"
					style="width: 220px;"
				>
					<i-option
						v-for="item in nests"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<div v-if="form.nest === '2'">
					<i-checkbox-group v-model="form.nests">
						<i-checkbox 
							v-for="(item,index) in lecture_name" 
							:key="index"
							:label="item.lesson_id"
							class="g-block"
						>
							<span>
								{{ item.lecture_set_name }}
								({{ item.whole_name+ "," + item.real_name }}) 
							</span>
						</i-checkbox>
					</i-checkbox-group>
				</div>
			</i-form-item>
		</i-form>

		<div class="g-tr _footer">
			<i-button 
				type="text"
				style="margin-right: 6px;"
				@click="handleCancel"
			>
				取消
			</i-button>
			<i-button 
				type="text" 
				class="g-c-white __sure"
				@click="handleOk"
			>
				确定
			</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Select, Option, CheckboxGroup, Checkbox } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";

export default {
	name: "collage-select-nesting",

	components: {
		"i-modal": Modal,
		"i-button": Button,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"i-checkbox": Checkbox,
		"i-checkbox-group": CheckboxGroup
	},

	props: {
		quality_record_id: Number
	},

	data() {
		return {
			form: {
				nest: "",
				nests: []
			},
			rule: {
				nest: [
					{ required: true, message: "请选择申诉套系", trigger: "change" }
				],
			},
			nests: [{
				value: "1",
				label: "全部"
			}, {
				value: "2",
				label: "套系"
			}],
			lecture_name: [],
			visible: false
		};
	},

	mounted() {
		this.loadData();
		this.visible = true;
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._COLLAGE_SERVICE_APPEAL_LESSON_LIST_GET,
				type: "GET",
				param: {
					quality_record_id: this.quality_record_id
				},
				loading: false
			}).then(res => {
				this.lecture_name = res.data;

				this.lecture_name.forEach(item => {
					item.whole_name = "总体评分" + (item.whole_score != -1 ? item.whole_score : "-");
					item.real_name = "个人评分" + (item.real_score != -1 ? item.real_score : "-");
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleOk() {
			if (this.form.nest == 2 && this.form.nests.length == 0) {
				this.$Message.warning("请选择套系");
				this.visible = true;

				return;
			}

			this.$refs.form.validate(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			let lesson_ids = [];

			if (this.form.nest == 1) {
				this.lecture_name.forEach(item => {
					lesson_ids.push(item.lesson_id);
				});
			}

			Confirm.popup({
				title: "",
				msg: "发起申诉后，将重新进行质检回访，是否确认申诉？",
				content: "发起申诉后，将重新进行质检回访，是否确认申诉？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: API_ROOT._COLLAGE_SERVICE_APPEAL__POST,
					type: "POST",
					param: {
						quality_record_id: this.quality_record_id,
						lesson_ids: this.form.nest == 1 ? lesson_ids.join(",") : this.form.nests.join(",")
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.$emit("sure", true);
					this.visible = false;
				}).catch(error => {
					this.$Message.error(error.msg);
					this.visible = true;
				});
			});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const SelectNestingModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-select-nesting {
	._footer{
		padding-top: 20px;

		.__sure{
			background-color:#e74854 !important;
			border-color:#e74854 !important;

			&:hover{
				color: #ffffff !important;
				background-color:#e74854 !important;
				border-color:#e74854 !important;
			}
		}
	}
}
</style>