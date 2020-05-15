import React from "react";
import { withTranslation } from "react-i18next";
import {
    Button,
    Tag,
    Modal,
    Radio,
    Row, Tooltip,
    Col,
    message,
} from "antd";
import BackendService from "./BackendService";
import * as _ from "lodash";

class DfdQuestionaire extends React.Component {
    assetsApi = new BackendService(`assets`);

    constructor(props) {
        super(props);

        this.state = {
            nodes: props.nodes,
            showModal: false,
            questions: null,
            answeredEntries: 0,
            totalEntries: 1,
        };
    }

    componentDidMount() {
        fetch("dfdQuestionaire.json")
            .then(r => r.json())
            .then(r => {
                this.setState({ questions: r });
                this.updateQuestionaireList();
            });
    }
    updateQuestionaire = (id, value) => {
        var questions = this.state.questions;
        questions[this.getCurrentDataType()].filter(x => x.Id === id)[0].value = value.target.value;
        this.setState({ questions });
    }

    updateQuestionaireList = () => {
        var payload = JSON.parse(this.props.currentRecord.payload || "{}");
        if (payload === null) payload = {};
        var dfdAnswers = payload["DfdQuestionaire"]

        if (this.state.questions === null || this.state.questions[this.getCurrentDataType()] === undefined) return;

        var questions = this.state.questions;
        questions[this.getCurrentDataType()].forEach(entry => {
            var savedEntry = (dfdAnswers || []).filter(x => x.id === entry.Id)[0];
            if (savedEntry === null || savedEntry === undefined) {
                if (entry.isVisible === undefined) {
                    entry.isVisible = false;
                    entry.value = 'na';
                }
                if (entry.requires !== undefined) {
                    var requiredCondition = questions[this.getCurrentDataType()].filter(x => x.Id === entry.requires)[0];
                    if (requiredCondition !== null && requiredCondition.value === 'yes') entry.isVisible = true;
                    else entry.isVisible = false;
                } else
                    entry.isVisible = true;
            } else {
                entry.isVisible = savedEntry.isVisible;
                entry.value = savedEntry.value;
            }
        })

        var totalEntries = questions[this.getCurrentDataType()].filter(x => x.isVisible).length;
        var answeredEntries = questions[this.getCurrentDataType()].filter(x => x.isVisible && x.value !== 'na').length;

        this.setState({ questions, totalEntries, answeredEntries })
    }

    saveProfile = () => {
        var values = this.state.questions[this.getCurrentDataType()].map(x => { return ({ id: x.Id, value: x.value, isVisible: x.isVisible }) });

        this.assetsApi.put(`dfdQuestionaire`, { assetId: this.props.currentRecord.id, payload: JSON.stringify(values) }).then(() => {
            var payload = JSON.parse(this.props.currentRecord.payload || "{}");
            if (payload["DfdQuestionaire"] === undefined) payload["DfdQuestionaire"] = [];
            payload["DfdQuestionaire"] = values;
            this.props.currentRecord.payload = JSON.stringify(payload);
            message.success(`Questionaire saved!`)
        });

    };

    getTag = percent => {
        if (percent > 99) {
            return <Tag color="green">Completed in: {Math.round(percent)} %</Tag>;
        } else if (percent > 70) {
            return <Tag color="orange">Completed in: {Math.round(percent)} %</Tag>;
        } else {
            return <Tag color="red">Completed in: {Math.round(percent)} %</Tag>;
        }
    };

    getCurrentDataType = () => {
        if (
            !_.isEmpty(this.props.currentRecord) &&
            !!this.props.currentRecord.payload
        ) {
            var payload = JSON.parse(this.props.currentRecord.payload || { Color: '' });
            if (payload != null) {
                var color = payload.Color || "";
                if (color === "#69C0FF") {
                    return "entity";
                } else if (color === "#B37FEB") {
                    return "process";
                } else if (color === "#5CDBD3") {
                    return "dataStore";
                }
            }
        }
        return null;
    };

    render() {
        if (this.state.questions === null || this.state.questions[this.getCurrentDataType()] === undefined) return (<span></span>);

        return (
            <div>
                {(this.state.questions != null) && (
                    <span>
                        <div><span>{this.getCurrentDataType()} {this.getTag((this.state.answeredEntries / this.state.totalEntries) * 100)}</span></div>
                        {this.state.questions[this.getCurrentDataType()].map(question => (
                            <Row style={{ padding: 10 }} key={question.Id}>
                                <Col span={16}>
                                    <Tooltip placement="top" title={question.description}>{question.title}</Tooltip>
                                </Col>
                                <Col span={8}>
                                    <Radio.Group style={{ float: 'right' }} disabled={!(this.state.questions[this.getCurrentDataType()].filter(x => x.Id === question.Id)[0].isVisible)}
                                        onChange={(e) => this.updateQuestionaire(question.Id, e)} defaultValue="na" value={this.state.questions[this.getCurrentDataType()].filter(x => x.Id === question.Id)[0].value} buttonStyle="solid">
                                        <Radio.Button value="na">No answer</Radio.Button>
                                        <Radio.Button value="yes">Yes</Radio.Button>
                                        <Radio.Button value="no">No</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        )
                        )}
                        <Row>
                            <Col span={20}></Col>
                            <Col span={4}>
                                <Button type="primary" onClick={() => this.saveProfile()}>Save</Button>
                            </Col>
                        </Row>
                    </span>
                )}
            </div>
        );
    }
}

export default withTranslation()(DfdQuestionaire);
