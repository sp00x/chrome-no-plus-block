function init()
{
  var arg = JSON.parse(unescape(document.location.search.substring(1)));
  var list = document.getElementById("list");
  for (var i in arg.rules)
  {
    if (arg.rules[i].count > 0)
    {
      var li = document.createElement("li");
      li.innerHTML = '<span class="colorBox" style="background-color: ' + arg.rules[i].color + '"></span>' + arg.rules[i].title + ": " + arg.rules[i].count;
      list.appendChild(li);
    }
  }
}

document.addEventListener("DOMContentLoaded", init, false );
