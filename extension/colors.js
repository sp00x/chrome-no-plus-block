// simple functions for color parsing and formatting
// rune bjerke - 20140802 - @sp00x

function formatColor(r, g, b, a, format)
{
    if (typeof r == 'object' && r.length == 4)
    {
        format = g;
        var x = r;
        r = x[0]; g = x[1]; b = x[2]; a = x[3];
    }
    
    function hex(value, digits)
    {
        return (digits) ? ("00" + value.toString(16)).substr(-digits) : value.toString(16);
    }
    
    if (typeof r != 'number') r = parseInt(r);
    if (typeof g != 'number') g = parseInt(g);
    if (typeof b != 'number') b = parseInt(b);
    if (typeof a != 'number') a = parseFloat(a);

    if (isNaN(r)) r = 0;
    if (isNaN(g)) g = 0;
    if (isNaN(b)) b = 0;
    if (isNaN(a)) a = 0;

    r = Math.floor(Math.max(0, Math.min(255, r)));
    g = Math.floor(Math.max(0, Math.min(255, g)));
    b = Math.floor(Math.max(0, Math.min(255, b)));
    a = Math.max(0, Math.min(1.0, a));
    
    switch (format)
    {
        case 'rgba':
            return "rgba(" + [r,g,b,a].join(",") + ")";
            
        case 'rgb':
            return "rgb(" + [r,g,b].join(",") + ")";
            
        case '#rgb':
            r = Math.round(r / 16);
            g = Math.round(g / 16);
            b = Math.round(b / 16);
            return "#" + hex(r) + hex(g) + hex(b);
     
        case '#rrggbb':
            return "#" + hex(r, 2) + hex(g, 2) + hex(b, 2);
            
        case '#rrggbbaa':
            return "#" + hex(r, 2) + hex(g, 2) + hex(b, 2) + hex(Math.floor(255 * a), 2);
            
        default:
            return [r,g,b,a];
    }
}

function parseColor(str, format)
{
    function dup(a)
    {
        return a + a;
    }
    
    // rgb(r,g,b)
    var m = str.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
    if (m) return formatColor(m[1], m[2], m[3], 255);
    
    // rgba(r,g,b,a)
    m = str.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,(\d+(\.\d+)?)\s*\)/i)
    if (m) return formatColor(m[1], m[2], m[3], m[4]);
    
    // #rrggbb
    m = str.match(/#([0-9a-f]{6})/i);
    if (m) return formatColor(
        parseInt(m[1].substring(0, 2), 16),
        parseInt(m[1].substring(2, 4), 16),
        parseInt(m[1].substring(4, 6), 16),
        255,
        format);

    m = str.match(/#([0-9a-f]{3})/i);
    if (m) return formatColor(
        parseInt(dup(m[1].substring(0, 1)), 16),
        parseInt(dup(m[1].substring(1, 2)), 16),
        parseInt(dup(m[1].substring(2, 3)), 16),
        255,
        format);
    
    return null;
}

/*

var test = [
    "#fed",
    "#f2e2a2",
    "rgb(1,2,3)",
    "rgba(1,2,3,0.4)"
    ]

var formats = [ "rgb", "rgba", "#rgb", "#rrggbb", "#rrggbbaa" ];

console.group();

for (var i=0; test.length>i; i++)
{
    var s = test[i];
    var c = [ s, parseColor(s) ];
    
    for (var j=0; formats.length>j; j++)
        c.push(formatColor(c[1], formats[j]))
        
    console.log(c.join(" - "))
}

console.groupEnd();
*/
