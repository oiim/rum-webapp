$.fn.model = function () {
  return this.data("model");
};
$.fn.forModel = function (item) {
  return this.filter(function () {
    return item === $(this).model();
  });
};

var Girl = Backbone.Model.extend({
  score: function () {
    //
    // https://docs.google.com/spreadsheet/ccc?key=0AgQNm5fx5y30dHJoVWlwQmllSWRLWUFZZ3VLemlRWlE
    // http://fr.wikipedia.org/wiki/Quantile
    //
    var percentiles = {
      mails: [0, 4, 6, 9, 11, 14, 16, 18, 20, 22, 24, 26, 28, 29, 31, 33, 35, 37, 39, 40, 42, 45, 47, 49, 51, 53, 55, 57, 58, 61, 63, 65, 67, 69, 71, 74, 76, 79, 81, 83, 86, 88, 91, 94, 96, 99, 102, 105, 107, 110, 113, 115, 119, 123, 127, 131, 134, 138, 142, 146, 150, 155, 160, 164, 169, 174, 180, 184, 189, 197, 203, 210, 216, 223, 231, 240, 251, 260, 270, 280, 293, 307, 322, 332, 344, 361, 381, 398, 423, 450, 481, 510, 541, 590, 637, 692, 781, 927, 1120, 1566, 6181],
      baskets: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 14, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 28, 30, 33, 36, 39, 44, 49, 55, 63, 73, 90, 121, 184, 711],
      points: [260, 2294, 3669, 4794, 5979, 7179, 8080, 8997, 9839, 10889, 11654, 12512, 13430, 14193, 14988, 15680, 16624, 17278, 18225, 19081, 19944, 20825, 21852, 22822, 23815, 24717, 25647, 26528, 27600, 28804, 30012, 31043, 32223, 33153, 34126, 35266, 36291, 37569, 38716, 39741, 41109, 42159, 43218, 44767, 46098, 47217, 48457, 50118, 51660, 53265, 54395, 55977, 57369, 58994, 60479, 61994, 63613, 65276, 66970, 68626, 70615, 72442, 74685, 76827, 78860, 80763, 83342, 85679, 88218, 90921, 93785, 96810, 100026, 103244, 106601, 110353, 113958, 117006, 120768, 124694, 130262, 134691, 139743, 144142, 149370, 155447, 162989, 169621, 180163, 189925, 200451, 209040, 224015, 236412, 254945, 277271, 304995, 345149, 396028, 502214, 1480210],
      visits: [3, 151, 265, 345, 434, 536, 638, 708, 770, 854, 930, 996, 1059, 1134, 1205, 1285, 1372, 1453, 1543, 1620, 1688, 1774, 1857, 1927, 2018, 2110, 2191, 2273, 2356, 2438, 2522, 2608, 2711, 2829, 2925, 3031, 3126, 3228, 3347, 3477, 3598, 3705, 3819, 3921, 4022, 4139, 4250, 4401, 4562, 4697, 4798, 4949, 5078, 5228, 5376, 5501, 5664, 5823, 5978, 6144, 6330, 6496, 6651, 6827, 7036, 7275, 7467, 7667, 7885, 8118, 8437, 8675, 8993, 9271, 9554, 9856, 10243, 10601, 10952, 11324, 11737, 12171, 12652, 13139, 13575, 14118, 14741, 15333, 16052, 16940, 17766, 18589, 19717, 21238, 22722, 25055, 27488, 30973, 35257, 45939, 116395],
      charms: [0, 3, 16, 35, 54, 71, 87, 107, 124, 141, 160, 175, 191, 207, 225, 240, 254, 269, 286, 302, 318, 333, 353, 372, 390, 407, 424, 443, 464, 482, 503, 524, 543, 565, 585, 603, 626, 653, 674, 697, 725, 752, 779, 805, 833, 850, 880, 907, 935, 960, 997, 1033, 1068, 1099, 1135, 1168, 1200, 1234, 1270, 1313, 1354, 1393, 1438, 1484, 1547, 1597, 1642, 1688, 1747, 1803, 1870, 1934, 1996, 2062, 2129, 2202, 2281, 2377, 2458, 2557, 2664, 2782, 2895, 3009, 3161, 3353, 3481, 3648, 3837, 4037, 4318, 4603, 4884, 5201, 5561, 6163, 6827, 7698, 8871, 11741, 40201],
      fresh: [0, 5, 9, 12, 16, 18, 21, 23, 25, 27, 29, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 55, 57, 59, 61, 63, 66, 68, 71, 73, 75, 77, 80, 82, 84, 87, 90, 92, 94, 97, 99, 102, 105, 108, 111, 114, 116, 119, 122, 126, 129, 133, 137, 140, 144, 148, 151, 155, 159, 164, 169, 174, 178, 183, 188, 193, 199, 206, 214, 219, 226, 234, 241, 253, 260, 270, 279, 291, 302, 314, 328, 341, 358, 374, 388, 404, 423, 450, 479, 509, 535, 577, 627, 665, 730, 823, 955, 1171, 1650, 6199],
      bombshell: [0.0000, 0.0044, 0.0269, 0.0706, 0.0877, 0.0985, 0.1064, 0.1124, 0.1173, 0.1208, 0.1253, 0.1290, 0.1323, 0.1360, 0.1386, 0.1412, 0.1438, 0.1463, 0.1490, 0.1516, 0.1537, 0.1557, 0.1584, 0.1606, 0.1625, 0.1644, 0.1664, 0.1682, 0.1701, 0.1721, 0.1744, 0.1766, 0.1785, 0.1802, 0.1819, 0.1849, 0.1870, 0.1890, 0.1910, 0.1927, 0.1943, 0.1960, 0.1982, 0.2000, 0.2020, 0.2038, 0.2059, 0.2081, 0.2104, 0.2121, 0.2139, 0.2156, 0.2177, 0.2197, 0.2220, 0.2241, 0.2262, 0.2280, 0.2297, 0.2317, 0.2340, 0.2361, 0.2382, 0.2402, 0.2429, 0.2451, 0.2471, 0.2497, 0.2519, 0.2540, 0.2558, 0.2582, 0.2607, 0.2632, 0.2665, 0.2692, 0.2728, 0.2760, 0.2786, 0.2819, 0.2849, 0.2879, 0.2916, 0.2955, 0.2998, 0.3040, 0.3085, 0.3131, 0.3189, 0.3258, 0.3317, 0.3389, 0.3475, 0.3557, 0.3646, 0.3787, 0.3912, 0.4139, 0.4454, 0.5200, 28.0000]
    };

    //
    // http://stackoverflow.com/questions/12829765/indexes-around-a-range-of-values/12830022
    //
    function indexesAround(target, arr) {
      var start = -1;

      var el;
      for (var i = 0, len = arr.length; i < len; i++) {
        el = arr[i];
        if (el === target && start === -1) {
          start = i;
        } else if (el > target) {
            if (i === 0) {
              return [0, 0]; // Target lower than array range
            }
            if (start === -1) {
              return [i-1, i]; // Target inside array range but not found
            } else {
              return [start, i-1]; // Target found
            }
        }
      }

      if (start === -1) {
        return [len-1, len-1]; // Target higher than array range
      } else {
        return [start, len-1]; // Target found and extends until end of array
      }  
    }

    function percentile(type, val) {
      var indexes = indexesAround(val, percentiles[type]);
      return ((indexes[0] + indexes[1])/2)/100;
    }

    //
    // Convert miliseconds to day
    //
    function ms2day(ms) {
      return ms / (1000*3600*24);
    }

    //
    // Convert a string (with space separators) to an integer
    //
    // Ex: "2 765" -> 2765
    //
    function str2int(str) {
      str = ''+str;
      return parseInt(str.replace(/\s/g, ''), 10);
    }

    //var fresh = percentile('fresh', str2int(this.get('mail')) + str2int(this.get('basket')));
    //var active = 1 - (this.get('lastSeenAt') - 1349100752536) / (new Date().getTime() - 1349100752536)
    //var visit = percentile('visits', str2int(this.get('visit')));

    //return (fresh + active + visit)/3;
    return str2int(this.get('visit'));
  }
});
var GirlList = Backbone.Collection.extend({
  url : 'http://localhost:5984/rum/_design/app/_view/freshActiveAndSexy',
  parse: function (response) {
    return _(response.rows).map(function (row) {
      return row.value;
    });
  },
  model: Girl,
  comparator: function (a, b) {
    var scoreA = a.score();
    var scoreB = b.score();

    var ret;
    if (scoreA < scoreB) {
      ret = -1;
    } else if (scoreA > scoreB) {
      ret =  1;
    } else {
      ret =  0;
    }

    return ret;
  },
  more: function (howmany) {
    howmany || (howmany = 3);
    this.fetch({
      data: {
        skip: this.length,
        limit: howmany
      },
      add: true, merge: true
    });
  }
});

