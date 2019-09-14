import React from 'react';

// UI
import { Tooltip, Icon, Input } from 'antd';
import styles from './AlbumForm.module.css';
import { useDispatch } from 'react-redux';
import { setAlbumCreateFormData } from '../../redux/album/album.actions';
import { useFormContext } from '../../contexts/FormContext';

function AlbumForm() {
    const {
        albumForm: { title, description },
        setAlbumForm,
    } = useFormContext();

    return (
        <>
            <div className={styles.inputRow}>
                <Tooltip placement="topRight" title="Please enter a title" visible={title.length === 0}>
                    <Input
                        onChange={e => {
                            setAlbumForm({ description, title: e.target.value });
                        }}
                        placeholder="Title"
                        prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        required
                        suffix={
                            <Tooltip title="Enter the title for the album">
                                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                        value={title}
                    />
                </Tooltip>
            </div>
            <div className={styles.inputRow}>
                <Input
                    onChange={e => {
                        setAlbumForm({ title, description: e.target.value });
                    }}
                    placeholder="Description"
                    prefix={<Icon type="tags" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={
                        <Tooltip title="Enter the description for the album">
                            <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                    value={description}
                />
            </div>
        </>
    );
}

export default AlbumForm;
