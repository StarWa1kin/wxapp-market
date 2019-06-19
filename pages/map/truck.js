const ipConfig = require('../../utils/ipConfig.js');

Page({
    data: {
        v: '',
        lon: 104.06,
        lat: 30.47,
        height: 800,
        polyline: [],
        markers: [],
    },
    onLoad(options){
        wx.getSystemInfo({
            success: res => {
                this.setData({
                    height: res.windowHeight
                });
            }
        })
        this.setData({
            v: options.vehicle
        })
        this.showMap(options.vehicle);
    },
    showMap(v){
        // 川A5FT91
        var v = v || this.data.v;
        wx.request({
            url: ipConfig.serverHost + '/api/view_map.php?v=' + v,
            method: 'get',
            success: res => {
                // console.log(res)
                var points = res.data;
                var pois = [];
                var maxLon = 0;
                var minLon = 0;
                var maxLat = 0;
                var minLat = 0;
                for (var i = 0; i < points.length; i++) {
                    maxLon = maxLon ? maxLon : points[i]['Lon'];
                    minLon = minLon ? minLon : points[i]['Lon'];
                    maxLat = maxLat ? maxLat : points[i]['Lat'];
                    minLat = minLat ? minLat : points[i]['Lat'];

                    maxLon = Math.max(maxLon, points[i]['Lon']);
                    minLon = Math.min(minLon, points[i]['Lon']);
                    maxLat = Math.max(maxLat, points[i]['Lat']);
                    minLat = Math.min(minLat, points[i]['Lat']);

                    pois.push({
                        longitude: points[i]['Lon'],
                        latitude: points[i]['Lat']
                    });
                }
                var lon = (maxLon + minLon) / 2;
                var lat = (maxLat + minLat) / 2;
                lon = lon ? lon : 104.06;
                lat = lat ? lat : 104.06;

                this.setData({
                    lon: lon,
                    lat: lat,
                    polyline: [{
                        points: pois,
                        arrowLine: true,
                        color: "#0000FF",
                        width: 5,
                    }],
                    markers: [{
                        id: 0,
                        iconPath:'./images/320.png',
                        latitude: pois[pois.length - 1].latitude,
                        longitude: pois[pois.length - 1].longitude,
                        width: 50,
                        height: 50
                    }]
                });
            }
        });
    }
})