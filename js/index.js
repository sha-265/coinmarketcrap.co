$(document).ready(function() {
    // $.ajax({url: "https://api.coincap.io/v2/assets?limit=2000", success: function(result){
    //
    //   result.data.forEach(function(element) {
    //     if(element.id != "bitcoin") {
    //       element.name = "Shitcoin #" + (element.rank - 1)
    //       element.image = "shitcoin.png"
    //     }
    //   });

    $('#coins').DataTable( {
        "ajax": "https://api.coincap.io/v2/assets?limit=2000",
        "pageLength": 100,
        "columns": [
            { "data": "rank" },
            { "data": "name",
            render: function (data, type, row) {
              return (data != "Bitcoin" ? "<img style='vertical-align: middle;' src='images/pile-of-poo_1f4a9.png' height='24' width='24' /> Shitcoin #" + (row['rank'] - 1) : "<img style='vertical-align: middle;' src='images/bitcoin.png' height='24' width='24' /> Bitcoin")
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
        ]
    } );
} );
