import React, { memo, useState, useEffect } from 'react'
import { Tooltip, Modal } from 'antd'
import { useVirtualList } from 'ahooks'
import store from 'store'
import {
	LoadingOutlined,
	SyncOutlined,
	SwapOutlined,
	ClearOutlined,
	CloseCircleOutlined,
	UserOutlined
} from '@ant-design/icons'
import styles from './index.less'

const { confirm } = Modal

interface IProps {
	visible: boolean
	loading_playlist: boolean
	loading_songlist: boolean
	playlist: Array<any>
	songlist: Array<any>
	hidePlayList: () => void
	getPlaylistDetail: (id: number) => void
	syncPlaylist: () => void
	syncPlaylistDetail: (id: number) => void
	getSongUrl: (id: number, song: any) => void
	showLogin: () => void
}

const Index = (props: IProps) => {
	const {
		visible,
		loading_playlist,
		loading_songlist,
		playlist,
		songlist,
		hidePlayList,
		getPlaylistDetail,
		syncPlaylist,
		syncPlaylistDetail,
		getSongUrl,
		showLogin
	} = props
	const [ state_active_playlist_item_id, setStateActivePlaylistItemId ] = useState<
		number | null
	>(null || store.get('playlist_active_id'))
	const [ state_active_songlist_item_id, setStateActiveSonglistItemId ] = useState<
		number | null
	>(null)

	const p_list = useVirtualList(playlist, {
		overscan: 15,
		itemHeight: 44
	})

	const s_list = useVirtualList(songlist, {
		overscan: 24,
		itemHeight: 48
	})

	useEffect(
		() => {
			if (playlist.length > 0) {
				const playlist_active_index = store.get('playlist_active_index')
				const playlist_active_id = store.get('playlist_active_id')

				if (typeof playlist_active_index === 'number') {
					if (playlist_active_id === playlist[playlist_active_index].id) {
						setStateActivePlaylistItemId(playlist_active_id)

						if (playlist_active_index - 6 > 0) {
							p_list.scrollTo(playlist_active_index - 6)
						} else {
							p_list.scrollTo(playlist_active_index)
						}

						return
					}
				}

				p_list.scrollTo(0)
			}
		},
		[ visible, playlist ]
	)

	useEffect(
		() => {
			if (songlist.length > 0) {
				const songlist_active_item = store.get('songlist_active_item')

				if (songlist_active_item) {
					if (
						songlist_active_item.id ===
						songlist[songlist_active_item.index].id
					) {
						setStateActiveSonglistItemId(songlist_active_item.id)

						if (songlist_active_item.index - 6 > 0) {
							s_list.scrollTo(songlist_active_item.index - 6)
						} else {
							s_list.scrollTo(songlist_active_item.index)
						}

						return
					}
				}

				s_list.scrollTo(0)
			}
		},
		[ songlist ]
	)

	return (
		<div
			className={`${styles._local} w_100 border_box flex justify_center fixed left_0 bottom_0`}
		>
			{visible && <div className='mask w_100vw h_100vh fixed top_0 left_0' />}
			{visible && (
				<div className='list_wrap w_100 h_100vh fixed top_0 left_0 flex justify_center align_center'>
					<div className='list border_box flex relative'>
						<div className='btn_close absolute cursor_point'>
							<CloseCircleOutlined
								style={{ color: 'white', fontSize: '24px' }}
								onClick={() => hidePlayList()}
							/>
						</div>
						<div className='options_wrap absolute w_100 border_box flex justify_between align_center'>
							<div className='left border_box flex justify_between align_center'>
								<span className='playlist_title'>playlist</span>
								<div className='right_options flex align_center'>
									<Tooltip title='sync playlist'>
										<SyncOutlined
											className='mr_12 ml_2'
											onClick={() => syncPlaylist()}
										/>
									</Tooltip>
									<Tooltip title='sync songlist'>
										<SwapOutlined
											className='sync mr_12'
											onClick={() => {
												if (
													state_active_playlist_item_id
												) {
													syncPlaylistDetail(
														state_active_playlist_item_id
													)
												}
											}}
										/>
									</Tooltip>
									<Tooltip title='clear storage'>
										<ClearOutlined
											className='mr_12'
											onClick={() => {
												confirm({
													className:
														'confirm_clear_storage',
													title: 'Confirm',
													icon: '',
													content:
														'Are you sure to delete all storage in your device,this option will also remove you account.',
													okText: 'confirm',
													cancelText: 'cancel',
													onOk: () => {
														store.clearAll()

														window.location.reload()
													}
												})
											}}
										/>
									</Tooltip>
									<Tooltip title='relogin,refresh cookie'>
										<UserOutlined
											onClick={() => showLogin()}
										/>
									</Tooltip>
								</div>
							</div>
							<div className='right border_box flex align_center relative'>
								<div className='th_items w_100 flex align_center'>
									<span className='th_item line_clamp_1'>
										title
									</span>
									<span className='th_item line_clamp_1'>
										producers
									</span>
									<span className='th_item line_clamp_1'>
										album
									</span>
								</div>
							</div>
						</div>
						<div className='top_mask playlist_mask absolute top_0 w_100' />
						<div className='bottom_mask playlist_mask absolute bottom_0 w_100' />
						<div
							className='playlist_wrap border_box'
							{...p_list.containerProps}
						>
							{loading_playlist ? (
								<div className='loading_wrap w_100 h_100 flex justify_center align_center'>
									<LoadingOutlined
										style={{
											fontSize: '24px',
											color: 'white'
										}}
									/>
								</div>
							) : (
								<div
									className='playlist h_100 border_box flex flex_column'
									{...p_list.wrapperProps}
								>
									{p_list.list.map(({ data, index }) => (
										<div
											className={`
                                                                              playlist_item 
                                                                              w_100 border_box flex align_center
                                                                              ${data.id ===
													state_active_playlist_item_id
														? 'active'
														: ''}
                                                                        `}
											key={index}
											onClick={() => {
												store.remove(
													'songlist_active_item'
												)

												store.set(
													'playlist_active_id',
													data.id
												)
												store.set(
													'playlist_active_index',
													index
												)

												setStateActivePlaylistItemId(
													data.id
												)
												getPlaylistDetail(data.id)
											}}
										>
											<img
												className='icon_playlist'
												src={require('@/image/icon_playlist.svg')}
												alt='icon_playlist'
											/>
											<span className='list_name line_clamp_1 transition_normal'>
												{data.name}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
						<div
							className='songlist_wrap border_box'
							{...s_list.containerProps}
						>
							{loading_songlist ? (
								<div className='loading_wrap w_100 h_100 flex justify_center align_center'>
									<LoadingOutlined
										style={{
											fontSize: '24px',
											color: 'white'
										}}
									/>
								</div>
							) : (
								<div
									className='songlist border_box'
									{...s_list.wrapperProps}
								>
									{s_list.list.map(({ data, index }) => (
										<div
											className={`
                                                                        songlist_item
                                                                        w_100 border_box flex align_center relative
                                                                        ${data.id ===
												state_active_songlist_item_id
													? 'active'
													: ''} 
                                                                  `}
											key={index}
											onClick={() => {
												store.set(
													'songlist_active_item',
													{
														index: index,
														id: data.id
													}
												)

												setStateActiveSonglistItemId(
													data.id
												)

												getSongUrl(data.id, data)
											}}
										>
											<img
												className='icon_song absolute left_0'
												src={require('@/image/icon_song.svg')}
												alt='icon_song'
											/>
											<span className='list_name line_clamp_1 transition_normal'>
												{data.name}
											</span>
											<div className='producer inline_block line_clamp_1 transition_normal'>
												{data.ar ? (
													data.ar.map(
														(item: any) => (
															<span
																className='producer_name'
																key={
																	item.id
																}
															>
																{
																	item.name
																}
															</span>
														)
													)
												) : (
													''
												)}
											</div>
											<span className='list_album line_clamp_1 transition_normal'>
												{data.al ? (
													data.al.name
												) : (
													''
												)}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default memo(Index)
