import { Confirm } from '@common/confirm/confirm';
import API_ROOT from '@stores/apis/root';
import { CourseModal } from './popup/course-modal';

export default {
	data() {
		return {
		};
	},
	computed: {
		getColumns() {
			let columns = [
				this.type == '3' ? {
					title: '活动类型',
					minWidth: 150,
					key: 'category_name',
				} : (this.type == '1' ? {
					title: '套系名称',
					minWidth: 150,
					key: 'name',
				} : {
					title: '课程类型',
					minWidth: 150,
					key: 'name',
				}),
				{
					title: '创建时间',
					minWidth: 150,
					key: 'create_time',
				},
				{
					title: '更新时间',
					minWidth: 150,
					key: 'update_time',
				},
				{
					title: '操作',
					minWidth: 100,
					key: 'options',
					render: (h, params) => {
						return (
							<div>
								{
									this.$auth[1316] ? <span class="g-operation" onClick={(e) => {
										this.handleEdit(params.row);
									}}>
									编辑
									</span> : ''
								}
								{ 
									this.$auth[1316] && this.$auth[1317]
										? this.type == '3' ? '' : <span style={{ 
											color: "#2397f9", 
											width: "1px", 
											height: "10px", 
											margin: "0 10px 0 10px" 
										}}>
									|
										</span> : ''
								}
								{ this.$auth[1317] ? this.type == '3' ? '' : <span class="g-operation" onClick={(e) => {
									this.handleDelete(params.row);
								}}>删除</span> : ''
								}
							</div>
							
						);
					}
				}
			];
			return columns;
		},
	},
	methods: {
		handleEdit(item) {
			CourseModal.popup({
				edit: 1,
				type: +this.type,
				datas: item
			}).then(res => {
				this.$store.commit('COLLAGE_SETTING_COURSE_LIST_INIT');
			});
		},
		handleDelete(item) {
			let arr = ['是否确认删除该套系及套系讲课提成设置？', '是否确认删除该课程及课程讲课提成设置？'];
			Confirm.popup({
				msg: arr[+this.type - 1],
				title: '提示'
			}).then(res => {
				this.$request({
					url: API_ROOT._COLLAGE_SETTING_COURSE_DELETE_POST,
					type: "GET",
					param: {
						lecture_set_id: item.lecture_set_id
					},
					loading: false
				}).then((re) => {
					this.$Message.warning('删除成功');
					this.$store.commit('COLLAGE_SETTING_COURSE_LIST_INIT');
				}).catch((error) => {
				});
			}).catch(() => {});
		},
		handleResetFirst() {
			this.$store.commit('COLLAGE_SETTING_COURSE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_SETTING_COURSE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

