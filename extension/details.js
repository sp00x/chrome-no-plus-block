function init()
{
  var arg = JSON.parse(unescape(document.location.search.substring(1)));
  var list = document.getElementById("list");

  //alert(JSON.stringify(arg,null,'  '));

  //arg.stats.sort(function(a,b) { return a.title.localeCompare(b.title) })
  arg.stats.sort(function(a,b) { return b.count - a.count; })

  for (var i=0; arg.stats.length>i; i++)
  {
    var li = document.createElement("li");
    var g = arg.stats[i];
    li.innerHTML = '<span class="colorBox" style="background-color: ' + g.color + '"></span>' + g.title + ": " + g.count;
    list.appendChild(li);
  }
}

document.addEventListener("DOMContentLoaded", init, false );
