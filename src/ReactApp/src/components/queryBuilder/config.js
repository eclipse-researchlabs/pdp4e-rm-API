import React from 'react';
import merge from 'lodash/merge';
import { Widgets, Operators, BasicConfig } from 'react-awesome-query-builder';
import en_US from 'antd/lib/locale-provider/en_US';
const { FieldDropdown } = Widgets;

const conjunctions = {
    ...BasicConfig.conjunctions
};

const operators = {
    ...BasicConfig.operators,
    // examples of  overriding
    between: {
        ...BasicConfig.operators.between,
        valueLabels: [
            'Value from',
            'Value to'
        ],
        textSeparators: [
            'from',
            'to'
        ],
    },
    less_or_equal: {
        ...BasicConfig.operators.less_or_equal,
        label: "before",
    },
    greater_or_equal: {
        ...BasicConfig.operators.greater_or_equal,
        label: "after",
    },
    like: {
        label: "includes"
    }
};

const widgets = {
    ...BasicConfig.widgets,
    // examples of  overriding
    text: {
        ...BasicConfig.widgets.text,
        validateValue: (val, fieldDef) => {
            return (val.length < 10);
        },
    },
    date: {
        ...BasicConfig.widgets.date,
        dateFormat: 'DD.MM.YYYY',
        valueFormat: 'YYYY-MM-DD',
    },
    time: {
        ...BasicConfig.widgets.time,
        timeFormat: 'HH:mm',
        valueFormat: 'HH:mm:ss',
    },
    datetime: {
        ...BasicConfig.widgets.datetime,
        timeFormat: 'HH:mm',
        dateFormat: 'DD.MM.YYYY',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
    }
};


const types = {
    ...BasicConfig.types,
    // examples of  overriding
};


const localeSettings = {
    locale: {
        short: 'en',
        full: 'en-US',
        antd: en_US,
    },
    valueLabel: "Value",
    valuePlaceholder: "Value",
    fieldLabel: "Field",
    operatorLabel: "Operator",
    fieldPlaceholder: "Select field",
    operatorPlaceholder: "Select operator",
    deleteLabel: null,
    addGroupLabel: "Add group",
    addRuleLabel: "Add rule",
    delGroupLabel: null,
    notLabel: "Not",
    valueSourcesPopupTitle: "Select value source",
    removeRuleConfirmOptions: {
        title: 'Are you sure delete this rule?',
        okText: 'Yes',
        okType: 'danger',
    },
    removeGroupConfirmOptions: {
        title: 'Are you sure delete this group?',
        okText: 'Yes',
        okType: 'danger',
    },
};

const settings = {
    ...BasicConfig.settings,
    ...localeSettings,

    valueSourcesInfo: {
        value: {
            label: "Value"
        },
        // field: {
        //     label: "Field",
        //     widget: "field",
        // },
    },
    maxNesting: 3,
    canLeaveEmptyGroup: true, //after deletion
    renderOperator: (props) => <FieldDropdown {...props} />,
};

let fields = {}

export default {
    conjunctions,
    operators,
    widgets,
    types,
    settings,
    fields,
};
