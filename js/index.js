$(document).ready(function() {
    // $.ajax({url: "https://api.coincap.io/v2/assets?limit=2000", success: function(result){
    //
    //   result.data.forEach(function(element) {
    //     if(element.id != "bitcoin") {
    //       element.name = "Shitcoin #" + (element.rank - 1)
    //       element.image = "shitcoin.png"
    //     }
    //   });

    var table = $('#coins').DataTable( {
        "ajax": "https://api.coincap.io/v2/assets?limit=2000",
        "pageLength": 100,
        "columns": [
            { "data": "rank" },
            { "data": "name",
              render: function (data, type, row) {
                img = "<img src='images/" + (data != "Bitcoin" ? 'poo' : 'bitcoin') + ".png' height='32' width='32' />"
                return img + (data != "Bitcoin" ? " Shitcoin #" + (row['rank'] - 1) : " Bitcoin")
              }
            },
            { "data": "marketCapUsd",
              "type": "num-fmt",
              render: $.fn.dataTable.render.number( ',', '.', 0, '$' )
            },
            { "data": "priceUsd",
              render: $.fn.dataTable.render.number( ',', '.', 2, '$' )
            },
            { "data": "volumeUsd24Hr",
              render: $.fn.dataTable.render.number( ',', '.', 0, '$' )
            },
            { "data": "supply",
              render: $.fn.dataTable.render.number( ',', '.', 0 )
            },
            { "data": "changePercent24Hr",
              render: $.fn.dataTable.render.number( ',', '.', 2, '', '%' )
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
      $('#market-cap').text(Math.round(ajaxJson.sum('marketCapUsd'))).digits();
      $('#volume').text(Math.round(ajaxJson.sum('volumeUsd24Hr'))).digits();
    });

} );

Array.prototype.sum = function (prop) {
    var total = 0
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
      if (!isNaN(parseFloat(this[i][prop])))
        total += parseFloat(this[i][prop])
    }

    return total
}

$.fn.digits = function(){
  return this.each(function(){
      $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
  })
}
