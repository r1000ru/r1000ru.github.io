(function(){
    var trip = {
        title: 'Германия',
        points: [
            {
                timestart: '2017-08-19T06:00:00Z',
                coords: [38.5, 58.9],
                icon: 'home',
                title: 'Выезд из дома',
            },
            {
                timestart: '2017-08-19T06:00:00Z',
                icon: 'directions_car',
                title: 'Москва - Болимов',
                distance: 1300,
                timelong: 900
            },
            {
                timestart: '2017-08-19T22:00:00Z',
                coords: [38.5, 58.9],
                icon: 'hotel',
                title: 'Заселение в Bolimowianka',
                price: 162,
                currency: 'PLN'
            },
            {
                timestart: '2017-08-20T08:00:00Z',
                coords: [38.5, 58.9],
                icon: 'directions_car',
                title: 'Болимов - Берлин',
                distance: 512,
                timelong: 300
            },
            {
                timestart: '2017-08-20T17:00:00Z',
                coords: [38.5, 58.9],
                icon: 'hotel',
                title: 'Заселение в Holiday Inn Express',
                price: 168,
                currency: 'EUR'
            },
            {
                timestart: '2017-08-22T10:00:00Z',
                coords: [38.5, 58.9],
                icon: 'directions_car',
                title: 'Берлин - Весел',
                distance: 512,
                timelong: 5
            },
            {
                timestart: '2017-08-22T15:00:00Z',
                coords: [38.5, 58.9],
                icon: 'hotel',
                title: 'Заселение в Pension Hillmers Hoff',
                price: 168,
                currency: 'EUR'
            },
            {
                timestart: '2017-08-24T10:00:00Z',
                coords: [38.5, 58.9],
                icon: 'directions_car',
                title: 'Весел - Ганновер',
                distance: 512,
                timelong: 5
            },
            {
                timestart: '2017-08-24T15:00:00Z',
                coords: [38.5, 58.9],
                icon: 'hotel',
                title: 'Заселение в Hotel Erbenholz',
                price: 168,
                currency: 'EUR'
            }


        ]
    }

    window.currenttrip = trip;
})();