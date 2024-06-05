const offers = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        'title': 'Upgrade to a business class',
        'price': 120
      },
      {
        'id': 'a4c3e4e6-9053-42ce-b747-e281314baa31',
        'title': 'Upgrade to a business class',
        'price': 125
      }
    ]
  },
  {
    'type': 'drive',
    'offers': [
      {
        'id': 'b4c3e4e6-9053-42ce-b747-e281314baa32',
        'title': 'Switch to comfort class',
        'price': 440
      },
      {
        'id': 'b4c3e4e6-9053-42ce-b747-e281314baa33',
        'title': 'Switch to comfort class',
        'price': 470
      }
    ]
  },
  {
    'type': 'flight',
    'offers': []
  },
  {
    'type': 'bus',
    'offers': []
  },
  {
    'type': 'train',
    'offers': []
  },
  {
    'type': 'ship',
    'offers': []
  },
  {
    'type': 'check-in',
    'offers': []
  },
  {
    'type': 'sightseeing',
    'offers': []
  },
  {
    'type': 'restaurant',
    'offers': []
  },
];

export const getOffers = ()=> offers;
