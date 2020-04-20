<template>
	<vm-combo 
		ref="combo"
		:data-source.sync="list"
		:frame-style="{ border: '1px solid #d4d4d4', margin: 100 }"
		:frame-w="640"
		:frame-h="900"
		@save="handleSave"
		@error="handleError"
	/>
</template>

<script>
import { debounce } from 'lodash';
import API_ROOT from '@stores/apis/root';
import { vmRegister } from 'wya-vm';
import { applicantName } from './components/applicant-name/root';
import { background } from './components/background/root';
import { createTime } from './components/create-time/root';
import { depart } from './components/depart/root';
import { image } from './components/image/root';
import { input } from './components/input/root';
import { inviteMan } from './components/invite-man/root';
import { inviteMobile } from './components/invite-mobile/root';
import { position } from './components/position/root';
import { registerActualTime } from './components/register-actual-time/root';
import { registerTime } from './components/register-time/root';
import { salary } from './components/salary/root';

let { Combo } = vmRegister({
	applicantName,
	depart,
	position,
	salary,
	registerTime,
	inviteMan,
	inviteMobile,
	registerActualTime,
	createTime,
	input,
	image,
	background
});

export default {
	name: 'oa-offer-social-combo',
	components: {
		'vm-combo': Combo
	},
	props: {
		list: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
		};
	},
	computed: {
		color() {
			return this.$store.state.hrToolModulesOfferAdd.color;
		}
	},
	watch: {
		
	},
	created() {
		
	},
	methods: {
		handleSave: debounce(function (list) {
			if (!(list instanceof Array)) {
				this.$Message.warning('内容不能为空！');
				return;
			}
			this.$request({
				url: API_ROOT['_HR_TOOL_MODULES_ADD_OFFER_POST'],
				type: "POST",
				param: {
					content: list,
					color: this.color,
					html: '',
					...this.$route.query
				}
			}).then(res => {
				this.$router.back();
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}, 300),
		handleError(error) {
			this.$Message.warning(error.msg);
		}
	},
};
</script>

<style lang="scss">
</style>
