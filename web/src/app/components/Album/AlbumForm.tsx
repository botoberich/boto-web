import React from 'react';

// UI
import { Tooltip, Icon, Input } from 'antd';
import styles from './AlbumForm.module.css';
// import { useDispatch } from 'react-redux';
// import { setAlbumCreateFormData } from '../../redux/album/album.actions';
import { useFormContext } from '../../contexts/FormContext';

function AlbumForm() {
    const {
        albumForm: { title, description },
        setAlbumForm,
    } = useFormContext();

    return (
        <>
            <div className={styles.inputRow}>
                <Input
                    onChange={e => {
                        setAlbumForm({ description, title: e.target.value });
                    }}
                    placeholder="Title"
                    prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    required
                    value={title}
                />
            </div>
            <div className={styles.inputRow}>
                <Input
                    onChange={e => {
                        setAlbumForm({ title, description: e.target.value });
                    }}
                    placeholder="Description"
                    prefix={<Icon type="tags" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    value={description}
                />
            </div>
        </>
    );
}

export default AlbumForm;
