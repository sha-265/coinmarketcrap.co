$(document).ready(function() {
    var table = $('#coins').DataTable( {
        ajax: "https://api.coincap.io/v2/assets?limit=2000",
        pageLength: 100,
        pagingType: "simple",
        scrollX: true,
        fixedColumns: {
          leftColumns: 2
        },
        dom: "<'row'<'col-sm-3'l><'col-sm-9'f p>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        columns: [
            { data: "rank",
              className: "text-center",
              render: function (data, type, row) {
                return (row['name'] != "Beam" ? data : 9999 )
              }
            },
            { data: "name",
              type: 'natural',
              render: function (data, type, row) {
                img = "<img alt='" + row['rank'] + "' src='images/" + (data != "Bitcoin" ? 'poo' : 'bitcoin') + ".png' height='32' width='32' title='" + data + " " + row['symbol'] + "' />"
                  return img + " " + (data != "Bitcoin" ? "Shitcoin #" + (row['rank'] - 1) : data)
              }
            },
            { data: "marketCapUsd",
              className: "text-right",
              render: $.fn.dataTable.render.number( ',', '.', 0, '$' ),
              defaultContent: "$0"
            },
            { data: "priceUsd",
              className: "text-right",
              render: $.fn.dataTable.render.number( ',', '.', 2, '$' ),
              defaultContent: "$0.00"
            },
            { data: "volumeUsd24Hr",
              className: "text-right",
              render: $.fn.dataTable.render.number( ',', '.', 0, '$' ),
              defaultContent: "$0"
            },
            { data: "supply",
              className: "text-right",
              render: $.fn.dataTable.render.number( ',', '.', 0 ),
              defaultContent: "-"
            },
            { data: "changePercent24Hr",
              className: "text-right",
              render: $.fn.dataTable.render.number( ',', '.', 2, '', '%' ),
              defaultContent: "0.00%"
            }
        ],
        aoColumnDefs: [ {
          aTargets: [6],
          fnCreatedCell: function (nTd, sData) {
             if ( sData < "0" ) {
              $(nTd).css('color', 'red')
            } else if (sData > "0") {
              $(nTd).css('color', 'green')
            }
          }
        } ]
    } );

    setInterval( function () {
        table.ajax.reload(null, false);
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
