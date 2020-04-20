import { Confirm } from "@components/_common/confirm/confirm";
import API_ROOT from "@stores/apis/root";
import { AddClassModal } from "../_common/popup/add-class";

export default {
	data() {
		return {
			columns: [
				{
					title: '　分类名称',
					key: 'category_name',
					render: (h, params) => {
						const { row: { __level__, __expand__, category_name, children }, index } = params;

						// 点击展开事件
						const handleClick = (e) => {
							this.$refs.tableTarget.expand({ index });
						};

						return (
							<div 
								class={children && "g-pointer"}
								style={{ marginLeft: `${(__level__ - 1) * 20}px`, boxSizing: 'content-box' }}
								onClick={handleClick}
							>
								<i 
									// eslint-disable-next-line max-len
									class={`iconfont g-c-black2 g-fs-12 g-m-r-10 ${children ? !__expand__ ? 'icon-triangle-right' : 'icon-triangle-down' : ''}`}
								/>
								<span>{category_name}</span>
							</div>
						);
					}
				},
				{
					title: '资讯数量',
					key: 'material_num'
				},
				{
					title: '操作',
					key: 'link',
					render: (h, params) => {
						let edit = this.$auth[59] ? "inline-block" : "none";
						let del = this.$auth[60] ? "inline-block" : "none";

						return (
							<div class="g-m-r-20" style="min-width: 150px;">
								<span 
									class="g-pointer"
									style={{ color: "#2397f9", display: edit, padding: "2px 8px 2px 0px" }}
									onClick={
										() => {
											AddClassModal.popup(
												{ 
													material_type: 2,
													category_id: String(params.row.category_id),
													del: true,
													flag: params.row.children ? 1 : 0
												}
											).then(res => {
												res && this.$store.commit('CONTENT_INFORMATION_CLASSIFY_LIST_RESET', { type: this.type });
											});
										}
									}
								>
									编辑
								</span>
								<span style={{ color: "#2397f9", display: edit, width: "1px", height: "10px" }}>
									|
								</span>
								<span 	
									class="g-pointer"
									style={{ color: "#2397f9", display: del, padding: "2px 8px" }}
									onClick={
										() => {
											Confirm.popup({
												title: "温馨提示",
												msg: "确定删除该分类吗？",
												content: "确定删除该分类吗？"
											}).then(res => {
												if (res == 1) {
													this.$request({
														url: API_ROOT._CONTENT_INFORMATION_MATERIAL_DELS_GET,
														type: "POST",
														param: {
															category_id: params.row.category_id,
														}
													}).then(ress => {
														this.$Message.success(ress.msg);
														this.handleResetCur();
													}).catch(error => {
														this.$Message.error(error.msg);
													});
												}
											});
										}
									}
								>
									删除
								</span>
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_INFORMATION_CLASSIFY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_INFORMATION_CLASSIFY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},

		handleExpand(index) {
			const page = this.$refs.tableTarget.currentPage;
			const data = this.listInfo.data[page];
			const { __children__, __level__, __expand__ } = data[index] || {};
			// 没有扩展功能
			if (!__children__ || !__level__) return;
			this.$nextTick(() => {
				if (__expand__) {
					data[index].__expand__ = false;
					// 计算要移除的元素数量
					let count = 0;
					for (let i = index + 1; i < data.length; i++) {
						if (__level__ == data[i].__level__ || __level__ > data[i].__level__) {
							break;
						}
						count++;
					}
					data.splice(index + 1, count);
				} else {
					data[index].__expand__ = true;
					// 展开
					let fn = (pre, cur) => {
						pre = [...pre, cur];
						if (cur.__children__ && cur.__expand__ === true) {
							pre = [...pre, ...cur.__children__.reduce(fn, [])];
						}
						return pre;
					};
					let result = __children__.reduce(fn, []);
					data.splice(index + 1, 0, ...result);
				}
			});
		}
	}
};