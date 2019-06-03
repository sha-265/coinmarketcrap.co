$(document).ready(function() {
    var table = $('#coins').DataTable( {
        "ajax": "https://api.coincap.io/v2/assets?limit=2000",
        "pageLength": 100,
        pagingType: "simple",
        scrollX: true,
        fixedColumns: {
          leftColumns: 2
        },
        "columns": [
            { "data": "rank",
              className: "text-center"
            },
            { "data": "name",
              render: function (data, type, row) {
                img = "<img src='images/" + (data != "Bitcoin" ? 'poo' : 'bitcoin') + ".png' height='32' width='32' />"
                return img + (data != "Bitcoin" ? " Shitcoin #" + (row['rank'] - 1) : " Bitcoin")
              }
            },
            { "data": "marketCapUsd",
              className: "text-right",
              render: $.fn.dataTable.render.number( ',', '.', 0, '$' ),
              defaultContent: "$0"
            },
            { "data": "priceUsd",
              className: "text-right",
              render: $.fn.dataTable.render.number( ',', '.', 2, '$' ),
              defaultContent: "$0.00"
            },
            { "data": "volumeUsd24Hr",
              className: "text-right",
              render: $.fn.dataTable.render.number( ',', '.', 0, '$' ),
              defaultContent: "$0"
            },
            { "data": "supply",
              className: "text-right",
              render: $.fn.dataTable.render.number( ',', '.', 0 ),
              defaultContent: "0"
            },
            { "data": "changePercent24Hr",
              className: "text-right",
              render: $.fn.dataTable.render.number( ',', '.', 2, '', '%' ),
              defaultContent: "0.00%"
            }
        ],
        "aoColumnDefs": [ {
          "aTargets": [6],
          "fnCreatedCell": function (nTd, sData) {
             if ( sData < "0" ) {
              $(nTd).css('color', 'red')
            } else if (sData > "0") {
              $(nTd).css('color', 'green')
            }
          }
        } ]
    } );

    setInterval( function () {
        table.ajax.reload();
    }, 30000 );

    table.on('xhr', function() {
      var ajaxJson = table.ajax.json().data;

      $('#shitcoins').text(ajaxJson.length - 1);
      $('#market-cap').text(Math.round(ajaxJson[0]['marketCapUsd'])).digits();
      $('#volume').text(Math.round(ajaxJson[0]['volumeUsd24Hr'])).digits();
    });

} );

$.fn.digits = function(){
  return this.each(function(){
      $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
  })
}
