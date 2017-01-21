// Author: Ed Dam

module.exports = [
  {
    "type": "heading",
    "defaultValue": "News v1.1"
  },
  {
    "type": "text",
    "defaultValue": "by Edward Dam"
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Powered by NewsAPI"
      },
      {
        "type": "text",
        "defaultValue": "https://newsapi.org/"
      },
    ]
  },
  { "type": "section", "items": [
    { "type": "heading", "defaultValue": "Sports News" },
    { "type": "text", "defaultValue": "Please Enable or Disable" },
    { "type": "radiogroup", "messageKey": "sports_news", "options": [
      { "label": "Enable", "value": "enable" },
      { "label": "Disable", "value": "disable" } ],
    "defaultValue": "disable" } ]
  },
  {
    "type": "text",
    "defaultValue": "Thank you for using my watch app."
  },
  {
    "type": "submit",
    "defaultValue": "Exit"
  }
];
