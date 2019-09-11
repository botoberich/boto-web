import React from 'react';

// UI
import { Tooltip, Icon, Input } from 'antd';
import styles from './AlbumForm.module.css';

export function useAlbumForm({ initialTitle, initialDesc }) {
    const [title, setTitle] = React.useState(initialTitle);
    const [desc, setDesc] = React.useState(initialDesc);
    const [validInput, setValidInput] = React.useState(true);

    return {
        title,
        setTitle,
        desc,
        setDesc,
        validInput,
        setValidInput,
    };
}

function AlbumForm({ setTitle, title, setDesc, desc, validInput, setValidInput }) {
    return (
        <>
            <div className={styles.inputRow}>
                <Tooltip placement="topLeft" title="Please enter a title" visible={!validInput}>
                    <Input
                        onChange={e => {
                            setValidInput(true);
                            setTitle(e.target.value);
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
                    onChange={e => setDesc(e.target.value)}
                    placeholder="Description"
                    prefix={<Icon type="tags" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={
                        <Tooltip title="Enter the description for the album">
                            <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                    value={desc}
                />
            </div>
        </>
    );
}

export default AlbumForm;
