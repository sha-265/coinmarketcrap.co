var table = $('#coins').DataTable( {
  ajax: "https://api.coincap.io/v2/assets?limit=2000",
  pageLength: 100,
  pagingType: "simple",
  scrollX: true,
  fixedColumns: {
    leftColumns: 2
  },
  createdRow: function ( row, data, index ) {
    $('td', row).eq(7).attr('id', 'dd-menu-' + data['symbol']);
  },
  dom: "<'row'<'col nav-tabs' <'row flex-column-reverse flex-md-row align-items-end'<'col-sm-7 col-md-7 toolbar'><'col-sm-5 col-md-5'f p>>>>" +
       "<'row'<'col-sm-12'tr>>" +
       "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
  columns: [
      { data: "rank",
        className: "text-center",
        render: function (data, type, row) {
          return (row['name'] != "Beam" ? data : 9999 )
        },
        searchable: false
      },
      { data: "name",
        type: 'natural',
        render: function (data, type, row) {
          img = "<img alt='" + row['rank'] + "' src='images/" + (data != "Bitcoin" ? 'poo' : 'bitcoin') + ".png' height='32' width='32' title='"+ (data != "Bitcoin" ? 'Marketing buzzword: ' : '') + data + " (" + row['symbol'] + ")' />"
            return img + " " + (data != "Bitcoin" ? "Shitcoin #" + (row['rank'] - 1) : data)
        }
      },
      { data: "marketCapUsd",
        className: "text-right",
        render: $.fn.dataTable.render.number( ',', '.', 0, '$' ),
        defaultContent: "$0",
        searchable: false
      },
      { data: "priceUsd",
        className: "text-right",
        render: function ( data ) {
          return $.fn.dataTable.render.number( ',', '.', data < 1 ? 6 : 2, '$' ).display(data);
        },
        defaultContent: "$0",
        searchable: false
      },
      { data: "volumeUsd24Hr",
        className: "text-right",
        render: $.fn.dataTable.render.number( ',', '.', 0, '$' ),
        defaultContent: "$0",
        searchable: false
      },
      { data: "supply",
        className: "text-right",
        render: function ( data, type, row ) {
          return $.fn.dataTable.render.number( ',', '.', 0, '', row['symbol'] == "BTC" ? ' BTC' : ' SHT' ).display(data);
        },
        defaultContent: "-",
        searchable: false
      },
      { data: "changePercent24Hr",
        className: "text-right",
        render: $.fn.dataTable.render.number( ',', '.', 2, '', '%' ),
        defaultContent: "0.00%",
        searchable: false
      },
      { className: "text-center",
        render: function (data, type, row) {
                    return '<div data-id="dd-menu-' + row['symbol'] + '" class="dropdown" data-display="static"><button class="btn btn-link" id="dLabel' + row['symbol'] + '" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img width="13px" src="images/three-dots-svgrepo-com.svg" /></button >'
                          + '<div class="dropdown-menu" aria-labelledby="dLabel' + row['symbol'] + '" data-symbol="' + row['symbol'] + '">'
                           + '<a class="wl-add dropdown-item"> Add to watchlist</a>'
                           + '<a class="wl-del dropdown-item"> Delete from watchlist</a></div></div>'
        },
        searchable: false,
        sortable: false
      }

  ],
  aoColumnDefs: [ {
    aTargets: 6,
    fnCreatedCell: function (nTd, sData) {
       if ( sData < "0" ) {
        $(nTd).css('color', 'red')
      } else if (sData > "0") {
        $(nTd).css('color', 'green')
      }
    }
  },
  { type: 'natural', targets: 1 },
  { type: 'formatted-num', targets: 5 },
  { orderSequence: [ "desc", "asc" ], "targets": [ 2, 3, 4, 5, 6] } ]
});

$("div.toolbar").html('<ul class="nav nav-tabs" id="myTab" role="tablist"> ' +
            '<li class="nav-item"><a class="nav-link active" id="all" href="#" data-toggle="tab" role="tab" aria-controls="all" aria-selected="true">All</a></li>' +
            ' <li class="nav-item"><a class="nav-link" id="watchlist" href="#" data-toggle="tab" role="tab" aria-controls="watchlist" aria-selected="false">Watchlist</a></li>' +
          '</ul>');

setInterval( function () {
    table.ajax.reload(null, false);
}, 30000 );

table.on('xhr', function() {
  var ajaxJson = table.ajax.json().data;

  $('#shitcoins').text(ajaxJson.length - 1);
  $('#market-cap').text(Math.round(ajaxJson[0]['marketCapUsd'])).digits();
  $('#volume').text(Math.round(ajaxJson[0]['volumeUsd24Hr'])).digits();
});

$.fn.digits = function(){
  return this.each(function(){
    $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
  })
}

var db = new Dexie("cmc_database");
db.version(1).stores({
    watchlist: 'shitcoin'
});

db.watchlist.put({shitcoin: "BTC"});

$('#watchlist').click(function () {
  db.watchlist.toArray(function (array) {
    table.column(1).search(array.map(function(elem){
        return '\\(' + elem.shitcoin + '\\)';
    }).join("|"), true, false, false).draw();
  })
});

$('#all').click(function () {
  table.columns().search('').draw();
});

$(document).on('click', ".wl-add", function() {
  db.watchlist.put({shitcoin: $(this).parent().data('symbol')});
  toastr["info"]("Added")
});

$(document).on('click', ".wl-del", function() {
  db.watchlist.delete($(this).parent().data('symbol'));
  toastr["info"]("Deleted")
});

$(document).on('show.bs.dropdown', ".dropdown", function() {
  $('body').append($(this).children('.dropdown-menu').css({
      position: 'absolute',
      left: $(this).offset().left,
      top: $(this).offset().top
    }).detach());
  });

$(document).on('hidden.bs.dropdown', ".dropdown", function() {
  $('#' + $(this).data('id')).append($(this).css({
    position: '', left: '', top: ''
  }).detach());
});

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
	"formatted-num-pre": function ( a ) {
		a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
		return parseFloat( a );
	},

	"formatted-num-asc": function ( a, b ) {
		return a - b;
	},

	"formatted-num-desc": function ( a, b ) {
		return b - a;
	}
} );

$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
    $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
} );

$('.toast').toast({animation: true});
