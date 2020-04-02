import { decorate, observable, toJS } from "mobx";
import * as _ from "lodash";

class GDPRQuestionaireStoreWrapper {
  questions = JSON.parse(localStorage.getItem("gdpr-questionaire")) || [
    {
      name: "Principles",
      key: "principles",
      children: [
        {
          name: "Principle (a): Lawfulness, fairness and transparency",
          key: "lawfulness",
          link:
            "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/principles/lawfulness-fairness-and-transparency/",
          children: [
            {
              name: "Lawfulness",
              key: "lawfulness",
              children: [
                {
                  name:
                    "We have identified an appropriate lawful basis (or bases) for our processing.",
                  key: "idenifyBasis",
                  value: false
                },
                {
                  name:
                    "If we are processing special category data or criminal offence data, we have identified a condition for processing this type of data.",
                  key: "criminalData",
                  value: false
                },
                {
                  name:
                    "We don’t do anything generally unlawful with personal data.",
                  key: "noUnlawful",
                  value: false
                }
              ]
            },
            {
              name: "Fairness",
              key: "fairness",
              children: [
                {
                  name:
                    "We have considered how the processing may affect the individuals concerned and can justify any adverse impact.",
                  key: "consideredEffect",
                  value: false
                },
                {
                  name:
                    "We only handle people’s data in ways they would reasonably expect, or we can explain why any unexpected processing is justified.",
                  key: "onlyInExpected",
                  value: false
                },
                {
                  name:
                    "We do not deceive or mislead people when we collect their personal data.",
                  key: "noMislead",
                  value: false
                }
              ]
            },
            {
              name: "Transparency",
              key: "transparency",
              children: [
                {
                  name:
                    "We are open and honest, and comply with the transparency obligations of the right to be informed.",
                  key: "openAndHonest",
                  value: false
                }
              ]
            }
          ]
        },
        {
          name: "Principle (b): Purpose limitation",
          key: "purposeLimitation",
          link:
            "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/principles/purpose-limitation/",
          children: [
            {
              name:
                "We have clearly identified our purpose or purposes for processing.",
              key: "clearPurpose",
              value: false
            },
            {
              name: "We have documented those purposes.",
              key: "documentedPurpose",
              value: false
            },
            {
              name:
                "We include details of our purposes in our privacy information for individuals.",
              key: "detailedPurpose",
              value: false
            },
            {
              name:
                "We regularly review our processing and, where necessary, update our documentation and our privacy information for individuals.",
              key: "reviewedPurpose",
              value: false
            },
            {
              name:
                "If we plan to use personal data for a new purpose other than a legal obligation or function set out in law, we check that this is compatible with our original purpose or we get specific consent for the new purpose.",
              key: "compatiblePurpose",
              value: false
            }
          ]
        },
        {
          name: "Principle (c): Data minimisation",
          key: "dataMinimisation",
          link:
            "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/principles/data-minimisation/",
          children: [
            {
              name:
                "We only collect personal data we actually need for our specified purposes.",
              key: "actuallyNeeded",
              value: false
            },
            {
              name:
                "We have sufficient personal data to properly fulfil those purposes.",
              key: "sufficientToFulfil",
              value: false
            },
            {
              name:
                "We periodically review the data we hold, and delete anything we don’t need. ",
              key: "periodicallyReview",
              value: false
            }
          ]
        },
        {
          name: "Principle (d): Accuracy",
          key: "accuracy",
          link:
            "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/principles/accuracy/",
          children: [
            {
              name: "We ensure the accuracy of any personal data we create.",
              key: "ensureAcuracy",
              value: false
            },
            {
              name:
                "We have appropriate processes in place to check the accuracy of the data we collect, and we record the source of that data.",
              key: "haveProcessesToCheckAccuracy",
              value: false
            },
            {
              name:
                "We have a process in place to identify when we need to keep the data updated to properly fulfil our purpose, and we update it as necessary.",
              key: "haveProcessesWhenToKeep",
              value: false
            },
            {
              name:
                "If we need to keep a record of a mistake, we clearly identify it as a mistake.",
              key: "identifyMistake",
              value: false
            },
            {
              name:
                "Our records clearly identify any matters of opinion, and where appropriate whose opinion it is and any relevant changes to the underlying facts.",
              key: "identifyOpinion",
              value: false
            },
            {
              name:
                "We comply with the individual’s right to rectification and carefully consider any challenges to the accuracy of the personal data.",
              key: "complyWithRectification",
              value: false
            },
            {
              name:
                "As a matter of good practice, we keep a note of any challenges to the accuracy of the personal data.",
              key: "keepNoteOfChallenges",
              value: false
            }
          ]
        },
        {
          name: "Principle (e): Storage limitation ",
          key: "storageLimitation",
          link:
            "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/principles/storage-limitation/",
          children: [
            {
              name: "We know what personal data we hold and why we need it.",
              key: "whatAndWhy",
              value: false
            },
            {
              name:
                "We carefully consider and can justify how long we keep personal data.",
              key: "justifyHowLong",
              value: false
            },
            {
              name:
                "We have a policy with standard retention periods where possible, in line with documentation obligations.",
              key: "policyForRetention",
              value: false
            },
            {
              name:
                "We regularly review our information and erase or anonymise personal data when we no longer need it.",
              key: "reviewAndErase",
              value: false
            },
            {
              name:
                "We have appropriate processes in place to comply with individuals’ requests for erasure under ‘the right to be forgotten’.",
              key: "rightToBeForgotten",
              value: false
            },
            {
              name:
                "We clearly identify any personal data that we need to keep for public interest archiving, scientific or historical research, or statistical purposes.",
              key: "identifyForArchiving",
              value: false
            }
          ]
        }
      ]
    },
    {
      name: "Lawful basis for processing",
      key: "lawfulBasis",
      children: [
        {
          name: "Consent",
          key: "consent",
          children: [
            {
              name: "Asking for consent",
              key: "asking",
              children: [
                {
                  name:
                    "We have checked that consent is the most appropriate lawful basis for processing.",
                  key: "checked",
                  value: false
                },
                {
                  name:
                    "We have made the request for consent prominent and separate from our terms and conditions.",
                  key: "requested",
                  value: false
                },
                {
                  name: "We ask people to positively opt in.",
                  key: "askToOptIn",
                  value: false
                },
                {
                  name:
                    "We don’t use pre-ticked boxes or any other type of default consent.",
                  key: "noPreTicked",
                  value: false
                },
                {
                  name:
                    "We use clear, plain language that is easy to understand.",
                  key: "plainLanguage",
                  value: false
                },
                {
                  name:
                    "We specify why we want the data and what we’re going to do with it.",
                  key: "whyWeWantData",
                  value: false
                },
                {
                  name:
                    "We give separate distinct (‘granular’) options to consent separately to different purposes and types of processing.",
                  key: "giveOptions",
                  value: false
                },
                {
                  name:
                    "We name our organisation and any third party controllers who will be relying on the consent.",
                  key: "name3rdParty",
                  value: false
                },
                {
                  name: "We tell individuals they can withdraw their consent.",
                  key: "canWithdraw",
                  value: false
                },
                {
                  name:
                    "We ensure that individuals can refuse to consent without detriment.",
                  key: "ensureCanRefuse",
                  value: false
                },
                {
                  name: "We avoid making consent a precondition of a service.",
                  key: "askingPrecondition",
                  value: false
                },
                {
                  name:
                    "If we offer online services directly to children, we only seek consent if we have age-verification measures (and parental-consent measures for younger children) in place.",
                  key: "haveAgeVerification",
                  value: false
                }
              ]
            },
            {
              name: "Recording consent",
              key: "recording",
              children: [
                {
                  name:
                    "We keep a record of when and how we got consent from the individual.",
                  key: "keepRecordHow",
                  value: false
                },
                {
                  name:
                    "We keep a record of exactly what they were told at the time.",
                  key: "keepRecordWhat",
                  value: false
                }
              ]
            },
            {
              name: "Managing consent",
              key: "managing",
              children: [
                {
                  name:
                    "We regularly review consents to check that the relationship, the processing and the purposes have not changed.",
                  key: "reviewIfNotChanged",
                  value: false
                },
                {
                  name:
                    "We have processes in place to refresh consent at appropriate intervals, including any parental consents.",
                  key: "processesToRefresh",
                  value: false
                },
                {
                  name:
                    "We consider using privacy dashboards or other preference-management tools as a matter of good practice.",
                  key: "privacyDashboard",
                  value: false
                },
                {
                  name:
                    "We make it easy for individuals to withdraw their consent at any time, and publicise how to do so.",
                  key: "makeItEasyToWithdraw",
                  value: false
                },
                {
                  name: "We act on withdrawals of consent as soon as we can.",
                  key: "actOnWithdrawals",
                  value: false
                },
                {
                  name:
                    "We don’t penalise individuals who wish to withdraw consent.",
                  key: "noPenalise",
                  value: false
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  collectValues(array, group) {
    if (_.has(group, "value")) {
      array.push(group.value);
    }

    if (!group.children) {
      return;
    }

    group.children.forEach(child => this.collectValues(array, child));
  }

  getValueStats(groups) {
    let valuesArray = [];
    _.forEach(groups, g => this.collectValues(valuesArray, g));

    return (valuesArray.filter(x => x).length / valuesArray.length) * 100;
  }

  storeQuestionaire() {
    console.log(
      "this.",
      toJS(this.questions),
      this.getValueStats(this.questions)
    );
    localStorage.setItem("gdpr-questionaire", JSON.stringify(this.questions));
  }
}

const GDPRQuestionaireStore = decorate(GDPRQuestionaireStoreWrapper, {
  questions: observable
});

export default new GDPRQuestionaireStore();