GirlView = Backbone.View.extend({
  className: 'girl',
  initialize: function () {
    this.template = Handlebars.compile($('#girl').html());

    // Re-render on 'change'
    this.model.on('change', function () {
      console.log('change', this, arguments);
      
      this.render();
    }, this);

    this.$el.click(function (e) {
      $(this).toggleClass('active');
      $(this).trigger('toggleActive');
    });
  },
  render: function () {
    var model = this.model;

    //
    // Convert a string (with space separators) to an integer
    //
    // Ex: "2 765" -> 2765
    //
    function str2int(str) {
      str = ''+str;
      return parseInt(str.replace(/\s/g, ''), 10);
    }

    function approx(x, n) {
      n || (n = 1);
            
      return ~~(x/n);
    }

    this.$el.html(this.template({
      id: model.get('id'),
      pseudo: model.get('pseudo'),
      pic: model.get('pics')[0],
      pics: model.get('pics').slice(1),
      messages: (str2int(model.get('mail')) + str2int(model.get('basket'))),
      //lastSeen: Math.floor((new Date().getTime() - (model.get('lastSeenAt') || 0)) / (1000*3600*24)),
      lastSeen: moment(model.get('lastSeenAt')).fromNow(),
      visits: str2int(model.get('visit')),
      //kpoints: approx(str2int(model.get('points')), 1000),
      description: model.get('description')
    }));

    // Store model as an expando (useful for isotope to retrieve sorting datas)
    this.$el.data('model', model);

    return this;
  }
});
var GirlListView = Backbone.View.extend({
  initialize: function () {
    var collection = this.collection;

    //
    // Isotope (http://isotope.metafizzy.co/index.html)
    //

    this.$el.isotope({
      getSortData: {
        age: function ($el) {
          return $el.data('model').score();
        }
      },
      sortBy: 'age'
    });

    //
    // Events
    //

    collection.on('add', function (model, options) {
      console.log('add', this, arguments);
      this.addOne(model, options);
    }, this);

    collection.on('remove', function () {
      console.log('remove', this, arguments);
      // TODO?
    }, this);

    collection.on('reset', function (/*collection, options = {}*/) {
      console.log('reset', this, arguments);
      this.addAll();
    }, this);

    collection.on('change', function (model, val, options) {
      console.log('change2', this, arguments);

      this.$el
        .isotope('updateSortData', this.$('.girl').forModel(model))
        .isotope({sortBy: 'age'})
      ;

    }, this)

    // http://isotope.metafizzy.co/index.html
    this.$el.isotope();
    this.$el.bind('toggleActive', _.bind(function (e) {
      this.$el.isotope('reLayout');
    }, this));
  },
  addOne: function (model) {
    var girlView = new GirlView({
      tagName: 'li',
      model: model
    });
    this.$el.append(girlView.render().el);

    this.$el.isotope('insert', girlView.$el);
  },
  addAll: function () {
    console.log(this, arguments);
    this.collection.forEach(this.addOne, this);
  },
  render: function () {
    this.addAll();
  }
});

girlList = new GirlList();
girlListView = new GirlListView({
  el: $('ol'),
  collection: girlList
});

/*konami = new Konami();
konami.code = konami.iphone.code = function () {
  girlList.more(20);
  $('[rel=next]').click(function () {
    girlList.more();
  });
};
konami.load();*/
girlList.more(20);
$('[rel=next]').click(function () {
  girlList.more();
});