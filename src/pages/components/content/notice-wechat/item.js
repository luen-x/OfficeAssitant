import { Switch } from 'iview';
import { WeChatLook } from './modal/wechat-look';

export default {
	data() {
		return {
			flag: true,
			columns: [
				{
					title: '消息类型',
					key: 'type_name',
					minWidth: 220,
					fixed: "left",
					render: (h, params) => {
						return (
							<div 
								class="g-c-blue-light g-pointer" 
								onClick={() => this.handleLookWeChat(params.row)}
							>
								{params.row.type_name}
							</div>
						);
					}
				},
				{
					title: '模板ID',
					key: 'template_id',
					minWidth: 200
				},
				{
					title: '消息生成板块',
					key: 'project_type_name',
					minWidth: 160
				},
				{
					title: '操作',
					key: 'is_open',
					minWidth: 120,
					render: (h, params) => {
						return (
							<Switch value={!!+params.row.is_open} onOn-change={() => this.handleChange(params.row)}>
								<span slot="open">开</span>
								<span slot="close">关</span>
							</Switch>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_NOTICE_WECHAT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_NOTICE_WECHAT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleLookWeChat(v) {
			WeChatLook.popup({
				detail: v
			}).then(res => {});
		},
		handleChange(v) {
			if (!this.flag) {
				return;
			}

			this.flag = false;
			
			this.$request({
				url: "_CONTENT_NOTICE_WECHAT_SWITCH_POST",
				type: "POST",
				param: {
					type_id: v.type_id,
					is_open: +v.is_open ? 0 : 1
				}
			}).then(res => {
				this.flag = true;
				this.$Message.success(res.msg);
				this.handleResetCur();
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};