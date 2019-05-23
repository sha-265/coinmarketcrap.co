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
              img = "<img src='images/" + (data != "Bitcoin" ? 'shitcoin' : 'bitcoin') + ".png' height='32' width='32' />"
              return img + (data != "Bitcoin" ? " Shitcoin #" + (row['rank'] - 1) : " Bitcoin")
            }},
            { "data": "marketCapUsd",
              render: function (toFormat) {
                return "$" + parseInt(toFormat).toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g, ","
                );
              }
            },
            { "data": "priceUsd",
              render: function (toFormat) {
                return "$" + (Math.round(toFormat * 100) / 100).toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g, ","
                );
              }
            },
            { "data": "volumeUsd24Hr",
              render: function (toFormat) {
                return "$" + parseInt(toFormat).toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g, ","
                );
              }
            },
            { "data": "supply",
              render: function (data, type, row) {
                row['symbol'] = (row['symbol'] != "BTC" ? "SHT" : "BTC")
                return parseInt(data).toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g, ","
                ) + " " + row['symbol'];
              }
            },
            { "data": "changePercent24Hr",
              render: function (toFormat) {
                return (Math.round(toFormat * 100) / 100).toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g, ","
                ) + "%";
              }
            }
        ],
        "aoColumnDefs": [ {
          "aTargets": [6],
          "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
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
    }, 10000 );
} );
