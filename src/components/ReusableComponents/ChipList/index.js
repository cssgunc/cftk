import React from 'react';
import { Chip } from '@material-ui/core';
import AlertDialogue from '../AlertDialogue'


const ChipList = (props) => {

    return (
        <div>
            {props.list.map((item, index) => (
                <Chip key={index} color={props.color} label={item} style={{margin: 6}}
                    onClick={props.onClick} onDelete={() => props.onDelete(item)}
                />
            ))}
        </div>
    );
};

export default ChipList;