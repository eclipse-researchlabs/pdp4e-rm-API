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