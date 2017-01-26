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
var newsSource = 'google-news';
var apiToken = 'a90fc3fbb2a5465bbe9bff3296a548aa';
//console.log('Saved newsapi: ' + Settings.data('newsapi'));
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
  downHead.text('News v1.1');
  downText.text('by Edward Dam');
  downWind.add(downHead);
  downWind.add(downText);
  downWind.show();
});

// select button
mainWind.on('click', 'select', function(e) {

  // load collected api data
  var newsdata = Settings.data('newsapi');
  //console.log('Loaded newsdata: ' + newsdata);

  // load options
  var options = JSON.parse(localStorage.getItem('clay-settings'));
  //console.log('Loaded sportsnews option: ' + options.sports_news);

  // collect sports api data
  if ( options.sports_news === "enable" ) {
    collectsports('talksport');
    collectsports('espn');
  }
  
  // determine api data
  for (var i = 0; i < 10; i++) {
    window["newsTitle" + i] = newsdata.articles[i].title;
    window["newsDescription" + i] = newsdata.articles[i].description;
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
  if ( options.sports_news === "enable" ) {
    newsMenu.section(1, {title: 'Sports News'});
    newsMenu.item(1, 0, { icon: icon, title: "British", subtitle: "talkSPORT" } );
    newsMenu.item(1, 1, { icon: icon, title: "American", subtitle: "ESPN" } );
  }
  newsMenu.show();
  mainWind.hide();

  // on select
  newsMenu.on('select', function(e) {
    
    // display news story
    if (e.sectionIndex === 0) {
      var storyCard = new UI.Card({scrollable: true, style: style,
        subtitleColor: textColor, bodyColor: textColor, backgroundColor: backgroundColor,
        status: { separator: 'none', color: textColor, backgroundColor: backgroundColor }
      });
      storyCard.subtitle(window["newsTitle" + e.itemIndex]);
      storyCard.body(window["newsDescription" + e.itemIndex]);
      storyCard.show();
  
    // display sports
    } else {
      
       // load collected sports api data
      var sportsdata;
      if ( e.itemIndex === 0 ) {
        sportsdata = Settings.data('talksportapi');
      } else {
        sportsdata = Settings.data('espnapi');
      }

      // determine sports api data
      for (var j = 0; j < 5; j++) {
        window["sportsTitle" + j] = sportsdata.articles[j].title;
        window["sportsDescription" + j] = sportsdata.articles[j].description;
        //console.log('sportsTitle' + j + ': ' + window["sportsTitle" + j]);
        //console.log('sportsDescription' + j + ': ' + window["sportsDescription" + j]);
      }
      
      // display sports menu
      var sportsMenu = new UI.Menu({ //fullscreen: true,
        textColor: textColor, highlightBackgroundColor: highlightBackgroundColor,
        backgroundColor: backgroundColor, highlightTextColor: highlightTextColor,
        status: { separator: 'none', color: textColor, backgroundColor: backgroundColor }
      });
      sportsMenu.section(0, {title: 'Sports News'});
      for (j = 0; j < 5; j++) {
        sportsMenu.item(1, j, { icon: icon,
          title: window["sportsTitle" + j], subtitle: window["sportsDescription" + j]
        });
      }
      sportsMenu.show();

      // display sports story
      sportsMenu.on('select', function(e) {
        var storyCard = new UI.Card({scrollable: true, style: style,
          subtitleColor: textColor, bodyColor: textColor, backgroundColor: backgroundColor,
          status: { separator: 'none', color: textColor, backgroundColor: backgroundColor }
        });
        storyCard.subtitle(window["sportsTitle" + e.itemIndex]);
        storyCard.body(window["sportsDescription" + e.itemIndex]);
        storyCard.show();
      });
    }
  });
});

// functions

function collectnews() {
  var url = 'https://newsapi.org/v1/articles?source=' + newsSource + '&sortBy=top&apiKey=' + apiToken;
  ajax({ url: url, method: 'get', type: 'json' },
    function(api){
      //console.log('Collected apidata: ' + api);
      Settings.data('newsapi', api);
    }
  );
}

function collectsports(sportsSource) {
  var url = 'https://newsapi.org/v1/articles?source=' + sportsSource + '&sortBy=top&apiKey=' + apiToken;
  ajax({ url: url, method: 'get', type: 'json' },
    function(api){
      //console.log('Collected apidata: ' + api);
      if ( sportsSource === 'talksport') {
        Settings.data('talksportapi', api);
      } else if( sportsSource === 'espn') {
        Settings.data('espnapi', api);
      }
    }
  );
}
