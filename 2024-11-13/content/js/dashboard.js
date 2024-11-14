/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5357142857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Account DB - > Account Available balance checking"], "isController": false}, {"data": [0.74, 500, 1500, "GetTransactionPinFailedCount"], "isController": false}, {"data": [0.65, 500, 1500, "User_Token"], "isController": false}, {"data": [0.0, 500, 1500, "ValidateAmountForMobileTransfer"], "isController": false}, {"data": [0.0, 500, 1500, "KiibankToMobileMoneyTransfer"], "isController": false}, {"data": [0.69, 500, 1500, "ValidatePaymentCoolingAmount"], "isController": false}, {"data": [0.0, 500, 1500, "Transfer Status -> MobileMoneyTransfer"], "isController": false}, {"data": [0.46, 500, 1500, "GetSummary"], "isController": false}, {"data": [1.0, 500, 1500, "Account DB ->Account Statement"], "isController": false}, {"data": [0.0, 500, 1500, "Payment Provider DB -> TransactionLogs"], "isController": false}, {"data": [0.99, 500, 1500, "GetProviderByServiceType"], "isController": false}, {"data": [0.21, 500, 1500, "GetAccountHolderFeeDetails"], "isController": false}, {"data": [0.85, 500, 1500, "ValidateTransactionPin"], "isController": false}, {"data": [0.79, 500, 1500, "IsServiceManagementEnabled"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 504, 0, 0.0, 2014.7380952380938, 171, 16573, 879.0, 7561.0, 9720.75, 13091.0, 0.4961396593764981, 0.309090385706748, 0.5785777335917066], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Account DB - > Account Available balance checking", 1, 0, 0.0, 3079.0, 3079, 3079, 3079.0, 3079.0, 3079.0, 3079.0, 0.32478077297823965, 0.04598946492367652, 0.0], "isController": false}, {"data": ["GetTransactionPinFailedCount", 50, 0, 0.0, 659.5000000000001, 235, 1863, 325.5, 1200.8999999999999, 1508.2999999999977, 1863.0, 0.05064568179723292, 0.03051006658894243, 0.058608528251680676], "isController": false}, {"data": ["User_Token", 50, 0, 0.0, 806.88, 292, 2293, 735.0, 1453.3, 1721.1999999999996, 2293.0, 0.050470995328404676, 0.07088611863409336, 0.01596933836562804], "isController": false}, {"data": ["ValidateAmountForMobileTransfer", 50, 0, 0.0, 10067.86, 7342, 16573, 9674.5, 13088.0, 14712.849999999999, 16573.0, 0.05016786166513153, 0.017754719792425457, 0.0601132483038246], "isController": false}, {"data": ["KiibankToMobileMoneyTransfer", 50, 0, 0.0, 3737.4, 3052, 6295, 3462.0, 4507.5, 5503.799999999995, 6295.0, 0.050514643184766395, 0.019041652606757647, 0.09649086139590145], "isController": false}, {"data": ["ValidatePaymentCoolingAmount", 50, 0, 0.0, 746.9199999999998, 263, 2187, 467.0, 1549.9, 1956.7, 2187.0, 0.05063891114187706, 0.02250761134483782, 0.06052932347427493], "isController": false}, {"data": ["Transfer Status -> MobileMoneyTransfer", 1, 0, 0.0, 2892.0, 2892, 2892, 2892.0, 2892.0, 2892.0, 2892.0, 0.3457814661134163, 0.1563445496196404, 0.0], "isController": false}, {"data": ["GetSummary", 50, 0, 0.0, 876.0999999999998, 517, 1867, 725.5, 1411.0, 1673.5999999999997, 1867.0, 0.05062517022713489, 0.024583859518696384, 0.059969073716322874], "isController": false}, {"data": ["Account DB ->Account Statement", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 67.67406798245614, 0.0], "isController": false}, {"data": ["Payment Provider DB -> TransactionLogs", 1, 0, 0.0, 2885.0, 2885, 2885, 2885.0, 2885.0, 2885.0, 2885.0, 0.3466204506065858, 0.06126787261698441, 0.0], "isController": false}, {"data": ["GetProviderByServiceType", 50, 0, 0.0, 212.34000000000003, 172, 1143, 186.0, 233.5, 267.59999999999997, 1143.0, 0.05061389594390361, 0.03361079027524849, 0.059461442207535194], "isController": false}, {"data": ["GetAccountHolderFeeDetails", 50, 0, 0.0, 1802.6799999999998, 1034, 8434, 1567.5, 2280.3, 2937.0999999999967, 8434.0, 0.050561996592121426, 0.03248904542742584, 0.05994361705355021], "isController": false}, {"data": ["ValidateTransactionPin", 50, 0, 0.0, 637.0599999999998, 243, 7337, 284.0, 1171.8999999999999, 1626.3999999999974, 7337.0, 0.050642809176882166, 0.034659661647795464, 0.0634518790761131], "isController": false}, {"data": ["IsServiceManagementEnabled", 50, 0, 0.0, 581.28, 260, 1542, 345.5, 1152.1, 1354.849999999999, 1542.0, 0.0505477863607919, 0.018906056812679, 0.0596305917224967], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 504, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
