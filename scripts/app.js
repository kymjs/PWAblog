(function() {
  'use strict';

  var app = { 
    currentColumn: 0,
    isFirstRequest: true,
    appColumn1: document.querySelector('.button1'),
    appColumn2: document.querySelector('.button2'),
    appColumn3: document.querySelector('.button3'),
    container: document.querySelector('.post-list-body'),
  };

  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('column1').addEventListener('click', function() {
    app.updateColumn(1);
  });
  document.getElementById('column2').addEventListener('click', function() {
    app.updateColumn(2);
  });
  document.getElementById('column3').addEventListener('click', function() {
    app.updateColumn(3);
  });

  document.getElementById('butAbout').addEventListener('click', function() {
    
  });

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

    app.updateColumn = function(index) {
      if (app.currentColumn !== index){
        app.appColumn1.classList.remove('active');
        app.appColumn2.classList.remove('active');
        app.appColumn3.classList.remove('active');
          switch(index){
            case 1:
              app.appColumn1.classList.add('active');
            break;
            case 2:
              app.requestBlogList();
              app.appColumn2.classList.add('active');
            break;
            case 3:
            app.requestBlogList();
              app.appColumn3.classList.add('active');
            break;
          }
          app.currentColumn = index;
      }
    };

    app.createItem = function(data){
      var template = document.querySelector('#blogListTemplate').content;
      //set content
      var link = template.getElementById('blogLink');
      link.href = data.link;
      link.title = data.title; 
      var time = template.getElementById('blogTime');
      time.innerHTML = data.pubDate.concat(' By 张涛');
      var title = template.getElementById('title');
      title.innerHTML = ': '.concat(data.title);
      var description = template.getElementById('description');
      description.innerHTML = data.description;
      var tag = template.getElementById('tag');
      switch(data.category){
        case 'code':
          tag.innerHTML = "技术";
          tag.color = "#AE57A4";
        break;
        case 'stickies':
          tag.innerHTML = "随笔";
          tag.color = "#FF8000";
        break;
        case 'manager':
          tag.innerHTML = "管理";
          tag.color = "#0066CC";
        break;
        case 'english':
          tag.innerHTML = "英语";
          tag.color = "#BB3D00";
        break;
        case 'story':
          tag.innerHTML = "小说";
          tag.color = "#008080";
        break;
      }
      var item = template.cloneNode(true);
      return item;
    };

    app.addBlogListContent = function(itemList){
      while(app.container.childNodes[2]){
        app.container.removeChild(app.container.childNodes[2]);
      }

      for (var i = 0; i < itemList.length; i++) {
          var item = app.createItem(itemList[i]);
          app.container.appendChild(item);
      };
    };

  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/
  
  app.requestBlogList = function(){
    var url = "/api/download.json";

    if ('caches' in window) {

      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            var itemList = json.item;
            app.addBlogListContent(itemList);
          });
        }
      });
    }

    var xmlhttp = createXMLHttpRequest(); 
    xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status==200){
        var response = JSON.parse(xmlhttp.response);
        var itemList = response.item;
        app.addBlogListContent(itemList);        
      }
    };
    xmlhttp.open("GET", url);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); 
    xmlhttp.send();
  };

  app.updateColumn(2);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

})();

function createXMLHttpRequest() {  
    var xmlHttp;  
    if (window.XMLHttpRequest) {  
        xmlHttp = new XMLHttpRequest();  
    } else if (window.ActiveXObject) {  
        try {  
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");  
        } catch (e) {  
            try {  
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
            } catch (e) { 
            }  
        }  
    }  
    return xmlHttp;  
} 