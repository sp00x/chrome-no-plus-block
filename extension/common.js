console.log("######## common.js ########");

var palette = 
[
  "#646D7E", "#2554C7", "#8D38C9", "#E4317F", "#800517", "#461B7E", "#307D7E", "#254117", "#4CC417", "#FDD017", "#F87431", "#7E2217", "#FF0000", "#827B60"
];

var replacementMethods =
[
  { id: 'empty', title: 'Empty overlay' },
  { id: 'delete', title: 'Remove entirely'},
  { id: 'placekitten', title: 'Kittens', imageTemplate: 'http://placekitten.com/{width}/{height}' },
  { id: 'placecreature', title: 'Creatures', imageTemplate: 'http://placecreature.com/{width}/{height}' },
  { id: 'placebee', title: 'Bees', imageTemplate: 'http://placebee.co.uk/{width}x{height}' },
  { id: 'placeskull', title: 'Skulls', imageTemplate: 'http://placeskull.com/{width}/{height}/{color}' },
  { id: 'placeboobs', title: 'Boobs', imageTemplate: 'http://worksafe.placeboobs.com/{width}/{height}' },
//  { id: 'placelorempixel', title: 'Lorem pixel', imageTemplate: 'http://lorempixel.com/{width}/{height}' },
  { id: 'placebeer', title: 'Beer', imageTemplate: 'http://beerhold.it/{width}/{height}' },
  { id: 'placeholder', title: 'Generic', imageTemplate: 'http://placehold.it/{width}x{height}' },
];

var categories =
[
  {    
    id: '*',
    title: 'Any',
    color: palette[0]
  },
  {
    id: 'video',
    title: 'Videos',
    color: palette[1]
  },
  {
    id: 'sports',
    title: 'Sports',
    color: palette[2]
  },
  {
    id: 'food',
    title: 'Food',
    color: palette[3]
  },
  {
    id: 'premium',
    title: 'Premium',
    color: palette[4]
  },
  {
    id: 'fashion',
    title: 'Fashion',
    color: palette[5]
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    color: palette[6]
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    color: palette[7]
  }
]


var defaultCategoryColors =
{
  '*': palette[0],
  'video': palette[1], //'#ffa',
  'sports': palette[2], //'#9cf',
  'food': palette[3], //null,
  'premium': palette[4], //'#fcc',
  'fashion': palette[5], //'#fcf',
  'entertainment': palette[6], //'#ccf',
  'lifestyle': palette[7] //'#cff'
};

var cssImageFilters =
[
  { _title: 'Metning', title: "Saturation", filter: "saturate", min: 0, max: 400, unit: '%', default: 100 },
  { _title: 'Kontrast', title: "Contrast", filter: "contrast", min: 0, max: 400, unit: '%', default: 100 },
  { _title: 'Lysstyrke', title: "Brightness", filter: "brightness", min: 0, max: 200, unit: '%', default: 100 },
  { _title: 'Ugjennomsiktighet', title: "Opacity", filter: "opacity", min: 0, max: 100, unit: '%', default: 100 },
  { _title: 'Invertering', title: "Invert", filter: "invert", min: 0, max: 100, unit: '%', default: 0 },
  { _title: 'Gråskala', title: "Grayscale", filter: "grayscale", min: 0, max: 100, default: 0, unit: '%' },
  { _title: 'Sepia', title: "Sepia", filter: "sepia", min: 0, max: 100, default: 0, unit: '%' },
  { _title: 'Kulør', title: "Hue", filter: "hue-rotate", min: 0, max: 360, unit: 'deg', default: 0 },
  { _title: 'Uskarphet', title: "Blur", filter: "blur", min: 0, max: 5, unit: 'px', default: 0 },
]
for (var i=0; cssImageFilters.length>i; i++) cssImageFilters[i].value = cssImageFilters[i].default;

function buildFilters()
{
  var s = [];
  for (var i=0; cssImageFilters.length>i; i++)
  {
    var f = cssImageFilters[i];
    var v = f.value; //((f.value * (f.max - f.min)) + f.min);
    if (f.round) v = Math.round(v);
    v += (f.unit || "");
    s.push(f.filter + "(" + v + ")");
  }
  return s.join(" ");
}

function applyFilterOptions(options)
{
  for (var i=0; cssImageFilters.length>i; i++)
  {
    var f = cssImageFilters[i];
    f.value = options.imageFilters[f.filter] || f.default;
  }
}

