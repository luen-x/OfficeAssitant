<template>
	<div>
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
				新增权限审核
			</div>
			<i-form
				ref="form"
				:model="formdata"
				:rules="validator"
				:label-width="100"
				class="g-m-t-20">
				<i-formitem label="职位" prop="position_id">
					<i-select
						v-model="formdata.position_id"
						placeholder="请选择职位"
						clearable
						transfer
						style="width: 80%"
					>
						<i-option 
							v-for="item of position_list"
							:key="item.position_id"
							:value="item.position_id"
						>
							{{ item.position_name }}
						</i-option>
					</i-select>
				</i-formitem>
				<i-formitem label="角色">
					<i-select
						v-model="formdata.role_id"
						:remote-method="loadRole"
						:loading="loading"
						filterable
						remote
						placeholder="请输入角色关键字搜索"
						clearable
						style="width: 80%"
					>
						<i-option 
							v-for="item of role_List"
							:key="item.role_id"
							:value="item.role_id"
						>{{ item.role_name }}</i-option>
					</i-select>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';
import API_ROOT from '@stores/apis/root';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'setting-apply-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button
	},
	props: {
		first_depart_id: Number,
		loadData: Function
	},
	data() {
		return {
			visible: false,
			formdata: {},
			role_List: [],
			position_list: [],
			loading: false,
			validator: {
				position_id: [
					{ required: true, type: 'number', message: "请选择职位", trigger: 'blur' }
				],
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadPosition();
	},
	methods: {
		handleOk() {
			this.$refs['modal'].buttonLoading = false;
			this.$refs['form'].validate((item) => {
				if (item) {
					this.handleAdd();
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleAdd() {
			this.$request({
				url: API_ROOT._ADMINISTRATION_MATTER_APPLY_ADD_POST,
				type: 'POST',
				loading: false,
				param: {
					...this.formdata,
					first_depart_id: this.first_depart_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.loadData();
				this.handleCancel();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadPosition() {
			this.$request({
				url: API_ROOT._ADMINISTRATION_MATTER_APPLY_POSITION_LIST_GET,
				type: 'GET',
				param: {
					depart_id: this.first_depart_id,
					type: 1
				},
				loading: false
			}).then(res => {
				this.position_list = res.data.list;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadRole: debounce(function (query) {
			if (query !== '') {
				this.loading = true;
				this.$request({
					url: API_ROOT._HR_ROLE_DATA_GET,
					type: 'GET',
					param: {
						role_name: query
					},
					loading: false
				}).then(res => {
					this.loading = false;
					this.role_List = res.data;
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			} else {
				this.role_List = [];
			}
		}, 200)
	}
};
export const ApplyModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


