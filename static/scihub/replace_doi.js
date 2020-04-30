(function(){
    let domain = 'tw';
    let links = document.getElementsByTagName('a');
    let scihub = 'http://sci-hub.'+domain+'/';
    for(var i = 0, l = links.length; i < l; i++) {
      let alink = links[i];
      alink.href = alink.href.replace(/^((http(s|):\/\/|www\.)|)(dx.|)doi\.org\//gim, scihub);
      alink.innerHTML = alink.innerHTML.replace(/^((http(s|):\/\/|www\.)|)(dx.|)doi\.org\//gim, scihub);
      console.log(alink.href)
   }
})();
