import React from "react";
import HSBar from "react-horizontal-stacked-bar-chart";
import { Card, Col, Row, Popover } from "antd";

class GDPRAssessmnet extends React.Component {
  render() {
    let principals = [
      {
        name: "Lawfulness",
        id: "lawfulness",
        description:
          "The principle of lawfulness will be violated since there will be no lawful grounds for processing, as provided in article 6 of the GDPR. Lawfulness is deemed respected if the data subject has consented to the processing for specific purposes, if such processing is necessary for the performance of a contract or for compliance with a legal obligation, to protect the vital interests of the subject or of another natural person, or “for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data” and particularly when the data subject is a child."
      },
      {
        name: "Transparency",
        id: "transparency",
        description:
          "The principle of transparency will not be complied with, because data subject will not be informed about the processing activities over their data. The data subject might not be even aware at all that such personal data have been collected, used, consulted or otherwise processed and what is the extent of this processing (Recital 39 GDPR). Consequently, there will be no information provided relating to the processing of those personal data, in particular, on the identity of the controller and the purposes of the processing and further information to ensure fair and transparent processing. Natural persons will not be made aware of risks, rules, safeguards and rights in relation to the processing of personal data and how to exercise their rights."
      },
      {
        name: "Purpose limitation",
        id: "purposelimitation",
        description:
          "Purpose limitation principle will be also jeopardized since the controller, unable to establish the existence of the personal data, will not be able to ensure that the data collection is limited to “specified, explicit and legitimate purposes” (Article 5 (1) (b) GDPR). Moreover, in this case the controller will be collecting the personal data without knowing itself how and when these data will be used, since in its system the data is not identified as personal."
      },
      {
        name: "Data minimisation",
        id: "dataminimisation",
        description:
          "Data minimisation and storage limitation principles will be  violated since the unawareness about the treatment of the personal data or its mere existence will not allow us to establish whether the same purpose can be achieved with a narrower collection of data and for a shorter retention period."
      },
      {
        name: "Storage limitation",
        id: "storagelimitation",
        description:
          "Data minimisation and storage limitation principles will be  violated since the unawareness about the treatment of the personal data or its mere existence will not allow us to establish whether the same purpose can be achieved with a narrower collection of data and for a shorter retention period."
      },
      {
        name: "Accuracy",
        id: "accuracy",
        description:
          "The inability to establish that the personal data exist in the system or that a third party can establish links between different pieces of information and, consequently, guess the existence of such data, will prevent us from ensuring that the data are accurate and kept up to date. As a result of this unawareness, controllers will not be able to ensure accuracy at all stages of collecting and processing of personal data and take every reasonable step to ensure that inaccurate data are erased or rectified without delay. Thus, contrary to the principle of accuracy, controllers will not make sure that outdated data are eliminated, or that data are correctly interpreted."
      },
      {
        name: "Integrity and Confidentiality",
        id: "integrityandconfidentiality",
        description:
          "The compliance with the principle of integrity and confidentiality will be also jeopardized since the processing of the data, deemed as non-personal, will not be as secure as required for the personal data processing, “including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage, using appropriate technical or organisational measures” (Article 5(1)(f) GDPR). This will result in a lack of appropriate controls to prevent unauthorised access to the personal data as well as implement systemic quality controls in order to ensure that an appropriate level of security is reached. Moreover, the personal data will not be validated (e.g. using hashes), which might lead to some negative consequences, such as inability to guarantee its integrity and, consequently, the accuracy of that data."
      },
      {
        name: "Accountability",
        id: "accountability",
        description:
          "According to the principle of accountability, the controller shall be responsible for, and be able to demonstrate compliance with, principles relating to processing of personal data and listed in Article 5 of the GDPR. The non-respect for one of these principles will trigger the accountability obligation."
      }
    ];
    principals = principals.map(principal => {
      const d = [
        {
          name: "Unmitigated",
          value: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
          color: "red"
        },
        {
          name: "Mitigated",
          value: Math.floor(Math.random() * (5 - 0 + 1)) + 0,
          color: "lightgreen"
        }
      ];
      return {
        ...principal,
        data: d
      };
    });
    let subjectRights = [
      {
        name: "Right to be informed",
        id: "righttobeinformed",
        description:
          "Since linkability in many cases is undetected because the personal data is not recognized as such and is not traceable in the system, the controller will not comply with information obligation, as substantiated in Articles 13-14. Thus, data subjects will be deprived of the right to obtain information about the processing activities over their data, the identity and the contact details of the controller, the purposes of the processing, the categories of the data and their recipients, and how the data are being controlled, monitored or used further (Article 13 GDPR). The information obligation is the essential first step setting out the stage towards the exercise of other data subjects’ rights. Neither right of access, nor right to rectification or erasure of personal data, nor restriction or objecting to their processing will be possible unless the data subject knows the personal data is processed by the controller."
      },
      {
        name: "Right of access",
        id: "rightofaccess",
        description:
          "Since linkability in many cases is undetected because the personal data is not recognized as such and is not traceable in the system, the controller will not comply with information obligation, as substantiated in Articles 13-14. Thus, data subjects will be deprived of the right to obtain information about the processing activities over their data, the identity and the contact details of the controller, the purposes of the processing, the categories of the data and their recipients, and how the data are being controlled, monitored or used further (Article 13 GDPR). The information obligation is the essential first step setting out the stage towards the exercise of other data subjects’ rights. Neither right of access, nor right to rectification or erasure of personal data, nor restriction or objecting to their processing will be possible unless the data subject knows the personal data is processed by the controller."
      },
      {
        name: "Right to data portability",
        id: "righttodataportability",
        description:
          "Since linkability in many cases is undetected because the personal data is not recognized as such and is not traceable in the system, the controller will not comply with information obligation, as substantiated in Articles 13-14. Thus, data subjects will be deprived of the right to obtain information about the processing activities over their data, the identity and the contact details of the controller, the purposes of the processing, the categories of the data and their recipients, and how the data are being controlled, monitored or used further (Article 13 GDPR). The information obligation is the essential first step setting out the stage towards the exercise of other data subjects’ rights. Neither right of access, nor right to rectification or erasure of personal data, nor restriction or objecting to their processing will be possible unless the data subject knows the personal data is processed by the controller."
      },
      {
        name: "Right to rectification",
        id: "righttorectification",
        description:
          "Since linkability in many cases is undetected because the personal data is not recognized as such and is not traceable in the system, the controller will not comply with information obligation, as substantiated in Articles 13-14. Thus, data subjects will be deprived of the right to obtain information about the processing activities over their data, the identity and the contact details of the controller, the purposes of the processing, the categories of the data and their recipients, and how the data are being controlled, monitored or used further (Article 13 GDPR). The information obligation is the essential first step setting out the stage towards the exercise of other data subjects’ rights. Neither right of access, nor right to rectification or erasure of personal data, nor restriction or objecting to their processing will be possible unless the data subject knows the personal data is processed by the controller."
      },
      {
        name: "Right to be forgotten",
        id: "righttobeforgotten",
        description:
          "Since linkability in many cases is undetected because the personal data is not recognized as such and is not traceable in the system, the controller will not comply with information obligation, as substantiated in Articles 13-14. Thus, data subjects will be deprived of the right to obtain information about the processing activities over their data, the identity and the contact details of the controller, the purposes of the processing, the categories of the data and their recipients, and how the data are being controlled, monitored or used further (Article 13 GDPR). The information obligation is the essential first step setting out the stage towards the exercise of other data subjects’ rights. Neither right of access, nor right to rectification or erasure of personal data, nor restriction or objecting to their processing will be possible unless the data subject knows the personal data is processed by the controller."
      },
      {
        name: "Right to restriction of processing",
        id: "righttorestrictionofprocessing",
        description:
          "Since linkability in many cases is undetected because the personal data is not recognized as such and is not traceable in the system, the controller will not comply with information obligation, as substantiated in Articles 13-14. Thus, data subjects will be deprived of the right to obtain information about the processing activities over their data, the identity and the contact details of the controller, the purposes of the processing, the categories of the data and their recipients, and how the data are being controlled, monitored or used further (Article 13 GDPR). The information obligation is the essential first step setting out the stage towards the exercise of other data subjects’ rights. Neither right of access, nor right to rectification or erasure of personal data, nor restriction or objecting to their processing will be possible unless the data subject knows the personal data is processed by the controller."
      },
      {
        name: "Right to object",
        id: "righttoobject",
        description:
          "Since linkability in many cases is undetected because the personal data is not recognized as such and is not traceable in the system, the controller will not comply with information obligation, as substantiated in Articles 13-14. Thus, data subjects will be deprived of the right to obtain information about the processing activities over their data, the identity and the contact details of the controller, the purposes of the processing, the categories of the data and their recipients, and how the data are being controlled, monitored or used further (Article 13 GDPR). The information obligation is the essential first step setting out the stage towards the exercise of other data subjects’ rights. Neither right of access, nor right to rectification or erasure of personal data, nor restriction or objecting to their processing will be possible unless the data subject knows the personal data is processed by the controller."
      },
      {
        name:
          "Right not to be subject to a decision based solely on automated processing",
        id: "rightnottobesubjecttoadecisionbasedsolelyonautomatedprocessing",
        description:
          "Since linkability in many cases is undetected because the personal data is not recognized as such and is not traceable in the system, the controller will not comply with information obligation, as substantiated in Articles 13-14. Thus, data subjects will be deprived of the right to obtain information about the processing activities over their data, the identity and the contact details of the controller, the purposes of the processing, the categories of the data and their recipients, and how the data are being controlled, monitored or used further (Article 13 GDPR). The information obligation is the essential first step setting out the stage towards the exercise of other data subjects’ rights. Neither right of access, nor right to rectification or erasure of personal data, nor restriction or objecting to their processing will be possible unless the data subject knows the personal data is processed by the controller."
      }
    ];
    subjectRights = subjectRights.map(sR => {
      const d = [
        {
          name: "Unmitigated",
          value: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
          color: "red"
        },
        {
          name: "Mitigated",
          value: Math.floor(Math.random() * (5 - 0 + 1)) + 0,
          color: "lightgreen"
        }
      ];
      return {
        ...sR,
        data: d
      };
    });

    return (
      <Row>
        <Col span={11}>
          <Card title="GDPR Principals">
            {principals.map(principal => (
              <div key={principal.id}>
                <Popover
                  content={principal.description}
                  placement="bottomLeft"
                  style={{ width: 400 }}
                >
                  <p>{principal.name}</p>
                </Popover>
                <HSBar
                  height={30}
                  id={principal.id}
                  showTextIn
                  data={principal.data}
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col span={2} />
        <Col span={11}>
          <Card title="GDPR Subject Rights">
            {subjectRights.map(sR => (
              <div key={sR.id}>
                <Popover content={sR.description} placement="bottomRight">
                  <p>{sR.name}</p>
                </Popover>
                <HSBar height={30} id={sR.id} showTextIn data={sR.data} />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    );
  }
}

export default GDPRAssessmnet;
