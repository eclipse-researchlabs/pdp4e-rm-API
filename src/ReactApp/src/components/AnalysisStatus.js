import React from 'react';
import {Tag} from 'antd';
import { withTranslation } from 'react-i18next';

const AnalysisStatus = ({title, count, t}) => {
    let color = "";

    switch (count) {
        case 1:
            color="red";
            break;
        case 2:
            color="orange";
            break;
        default: 
            if (count >= 3) {
                color = "green";
            }
            break;
    }
    return (
        <Tag color={color}>{`${t(`Assets.analysis.${title}.title`)}:${count}`}</Tag>
    )
}

export default withTranslation()(AnalysisStatus);