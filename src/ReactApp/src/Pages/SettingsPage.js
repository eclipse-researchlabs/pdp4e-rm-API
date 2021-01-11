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
import {withTranslation} from 'react-i18next';

class SettingsPage extends React.Component {
    render() {
        return (
            <h3>{this.props.t('Settings.text')}</h3>
        );
    }
}

export default withTranslation()(SettingsPage);