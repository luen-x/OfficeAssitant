<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:width="400"
			:mask-closable="false"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				新增范围
			</div>
			<i-form 
				ref="form"
				:model="formdata" 
				:rules="validator"
				:label-width="100" 
				class="g-m-t-20">
				<i-formitem label="职位:" prop="position_id" >
					<i-select
						v-model="formdata.position_id"
						placeholder="请选择职位"
						style="width: 220px"
						label-in-value
						transfer
						@on-change="handlePosition"
					>
						<i-option 
							v-for="item of positionArr"
							:key="item.position_id"
							:value="item.position_id">{{ item.position_name }}</i-option>
					</i-select>
				</i-formitem>
				<i-formitem label="角色:" >
					<i-select
						v-model="formdata.role_id"
						:remote-method="loadRole"
						:loading="loading"
						placeholder="请输入角色关键字搜索"
						filterable
						label-in-value
						remote
						transfer
						style="width: 220px"
						@on-change="handleRole"
					>
						<i-option 
							v-for="item of roleArr"
							:key="item.role_id"
							:value="item.role_id">{{ item.role_name }}</i-option>
					</i-select>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'hr-system-integration-range',
	components: {
		'i-modal': Modal,
		'i-textarea': TextArea,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		return {
			visible: false,
			positionArr: [],
			roleArr: [],
			loading: false,
			formdata: {
			},
			validator: {
				position_id: [{ required: true, type: 'number', message: '请选择职位', trigger: 'blur' }],
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadPosition();
	},
	methods: {
		handleOk() {
			this.$refs['form'].validate((item) => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					this.$emit('sure', { data: { ...this.formdata } });
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handlePosition(e) {
			this.formdata.position_name = e.label;
		},
		handleRole(e) {
			this.formdata.role_name = e.label;
		},
		loadPosition() {
			const { query } = this.$route;
			this.$request({
				url: '_HR_DEPART_POSITION_GET',
				type: 'GET',
				param: {
					depart_id: query.depart_id
				},
			}).then(res => {
				this.positionArr = res.data[0].positions;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadRole(query) {
			if (query !== '') {
				this.loading = true;
				this.$request({
					url: '_HR_ROLE_DATA_GET',
					type: 'GET',
					param: {
						role_name: query
					},
				}).then(res => {
					this.loading = false;
					this.roleArr = res.data;
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			} else {
				this.loading = false;
				this.roleArr = [];
			}
		},
	}
};
export const RangeModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


