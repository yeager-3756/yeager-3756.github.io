window.$ = function (selector) {
  return document.querySelector(selector);
};
window.$$ = function (selector) {
  return document.querySelectorAll(selector);
};
window.$$$ = function (selector) {
  return document.getElementById(selector);
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', DOMReady);
} else { 
  DOMReady();
}

 
function DOMReady() {  
  
  var title = document.title.substr(0,document.title.indexOf("| Frames of") - 1) || document.title;
  
  $$$('window-hamburger-menu').addEventListener('click', (e) => { 
    $$('#window-header .window-header-menu-item').forEach( (el) => {
      el.classList.toggle('active');
      // elm = $('#window-hamburger-menu-a');
      // elm.parentNode.removeChild(elm);
      if (el.classList.contains('active')) {
        $('#window-hamburger-menu').innerHTML = '<a id="window-hamburger-menu-a" href="#">X</a>';
      }
      else {
        $('#window-hamburger-menu').innerHTML = "<a id='window-hamburger-menu-a' href='#'><span class='qz'></span><span class='qz'></span><span class='qz'></span></a>";
      }
    });
    e.preventDefault();
    e.stopPropagation();   
  });
  
  fetch('/recent-posts.html')
    .then(response => {
      if (response.ok) {
        return response.text()
      } else {
        return Promise.reject('something went wrong!')
      }
    })
    .then(data => {
      $('#recent-posts-ul').innerHTML = data;
      $('#recent-posts-footer').innerHTML = data;
    })
    .catch(error => console.log('Fetch error: ', error));


  fetch('/categories-list.html')
    .then(response => {
      if (response.ok) {
        return response.text()
      } else {
        return Promise.reject('something went wrong!')
      }
    })
    .then(data => {
      $('#categories-sidebar').innerHTML = data;
    })
    .catch(error => console.log('Fetch error: ', error));
    
    
  fetch('/series-list.html')
    .then(response => {
      if (response.ok) {
        return response.text()
      } else {
        return Promise.reject('something went wrong!')
      }
    })
    .then(data => {
      $('#series-list').innerHTML = data;
    })
    .catch(error => console.log('Fetch error: ', error));
  
} /* DomReady */
