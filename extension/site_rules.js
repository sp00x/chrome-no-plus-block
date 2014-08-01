console.log("######## site_rules.js ########")

var siteRules =
[
  {
    id: 'vg',
    title: 'VG',
    host: '(^|\\.)vg\\.no$',
    contentGroups:
    [
      {
        id: 'vgtv',
        title: 'VGTV',
        color: '#ccc',
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
        id: 'sport',
        title: 'Sport',
        color: '#cfc',
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
        color: '#fcc',
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
        color: '#fcf',
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
        color: '#ccf',
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
        color: '#cff',
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
    contentGroups:
    [
      {
        id: 'dbtv',
        title: 'DBTV',
        category: 'videos',
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
            path: '^/\d+/\d+/\d+/tema/pluss/'
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
            path: '^/\d+/\d+/\d+/sport/'
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
    contentGroups:
    [
      {
        id: 'kultur',
        title: 'Kultur',
        category: 'entertainment',
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