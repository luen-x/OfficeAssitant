import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Confirm } from "@components/_common/confirm/confirm";
import API_ROOT from "@stores/apis/root";

export default {
	data() {
		return {
			columns: [{
				type: 'selection',
				width: 50,
			},
			{
				title: '标题',
				key: 'title',
				minWidth: 220,
				render: (h, params) => {
					return (
						<div class="g-operation" onClick={() => {
							this.$router.push(
								{ 
									path: '/content/preview',
									query: { 
										information_id: params.row.information_id,
										keyword: params.row.keyword,
										status: 1
									}  
								}
							);
						}}>
							<AutoToolTip 
								content={params.row.title}
								width="180px"
								theme="dark"
								placement="bottom-start"
							/>
						</div>
					);
				}
			},
			{
				title: '浏览量',
				key: 'browse_number',
				minWidth: 120
			},
			{
				title: '添加人',
				key: 'staff_name',
				minWidth: 120
			},
			{
				title: '添加时间',
				key: 'create_date',
				minWidth: 160
			},
			{
				title: '操作',
				key: 'link',
				minWidth: 120,
				render: (h, params) => {
					let edit = this.$auth[56] ? "inline-block" : "none";
					let del = this.$auth[57] ? "inline-block" : "none";

					return (
						<div class="g-m-r-20" style="min-width: 150px;">
							<span 
								class="g-pointer"
								style={{ color: "#2397f9", display: edit, padding: "2px 8px 2px 0px" }}
								onClick={
									() => {
										this.$router.push({
											path: '/content/information/manage/preview',
											query: {
												status: 1,
												information_id: params.row.information_id
											}
										});
									}
								}
							>
								编辑
							</span>
							<span style={{ color: "#2397f9", display: edit, width: "1px", height: "10px" }}>
								|
							</span>
							<span class="g-pointer"
								style={{ color: "#2397f9", display: del, padding: "2px 8px" }}
								onClick={
									() => {
										Confirm.popup({
											title: "温馨提示",
											msg: "确定删除这条咨询吗？",
											content: "确定删除这条咨询吗？"
										}).then(res => {
											this.$request({
												url: API_ROOT._CONTENT_INFORMATION_MANAGE_DEL_POST,
												type: "POST",
												param: {
													information_id: params.row.information_id
												}
											}).then(ress => {
												this.$Message.success(ress.msg);
												this.handleResetCur();
											}).catch(error => {
												this.$Message.error(error.msg);
											});
										});
									}
								}
							>
								删除
							</span>
						</div>
					);
				}
			}]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_INFORMATION_MANAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_INFORMATION_MANAGE_LIST_RESET', {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};