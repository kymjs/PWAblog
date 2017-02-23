(function() {
  'use strict';

  var app = { 
    currentColumn: 2,
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
              app.appColumn3.classList.add('active');
            break;
          }
          app.currentColumn = index;
      }
    };

    app.updateContent = function(data){
      //set content
      var link = document.getElementById('blogLink');
      link.href = data.link;
      link.title = data.title; 
      var time = document.getElementById('blogTime');
      time.innerHTML = data.pubDate.concat(' By 张涛');
      var title = document.getElementById('title');
      title.innerHTML = ': '.concat(data.title);
      var description = document.getElementById('description');
      description.innerHTML = data.description;
      var tag = document.getElementById('tag');
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
    };

    app.addContent = function(itemList){
      for (var i = itemList.length - 1; i >=0 ; i--) {
        app.updateContent(itemList[i]);
        if (i !== 0){
          //clone and add
          var template = document.querySelector('.list-item');
          var item = template.cloneNode(true);
          item.removeAttribute('hidden');
          app.container.insertBefore(item,template);
        }
      };
    };

  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/
  
  app.requestBlogList = function(){
    var url = "/download.json";

    if ('caches' in window) {

      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            var itemList = json.item;
            app.addContent(itemList);
          });
        }
      });
    }

    var xmlhttp = createXMLHttpRequest(); 
    xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status==200){
        var response = JSON.parse(xmlhttp.response);
        var itemList = response.item;
        app.addContent(itemList);        
      }
    };
    xmlhttp.open("GET", url);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); 
    xmlhttp.send();
  };

  app.requestBlogList();
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