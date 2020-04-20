<template>
	<div class="g-relative g-pd-t-20 " style="min-height:260px" >
		<oa-loading v-if="loading"/>
		<vc-debounce-click
			v-if="!readOnly && dealStatus==2 && (!isOwn && $auth[394]) || (isOwn && $auth[405])"
			class="g-red-btn-line"
			style="position:absolute;right:0;top:20px"
			@click="handleAddContact"
		>
			添加联系人
		</vc-debounce-click>

		<div >
			<div
				v-if="!contactList.length"
				class="g-flex g-jc-c"
				style="position: relative;top: 100px;"
			>
				<div>
					<img :src="OSS_SEARCH_EMPTY" >
					<div class="g-tc" >暂无联系人{{ dealStatus==2 ? '，赶快添加一位吧~':'' }}</div>
				</div>
			</div>
			<div style="margin-top:-20px;width: 570px">
				<div v-for="contact in contactList" :key="contact.contact_id" class="_sale-bg">
					<div class="_contact">
						<span v-if="contact.is_decision" class="_tip-bar">主要决策</span>
						<div class="_ellipsis">
							姓名：{{ contact.customer_name }}
							{{ contact.sex ? '女士':'先生' }}
						</div>
						<div class="_ellipsis">职位：{{ contact.position }}</div>
						<div class="g-flex">
							<div>电话：</div>
							<div>
								<div
									v-for="(tel,index) in formatContactTel(contact.tel)"
									:key="index"
								>
									{{ tel }}
								</div>
							</div>
						</div>
						<div >
							<span
								v-if=" dealStatus==2 && getAuth(isOwn,395,406)"
								class="g-fr g-pointer g-c-blue-mid g-fs-14"
								@click="handleEditContact(contact)"
							>
								修改
							</span>
							<span
								v-if=" dealStatus==2 && getAuth(isOwn,395,406)"
								class="g-fr g-pointer g-c-red-mid g-fs-14"
								style="position: relative;top: -2em;right: -2em;"
								@click="handleDelContact(contact)"
							>
								删除
							</span>
							<div class="_ellipsis">	邮箱：{{ contact.email }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script >
import { Button } from "iview";
import Loading from '@components/_common/loading/loading';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { Confirm } from '@common/confirm/confirm';
import { AddContact } from "../../../add-contact";
import { getAuth } from '../../../../util';

export default {
	name: "oa-sale-contacts",
	components: {
		'i-button': Button,
		'oa-loading': Loading
	},
	props: {
		isOwn: Boolean,
		customerId: Number,
		dealStatus: Number,
		readOnly: Boolean
	},
	data() {
		return {
			loading: false,
			contactList: [],
			OSS_SEARCH_EMPTY
		};
	},
	watch: {
		customerId(newVal, oldVal) {
			this.loadData();
		}
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loadContacts();
		},
		loadContacts() {
			this.loading = true;
			this.$request({
				url: "_SALE_INTENTION_CONTACT_GET",
				type: "GET",
				loading: false,
				param: {
					customer_id: this.customerId
				}
			}).then(res => {
				res.data.forEach(item => {
					item.tel = item.tel.split(",");
				});
				this.contactList = res.data.sort((a, b) => b.is_decision - a.is_decision);
				this.loading = false;
			}).catch(res => {
				this.loading = false;
				console.error(res);
			});
		},
		handleEditContact(contactInfo) {
			AddContact.popup(
				{ data: {
					title: "修改联系人",
					contactInfo: JSON.parse(JSON.stringify(contactInfo))
				}
				}
			).then(res => {
				this.loadContacts();
			}).catch(res => {
			});
		},
		handleDelContact(contactInfo) {
			Confirm.popup({ title: "确认删除", msg: '确认删除此联系人？' }).then(() => {
				this.$request({
					url: "_SALE_INTENTION_DEL_CONTACT_POST",
					type: "POST",
					param: {
						contact_id: contactInfo.contact_id, // 联系人主键
						customer_id: this.customerId // 客户主键
					},
					loading: false,
				}).then((res) => {
					this.$Message.success(res.msg);
					this.loadData();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(() => {});
		},
		handleAddContact() {
			AddContact.popup({ data: { title: "添加联系人", customer_id: this.customerId } }).then(() => {
				this.loadContacts();
			}).catch(() => { });
		},
		formatContactTel(tels) {
			const temp = [...tels];
			temp.splice(2);
			if (tels.length > 2) {
				temp[1] += ' ...';
			}
			return temp;
		},
	}
};
</script>

<style lang="scss">
</style>
