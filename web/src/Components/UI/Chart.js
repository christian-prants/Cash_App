import React, { useEffect, useState, useContext, useCallback } from 'react';

import { AuthContext } from '../../Context/Auth';

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";

import "./Chart.css";

const Chart = (isShown) => {
  const { user, funcGetTransactions } = useContext(AuthContext);
  const [ dataCashIn, setDataCashIn ] = useState([]);
  const [ dataCashOut, setDataCashOut ] = useState([]);   

  const fetchData = async () => {
    const resCashIn = await funcGetTransactions('cashin', user);
    const resCashOut = await funcGetTransactions('cashout', user);
    
    Object.values(resCashIn.data.transactions).map((index) => {
      setDataCashIn( result => [...result, index])
    })
    Object.values(resCashOut.data.transactions).map((index) => {
      setDataCashOut( result => [...result, index])
    })
  } 

  useEffect(() => {
    var root = am5.Root.new("chartdiv"); 

    fetchData()  
    if (dataCashOut || dataCashIn) {
      getChart(root)
    } 

    setDataCashIn([])
    setDataCashOut([])

    return () => root.dispose(); 
  }, [isShown])


  const getChart = (root) => {
    
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true
      })
    );

    var cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      })
    );
    cursor.lineY.set("visible", false);

    var xAxis1 = chart.xAxes.push(
      am5xy.CategoryDateAxis.new(root, {
        baseInterval: { timeUnit: "day", count: 1 },
        categoryField: "createdAt",
        startLocation: 0.5,
        endLocation: 0.5,
        renderer: am5xy.AxisRendererX.new(root, {}),
        //tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis1.data.setAll(dataCashOut);

    var xAxis2 = chart.xAxes.push(
      am5xy.CategoryDateAxis.new(root, {
        baseInterval: { timeUnit: "day", count: 1 },
        categoryField: "createdAt",
        startLocation: 0.5,
        endLocation: 0.5,
        renderer: am5xy.AxisRendererX.new(root, {}),        
      })
    );
    xAxis2.data.setAll(dataCashIn);

    var rangeDataItem = xAxis1.makeDataItem({
      //category: "0",
      //endCategory: "100",
    });
    var range = xAxis1.createAxisRange(rangeDataItem);

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );
    //yAxis.data.setAll(dataCashOut);

    const createSeriesTransf = (name, field, date) => {
      var series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: name,
          xAxis: xAxis1,
          yAxis: yAxis,
          stacked: true,
          valueYField: field,
          valueXField: date,
          categoryXField: "createdAt",
          tooltip: am5.Tooltip.new(root, {
            numberFormat: "#.00",
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\nData: {valueX.formatDate('dd/MM/yyyy')}[/]\nValor: {valueY.formatNumber('#.00')}"
          }),
        })
      );

      series.fills.template.setAll({
        fillOpacity: 0.5,
        visible: true,
      });

      series.data.setAll(dataCashOut);
      series.appear(1000);
    }
    createSeriesTransf("Transferido", "value", "createdAt");

    const createSeriesReceiv = (name, field, date) => {
      var series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: name,
          xAxis: xAxis2,
          yAxis: yAxis,
          stacked: true,
          valueYField: field,
          valueXField: date,
          categoryXField: "createdAt",
          tooltip: am5.Tooltip.new(root, {
            numberFormat: "#.00",
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\nData: {valueX.formatDate('dd/MM/yyyy')}[/]\nValor: {valueY.formatNumber('#.00')}"
          }),
        })
      );

      series.fills.template.setAll({
        fillOpacity: .3,
        visible: true,
      });
      series.data.setAll(dataCashIn);
      series.appear(1000);
    }
    createSeriesReceiv("Recebido", "value", "createdAt");

    rangeDataItem.get("axisFill").setAll({
      fill: am5.color(0x00ff33),
      fillOpacity: 0.1,
      visible: true,
    });

    chart.appear(1000, 100);    
  };

  return (
    <>
      <div id = "chartdiv" />    
    </>
    )
};

export default Chart;
