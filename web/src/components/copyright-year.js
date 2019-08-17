import React from 'react';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export default () => {
    const d = new Date();

    return (
        <span>
        {d.getFullYear()} 
        {' '}
        {months[d.getMonth()]}
      </span>
    );
};
