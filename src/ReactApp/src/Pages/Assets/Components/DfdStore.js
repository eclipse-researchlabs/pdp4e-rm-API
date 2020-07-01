import React from "react";
import { decorate } from "mobx";
import { Tag } from "antd";
import * as _ from "lodash";

class DfdStoreWrapper {
    questions;

    constructor() {
        fetch("dfdQuestionaire.json")
            .then(r => r.json())
            .then(r => {
                this.questions = r;
                console.log('qs', this.questions)
            });

    }

    getTag = percent => {
        if (percent > 99) {
            return <Tag color="green">Completed in: {Math.round(percent)} %</Tag>;
        } else if (percent > 70) {
            return <Tag color="orange">Completed in: {Math.round(percent)} %</Tag>;
        } else {
            return <Tag color="red">Completed in: {Math.round(percent)} %</Tag>;
        }
    };

    getCurrentDataType = (payload) => {
        if (payload !== null && payload !== undefined) {
            var item = this.getDataType(payload);
            if (item !== undefined) return item;
            if (payload.assetType !== undefined && payload.assetType === "edge") return "dataFlow";
        }
        return undefined;
    };

    getDataType = (payload) => {
        if (typeof payload === 'string' || payload instanceof String) payload = JSON.parse(payload || `{ "Color": "" }`);
        if (payload != null) {
            var color = payload.Color || "";
            if (color === "#69C0FF") {
                return `entity`;
            } else if (color === "#B37FEB") {
                return `process`;
            } else if (color === "#5CDBD3") {
                return `dataStore`;
            } else if (color === "#999999") {
                return `dataFlow`;
            } else return `dataFlow`;
        }
        return undefined;
    }

    applyAnswers = (payload) => {
        if (typeof payload === 'string' || payload instanceof String) payload = JSON.parse(payload || "{}");
        if (payload === null) payload = {};
        var dfdAnswers = payload["DfdQuestionaire"]

        var questions = this.questions;
        if (questions === null || questions[this.getCurrentDataType(payload)] === undefined) return;

        questions[this.getCurrentDataType(payload)].forEach(entry => {
            if (entry.type === undefined) entry.type = "boolean";
            if (entry.isVisible === undefined) entry.isVisible = false;
            if (entry.type === "list") {
                entry.possibleValues = [];
                // switch (entry.source) {
                //     case "dataStores": entry.possibleValues = this.props.nodes.filter(x => this.getDataType(x.payload) === "dataStore").map(x => { return { key: x.id, value: x.name } });
                // }
            }
            if (entry.value === undefined) {
                if (entry.type === "list") entry.value = [];
                else entry.value = "na";
            }

            var savedEntry = (dfdAnswers || []).filter(x => x.id === entry.Id)[0];
            if (entry.requires !== undefined) {
                var requiredCondition = questions[this.getCurrentDataType(payload)].filter(x => x.Id === entry.requires)[0];
                if (requiredCondition !== null && requiredCondition !== undefined && requiredCondition.value === 'yes') entry.isVisible = true;
                else entry.isVisible = false;
            } else
                entry.isVisible = true;
            if (savedEntry) {
                entry.isVisible = savedEntry.isVisible;
                entry.value = savedEntry.value;
            }
        });
        return questions;
    }

    getCompletedPercentage = (payload) => {
        var type = this.getCurrentDataType(payload);
        var questions = this.applyAnswers(payload);

        if (questions === undefined || questions[type] === undefined) return 0;

        var totalEntries = questions[type].filter(x => x.isVisible).length;
        var answeredEntries = questions[type].filter(x => x.isVisible && (x.value !== 'na' && x.value.length > 0)).length;

        return (answeredEntries / totalEntries) * 100;
    }
}

const DfdStore = decorate(DfdStoreWrapper, {
});

export default new DfdStore();
