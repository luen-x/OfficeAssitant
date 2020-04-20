<template>
	<div class="v-hr-recruit-school-summary-offer">
		<div v-if="$auth[153]" class="g-flex g-jc-fe g-m-t-10 g-m-r-20">
			<div
				class="g-red-btn-small g-m-r-10"
				@click="handleDownload"
			>
				下载
			</div>
			<i-dropdown trigger="hover" @on-click="handleClickMore">
				<div class="_more g-flex g-jc-sb">
					发邮件
					<i class="iconfont icon-triangle-down g-fs-14 g-pointer" />
				</div>
				<i-dropdown-menu slot="list">
					<i-dropdown-item name="send">发邮件</i-dropdown-item>
					<i-dropdown-item v-if="$auth[1268] || $auth[1257]" name="list">邮件列表</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
		</div>
		<vm-preview
			:data-source="content"
			:mask="false"
			:css="{
				style: 'height: 900px; width: 640px',
				className: 'g-flex-cc'
			}"
			animation="null"
		/>
	</div>
</template>

<script>
import { getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { vmRegister } from 'wya-vm';
import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import { applicantName } from '../tool-modules-offer-add/components/applicant-name/root';
import { background } from '../tool-modules-offer-add/components/background/root';
import { createTime } from '../tool-modules-offer-add/components/create-time/root';
import { depart } from '../tool-modules-offer-add/components/depart/root';
import { image } from '../tool-modules-offer-add/components/image/root';
import { input } from '../tool-modules-offer-add/components/input/root';
import { inviteMan } from '../tool-modules-offer-add/components/invite-man/root';
import { inviteMobile } from '../tool-modules-offer-add/components/invite-mobile/root';
import { position } from '../tool-modules-offer-add/components/position/root';
import { registerActualTime } from '../tool-modules-offer-add/components/register-actual-time/root';
import { registerTime } from '../tool-modules-offer-add/components/register-time/root';
import { salary } from '../tool-modules-offer-add/components/salary/root';
import { college } from '../tool-modules-offer-add/components/college/root';
import { employNumber } from '../tool-modules-offer-add/components/employ-number/root';
import { validTime } from '../tool-modules-offer-add/components/valid-time/root';
import { probationTime } from '../tool-modules-offer-add/components/probation-time/root';

let { Preview } = vmRegister({
	applicantName,
	background,
	createTime,
	depart,
	image,
	input,
	inviteMan,
	inviteMobile,
	position,
	registerActualTime,
	registerTime,
	salary,
	college,
	employNumber,
	validTime,
	probationTime
});

export default {
	name: 'oa-tpl',
	components: {
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
		'vm-preview': Preview
	},
	data() {
		return {
			content: [],
			color: ''
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_RECRUIT_SOCIAL_SUMMARY_OFFER_GET'],
				type: "POST",
				param: {
					...this.$route.query
				}
			}).then(res => {
				this.content = (res.data.content || []).map((item) => {
					return {
						...item,
					};
				});
				this.color = res.data.color;
				this.$store.commit('HR_TOOL_MODULES_OFFER_ADD_COLOR', { color: res.data.color });
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleDownload() {
			window.open(getHashUrl(API_ROOT['_HR_RECRUIT_SOCIAL_SUMMARY_OFFER_GET'], { // eslint-disable-line
				...this.$route.query,
				is_download: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		handleClickMore(name) {
			if (name === 'send') {
				this.$router.push(getHashUrl('/hr/recruit/school/summary/email', {
					applicant_id: this.$route.query.applicant_id,
					recruitType: 'school'
				}));
			} else {
				this.$router.push(getHashUrl('/hr/recruit/school/summary/elists', { recruitType: 'school' }));
			}
		}
	},
};
</script>

<style lang="scss">
.v-hr-recruit-school-summary-offer {
	overflow: auto;
	height: 100%;
	.vm-tools-preview {
		position: relative !important;
		display: block !important;
		z-index: 0 !important;
		.__content {
			overflow: unset !important;
			max-height: 100% !important;
			max-width: 100% !important;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20px 0 40px 0;
		}
	}
	._more {
		width: 100px;
		color:#f14b5f;
		padding-left: 15px;
		padding-right: 15px;
		line-height: 30px;
		border: 1px solid #f14b5f;
		border-radius: 4px;
	}
}
</style>