var defaultSiteRules =
[
  {
    id: 'vg',
    title: 'VG',
    host: '(^|\\.)vg\\.no$',
    parentSelector: '\\b(article-extract|article-extract-full)\\b',
    injectCSS: 'width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;',
    url: 'http://www.vg.no',
    overlaySize: '',
    contentGroups:
    [
      {
        id: 'vgtv',
        title: 'VGTV',
        category: 'video',
        rules:
        [
          {
            host: 'vgtv\\.no$',
            path: ''
          }
        ]
      },
      {
        id: 'godt',
        title: 'Godt.no',
        category: 'food',
        rules:
        [
          {
            host: 'godt\\.no$',
            path: ''
          },
        ]
      },
      {
        id: 'sport',
        title: 'Sport',
        category: 'sports',
        rules:
        [
          {
            host: 'vg\\.no$',
            path: '^/sport/'
          },
          {
            host: 'vgsporten\\.vg\\.no$',
            path: ''
          }
        ]
      },
      {
        id: 'pluss',
        title: 'VG+',
        category: 'premium',
        rules:
        [
          {
            host: 'vg\\.no$',
            path: '^/pluss'
          },
          {
            host: 'pluss\\.vg\\.no$',
            path: ''
          }
        ]
      },
      {
        id: 'minmote',
        title: 'Min mote',
        category: 'fashion',
        rules:
        [
          {
            host: 'minmote\\.no$',
            path: ''
          }
        ]
      },
      {
        id: 'rampelys',
        title: 'Rampelys',    
        category: 'entertainment',
        rules:
        [
          {
            host: 'vg\\.no$',
            path: '^/rampelys/',
          }
        ]
      },
      {
        id: 'vektklubb',
        title: 'Vektklubb',
        category: 'lifestyle',
        rules:
        [
          {
            host: 'vektklubb\\.no$',
            path: '',
          }
        ]
      }
    ]
  },
  {
    id: 'db',
    title: 'Dagbladet',
    url: 'http://www.dagbladet.no',
    host: '(^|\\.)(db|dagbladet)\\.no$',
    parentSelector: '\\bcontainer|plussbox_wrapper|plussbox_article\\b',
    injectCSS: 'width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;',
    setRelativePositionOnParent: true,
    overlaySize: 'client',
    contentGroups:
    [
      {
        id: 'dbtv',
        title: 'DBTV',
        category: 'video',
        rules:
        [
          {
            host: 'dbtv\\.no$',
            path: ''
          }
        ]
      },
      {
        id: 'pluss',
        title: 'Dagbladet+',
        category: 'premium',
        rules:
        [
          {
            host: '(db|dagbladet)\\.no$',
            path: '^/pluss/'
          },
          {
            host: '(db|dagbladet)\\.no$',
            path: '^/\\d+/\\d+/\\d+/[^/]+/pluss/'
          }
        ]
      },
      {
        id: 'reise',
        title: 'Reise',
        category: 'premium',
        rules:
        [
          {
            host: '(db|dagbladet)\\.no$',
            path: '^/\\d+/\\d+/\\d+/tema/reise/'
          }
        ]
      },
      {
        id: 'kultur',
        title: 'Kultur',
        category: 'entertainment',
        rules:
        [
          {
            host: '(db|dagbladet)\\.no$',
            path: '^/\\d+/\\d+/\\d+/kultur/'
          }
        ]
      },
      {
        id: 'sport',
        title: 'Sport',
        category: 'sports',
        rules:
        [
          {
            host: '(db|dagbladet)\\.no$',
            path: '^/\\d+/\\d+/\\d+/sport/'
          }
        ]
      },
      {
        id: 'kjendis',
        title: 'Kjendis',
        category: 'entertainment',
        rules:
        [
          {
            host: 'kjendis\\.no$',
            path: ''
          }
        ]
      },
      {
        id: 'quiz',
        title: 'Quiz',
        category: 'entertainment',
        rules:
        [
          {
            host: 'quiz\\.start\\.no$',
            path: ''
          }
        ]
      },
      {
        id: 'pressfire',
        title: 'Press Fire',
        category: 'entertainment',
        rules:
        [
          {
            host: 'pressfire\\.no$',
            path: ''
          }
        ]
      },
    ]
  },
  {
    id: 'nrk',
    title: 'NRK',
    url: 'http://www.nrk.no',
    host: '(^|\\.)(nrk)\\.no$',
    parentSelector: '\\b(article-extract|article-extract-full)\\b',
    injectCSS: 'width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;',
    overlaySize: '',
    contentGroups:
    [
      {
        id: 'kultur',
        title: 'Kultur',
        category: 'entertainment',
        default: false,
        rules:
        [
          {
            host: 'nrk\\.no$',
            path: '^/kultur/'
          }
        ]
      },
      {
        id: 'livsstil',
        title: 'Livsstil',
        category: 'lifestyle',
        default: false,
        rules:
        [
          {
            host: 'nrk\\.no$',
            path: '^/kultur/'
          }
        ]
      },
      {
        id: 'sport',
        title: 'Sport',
        category: 'sports',
        rules:
        [
          {
            host: 'nrk\\.no$',
            path: '^/sport/'
          }
        ]
      },
      {
        id: 'sport-fotball',
        title: 'Sport (fotball)',
        category: 'sports',
        rules:
        [
          {
            host: 'nrk\\.no$',
            path: '^/sport/fotball/'
          }
        ]
      }
    ]
  },
  {
    id: 'tv2',
    title: 'TV2',
    url: 'http://www.tv2.no',
    host: '(^|\\.)(tv2)\\.no$',
    idAttribute: 'data-lab-articleid',
    parentSelector: '\\b(articlebox|story)\\b',
    injectCSS: 'width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;',
    overlaySize: '',
    contentGroups:
    [
      {
        id: 'underholdning',
        title: 'Underholdning',
        category: 'entertainment',
        rules:
        [
          {
            host: 'tv2\\.no$',
            path: '^/\\d+/\\d+/\\d+/underholdning/'
          }
        ]
      },
      {
        id: 'sport',
        title: 'Sport',
        category: 'sports',
        rules:
        [
          {
            host: 'tv2\\.no$',
            path: '^/\\d+/\\d+/\\d+/sport/'
          }
        ]
      },
      {
        id: 'skjonnhet',
        title: 'Skjønnhet',
        category: 'fashion',
        rules:
        [
          {
            host: 'tv2\\.no$',
            path: '^/\\d+/\\d+/\\d+/nyheter/skjonnhet/'
          }
        ]
      },
      {
        id: 'broom',
        title: 'Broom',
        category: 'cars',
        rules:
        [
          {
            host: 'tv2\\.no$',
            path: '^/\\d+/\\d+/\\d+/broom/'
          }
        ]
      },
      {
        id: 'tv2play',
        title: 'TV2 Play',
        category: 'video',
        rules:
        [
          {
            host: 'tv2\\.no$',
            path: '^/play//'
          }
        ]
      }
    ]
  }
];
