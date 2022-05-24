/*global define*/
define(["brease/core/designer/BaseWidget/ClassInfo"],function(s,e){"use strict";var classInfo={meta:{className:"widgets.brease.RadialGauge",parents:["*"],children:[],inheritance:["widgets.brease.RadialGauge","brease.core.BaseWidget"],actions:{"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setFormat":{"method":"setFormat","parameter":{"format":{"name":"format","index":0,"type":"brease.config.MeasurementSystemFormat"}}},"setMajorTicks":{"method":"setMajorTicks","parameter":{"majorTicks":{"name":"majorTicks","index":0,"type":"UInteger"}}},"setMaxValue":{"method":"setMaxValue","parameter":{"maxValue":{"name":"maxValue","index":0,"type":"Number"}}},"setMinValue":{"method":"setMinValue","parameter":{"minValue":{"name":"minValue","index":0,"type":"Number"}}},"setMinorTicks":{"method":"setMinorTicks","parameter":{"minorTicks":{"name":"minorTicks","index":0,"type":"UInteger"}}},"setNode":{"method":"setNode","parameter":{"node":{"name":"node","index":0,"type":"brease.datatype.Node"}}},"setRange":{"method":"setRange","parameter":{"range":{"name":"range","index":0,"type":"UNumber"}}},"setScaleArea0":{"method":"setScaleArea0","parameter":{"scaleArea0":{"name":"scaleArea0","index":0,"type":"Integer"}}},"setScaleArea1":{"method":"setScaleArea1","parameter":{"scaleArea1":{"name":"scaleArea1","index":0,"type":"Integer"}}},"setScaleArea2":{"method":"setScaleArea2","parameter":{"scaleArea2":{"name":"scaleArea2","index":0,"type":"Integer"}}},"setScaleArea3":{"method":"setScaleArea3","parameter":{"scaleArea3":{"name":"scaleArea3","index":0,"type":"Integer"}}},"setScaleArea4":{"method":"setScaleArea4","parameter":{"scaleArea4":{"name":"scaleArea4","index":0,"type":"Integer"}}},"setScaleArea5":{"method":"setScaleArea5","parameter":{"scaleArea5":{"name":"scaleArea5","index":0,"type":"Integer"}}},"setScaleAreaInPercent":{"method":"setScaleAreaInPercent","parameter":{"scaleAreaInPercent":{"name":"scaleAreaInPercent","index":0,"type":"Boolean"}}},"setShowUnit":{"method":"setShowUnit","parameter":{"showUnit":{"name":"showUnit","index":0,"type":"Boolean"}}},"setStartAngle":{"method":"setStartAngle","parameter":{"startAngle":{"name":"startAngle","index":0,"type":"Number"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setText":{"method":"setText","parameter":{"text":{"name":"text","index":0,"type":"String"}}},"setTextKey":{"method":"setTextKey","parameter":{"key":{"name":"key","index":0,"type":"String"}}},"setTransitionTime":{"method":"setTransitionTime","parameter":{"transitionTime":{"name":"transitionTime","index":0,"type":"UInteger"}}},"setUnit":{"method":"setUnit","parameter":{"unit":{"name":"unit","index":0,"type":"brease.config.MeasurementSystemUnit"}}},"SetValue":{"method":"setValue","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"ShowTooltip":{"method":"showTooltip"}},properties:{"value":{"nodeRefId":"node"}}}};if(s.classExtension){classInfo.classExtension = s.classExtension;}if(e){classInfo.classExtension = e;}return classInfo;});