// Author: Ed Dam

// pebblejs
require('pebblejs');

// clayjs
var Clay       = require('pebble-clay');
var clayConfig = require('./config');
var clay = new Clay(clayConfig);

// libraries
var UI       = require('pebblejs/ui');
var Vector2  = require('pebblejs/lib/vector2');
var ajax     = require('pebblejs/lib/ajax');
var Settings = require('pebblejs/settings');

// collect api data
var token = 'a90fc3fbb2a5465bbe9bff3296a548aa';
//console.log('Saved apidata: ' + Settings.data('newsapi'));
collectnews();

// definitions
var window = new UI.Window();
var windowSize = window.size();
var size = new Vector2(windowSize.x, windowSize.y);
var icon = 'images/menu_icon.png';
var backgroundColor = 'black';
var highlightBackgroundColor = 'white';
var textColor = 'white';
var highlightTextColor = 'black';
var textAlign = 'center';
var fontLarge = 'gothic-28-bold';
var fontMedium = 'gothic-24-bold';
var fontSmall = 'gothic-18-bold';
//var fontXSmall = 'gothic-14-bold';
var style = 'small';
function position(height){
  return new Vector2(0, windowSize.y / 2 + height);
}

// main screen
var mainWind = new UI.Window();
var mainText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
var mainImage = new UI.Image({size: size});
mainText.position(position(-65));
mainImage.position(position(-70));
mainText.font(fontLarge);
mainText.text('NEWS');
mainImage.image('images/splash.png');
mainWind.add(mainText);
mainWind.add(mainImage);
mainWind.show();

// up screen
mainWind.on('click', 'up', function(e) {
  var upWind = new UI.Window();
  var upHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  var upText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  upHead.position(position(-35));
  upText.position(position(-5));
  upHead.font(fontLarge);
  upText.font(fontMedium);
  upHead.text('NewsAPI');
  upText.text('www.newsapi.org');
  upWind.add(upHead);
  upWind.add(upText);
  upWind.show();
});

// down screen
mainWind.on('click', 'down', function(e) {
  var downWind = new UI.Window();
  var downHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  var downText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  downHead.position(position(-30));
  downText.position(position(-5));
  downHead.font(fontMedium);
  downText.font(fontSmall);
  downHead.text('News v1.0');
  downText.text('by Edward Dam');
  downWind.add(downHead);
  downWind.add(downText);
  downWind.show();
});

// select button
mainWind.on('click', 'select', function(e) {

  // load collected api data
  var apidata = Settings.data('newsapi');
  //console.log('Loaded apidata: ' + apidata);

  // determine api data
  for (var i = 0; i < 10; i++) {
    window["newsTitle" + i] = apidata.articles[i].title;
    window["newsDescription" + i] = apidata.articles[i].description;
    //console.log('newsTitle' + i + ': ' + window["newsTitle" + i]);
    //console.log('newsDescription' + i + ': ' + window["newsDescription" + i]);
  }

  // display screen
  var newsMenu = new UI.Menu({ //fullscreen: true,
    textColor: textColor, highlightBackgroundColor: highlightBackgroundColor,
    backgroundColor: backgroundColor, highlightTextColor: highlightTextColor,
    status: { separator: 'none', color: textColor, backgroundColor: backgroundColor }
  });
  newsMenu.section(0, {title: 'Headlines'});
  for (i = 0; i < 10; i++) {
    newsMenu.item(0, i, { icon: icon,
      title: window["newsTitle" + i], subtitle: window["newsDescription" + i]
    });
  }
  newsMenu.show();
  mainWind.hide();
  
  // display story
  newsMenu.on('select', function(e) {
    var storyCard = new UI.Card({scrollable: true, style: style,
      subtitleColor: textColor, bodyColor: textColor, backgroundColor: backgroundColor,
      status: { separator: 'none', color: textColor, backgroundColor: backgroundColor }
    });
    storyCard.subtitle(window["newsTitle" + e.itemIndex]);
    storyCard.body(window["newsDescription" + e.itemIndex]);
    storyCard.show();
  });

});

// functions

function collectnews() {
  var url = 'https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=' + token;
  ajax({ url: url, method: 'get', type: 'json' },
    function(api){
      //console.log('Collected apidata: ' + api);
      Settings.data('newsapi', api);
    }
  );
}
