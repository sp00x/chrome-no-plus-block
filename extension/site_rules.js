console.log("######## site_rules.js ########")

var defaultCategoryColors =
{
  'video': '#ffc',
  'sports': '#ccf',
  'food': null,
  'premium': '#fcc',
  'fashion': '#fcf',
  'entertainment': '#ccf',
  'lifestyle': '#cff'
}

var siteRules =
[
  {
    id: 'vg',
    title: 'VG',
    host: '(^|\\.)vg\\.no$',
    parentSelector: '\\b(article-extract|article-extract-full)\\b',
    injectCSS: 'width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;',
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
    contentGroups:
    [
    ]
  }
]