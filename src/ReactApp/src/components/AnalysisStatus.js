/* 
 *  Copyright (c) 2019,2021 Beawre Digital SL
 *  
 *  This program and the accompanying materials are made available under the
 *  terms of the Eclipse Public License 2.0 which is available at
 *  http://www.eclipse.org/legal/epl-2.0.
 *  
 *  SPDX-License-Identifier: EPL-2.0 3
 *  
 */

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