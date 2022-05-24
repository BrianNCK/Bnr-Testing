/*global _, createjs,brease*/
define(['brease/core/Class',
    'brease/events/BreaseEvent',
    'libs/d3/d3',
    'brease/core/Types',
    'brease/core/Utils'],
    function (SuperClass, BreaseEvent, d3, Types, Utils) {
    /*jshint validthis:true,white:false */
    'use strict';

    var Renderer = SuperClass.extend(function Renderer(widget) {
            SuperClass.call(this);
            this.widget = widget;
            this.settings = widget.settings;
            this.data = widget.data;
            this.initialize();
        }, null),

        p = Renderer.prototype;

    p.initialize = function () {

        _initParsing(this);

        this.backgroundShape = $('<div/>').addClass('backShape')
            .css('border-radius', '50%');

        this.widget.el.append(this.backgroundShape);

        this.svgContainer = d3.select('#' + this.widget.elem.id)
            .append('svg')
            .attr('width', parseInt(this.settings.width, 10))
            .attr('height', parseInt(this.settings.width, 10))
            .attr('class', 'gaugeContainer');

        this.textContainer = d3.select('#' + this.widget.elem.id)
            .append('svg')
            .attr('width', parseInt(this.settings.width, 10))
            .attr('height', parseInt(this.settings.width, 10))
            .attr('class', 'textContainer');

        this.updateScaleAreas();
        this.calcMajorTick();
        this.calcMinorTick();
        this.calcPointer();
        this.drawText();
    };


    p.updateScaleAreas = function () {

        this.scaleData = [

            {
                startAngle: this.settings.scaleArea0,
                endAngle: this.settings.scaleArea1,
                pieClass: 'area1'
            },
            {
                startAngle: this.settings.scaleArea1,
                endAngle: this.settings.scaleArea2,
                pieClass: 'area2'
            },
            {
                startAngle: this.settings.scaleArea2,
                endAngle: this.settings.scaleArea3,
                pieClass: 'area3'
            },
            {
                startAngle: this.settings.scaleArea3,
                endAngle: this.settings.scaleArea4,
                pieClass: 'area4'
            },
            {
                startAngle: this.settings.scaleArea4,
                endAngle: this.settings.scaleArea5,
                pieClass: 'area5'
            },
        ];

        _drawScaleAreas(this);
    };

    p.calcMajorTick = function () {

        this.settings.majorTickAngle = [];
        this.settings.majorTickPosX = [];
        this.settings.majorTickPosY = [];
        this.settings.numberPosX = [];
        this.settings.numberPosY = [];

        var fullCircle = 360,
            tickCX = [],
            tickCY = [],
            numberCX = [],
            numberCY = [],
            numberGap = (this.settings.outerRadius - this.settings.innerRadius) / 1.25;

        this.settings.majorTickAngle[0] = this.settings.startAngle;

        if (this.settings.majorTicks > 0) {
            this.settings.majorTickAngle[1] = this.settings.startAngle + this.settings.range / this.settings.majorTicks;

            for (var i = 2; i < this.settings.majorTicks + 1; i += 1) {
                this.settings.majorTickAngle[i] = this.settings.majorTickAngle[i - 1] + this.settings.range / this.settings.majorTicks;
            }
        }

        for (var p = 0; p < this.settings.majorTicks + 1; p += 1) {

            if (this.settings.majorTickAngle[p] >= fullCircle) {
                this.settings.majorTickAngle[p] -= fullCircle;
            }

            if (this.settings.majorTickAngle[p] >= 0 && this.settings.majorTickAngle[p] < 90) {
                tickCX[p] = Math.sin(this.settings.majorTickAngle[p] * Math.PI / 180) * this.settings.innerRadius;
                tickCY[p] = Math.cos(this.settings.majorTickAngle[p] * Math.PI / 180) * this.settings.innerRadius;
                this.settings.majorTickPosX[p] = this.settings.radius + tickCX[p];
                this.settings.majorTickPosY[p] = this.settings.radius - tickCY[p];

                numberCX[p] = Math.sin(this.settings.majorTickAngle[p] * Math.PI / 180) * (this.settings.outerRadius + numberGap);
                numberCY[p] = Math.cos(this.settings.majorTickAngle[p] * Math.PI / 180) * (this.settings.outerRadius + numberGap);
                this.settings.numberPosX[p] = this.settings.radius + numberCX[p];
                this.settings.numberPosY[p] = this.settings.radius - numberCY[p];
            }
            else if (this.settings.majorTickAngle[p] >= 90 && this.settings.majorTickAngle[p] < 180) {
                tickCX[p] = Math.cos((this.settings.majorTickAngle[p] - 90) * Math.PI / 180) * this.settings.innerRadius;
                tickCY[p] = Math.sin((this.settings.majorTickAngle[p] - 90) * Math.PI / 180) * this.settings.innerRadius;
                this.settings.majorTickPosX[p] = this.settings.radius + tickCX[p];
                this.settings.majorTickPosY[p] = this.settings.radius + tickCY[p];

                numberCX[p] = Math.cos((this.settings.majorTickAngle[p] - 90) * Math.PI / 180) * (this.settings.outerRadius + numberGap);
                numberCY[p] = Math.sin((this.settings.majorTickAngle[p] - 90) * Math.PI / 180) * (this.settings.outerRadius + numberGap);
                this.settings.numberPosX[p] = this.settings.radius + numberCX[p];
                this.settings.numberPosY[p] = this.settings.radius + numberCY[p];
            }
            else if (this.settings.majorTickAngle[p] >= 180 && this.settings.majorTickAngle[p] < 270) {
                tickCX[p] = Math.sin((this.settings.majorTickAngle[p] - 180) * Math.PI / 180) * this.settings.innerRadius;
                tickCY[p] = Math.cos((this.settings.majorTickAngle[p] - 180) * Math.PI / 180) * this.settings.innerRadius;
                this.settings.majorTickPosX[p] = this.settings.radius - tickCX[p];
                this.settings.majorTickPosY[p] = this.settings.radius + tickCY[p];

                numberCX[p] = Math.sin((this.settings.majorTickAngle[p] - 180) * Math.PI / 180) * (this.settings.outerRadius + numberGap);
                numberCY[p] = Math.cos((this.settings.majorTickAngle[p] - 180) * Math.PI / 180) * (this.settings.outerRadius + numberGap);
                this.settings.numberPosX[p] = this.settings.radius - numberCX[p];
                this.settings.numberPosY[p] = this.settings.radius + numberCY[p];
            }
            else if (this.settings.majorTickAngle[p] >= 270 && this.settings.majorTickAngle[p] < 360) {
                tickCX[p] = Math.cos((this.settings.majorTickAngle[p] - 270) * Math.PI / 180) * this.settings.innerRadius;
                tickCY[p] = Math.sin((this.settings.majorTickAngle[p] - 270) * Math.PI / 180) * this.settings.innerRadius;
                this.settings.majorTickPosX[p] = this.settings.radius - tickCX[p];
                this.settings.majorTickPosY[p] = this.settings.radius - tickCY[p];

                numberCX[p] = Math.cos((this.settings.majorTickAngle[p] - 270) * Math.PI / 180) * (this.settings.outerRadius + numberGap);
                numberCY[p] = Math.sin((this.settings.majorTickAngle[p] - 270) * Math.PI / 180) * (this.settings.outerRadius + numberGap);
                this.settings.numberPosX[p] = this.settings.radius - numberCX[p];
                this.settings.numberPosY[p] = this.settings.radius - numberCY[p];
            }
        }

        _drawMajorTicks(this);
    };

    p.calcMinorTick = function () {

        if (this.settings.majorTicks > 0) {

            this.settings.totalMinorTicks = this.settings.minorTicks * this.settings.majorTicks + this.settings.majorTicks;
            this.settings.minorTickAngle = [];
            this.settings.minorPosX = [];
            this.settings.minorPosY = [];

            var fullCircle = 360,
                minorTickGap = this.settings.range / this.settings.totalMinorTicks,
                deltaCX = [],
                deltaCY = [];

            if (this.settings.minorTicks > 0) {

                this.settings.minorTickAngle[0] = this.settings.startAngle + minorTickGap;

                for (var i = 1; i < this.settings.totalMinorTicks; i += 1) {
                    this.settings.minorTickAngle[i] = this.settings.startAngle + minorTickGap * (i + 1);
                }

                for (var p = 0; p < this.settings.totalMinorTicks; p += 1) {

                    if (this.settings.minorTickAngle[p] >= fullCircle) {
                        this.settings.minorTickAngle[p] -= fullCircle;
                    }

                    if (this.settings.minorTickAngle[p] >= 0 && this.settings.minorTickAngle[p] < 90) {
                        deltaCX[p] = Math.sin(this.settings.minorTickAngle[p] * Math.PI / 180) * this.settings.innerRadius;
                        deltaCY[p] = Math.cos(this.settings.minorTickAngle[p] * Math.PI / 180) * this.settings.innerRadius;
                        this.settings.minorPosX[p] = this.settings.radius + deltaCX[p];
                        this.settings.minorPosY[p] = this.settings.radius - deltaCY[p];
                    }
                    else if (this.settings.minorTickAngle[p] >= 90 && this.settings.minorTickAngle[p] < 180) {
                        deltaCX[p] = Math.cos((this.settings.minorTickAngle[p] - 90) * Math.PI / 180) * this.settings.innerRadius;
                        deltaCY[p] = Math.sin((this.settings.minorTickAngle[p] - 90) * Math.PI / 180) * this.settings.innerRadius;
                        this.settings.minorPosX[p] = this.settings.radius + deltaCX[p];
                        this.settings.minorPosY[p] = this.settings.radius + deltaCY[p];
                    }
                    else if (this.settings.minorTickAngle[p] >= 180 && this.settings.minorTickAngle[p] < 270) {
                        deltaCX[p] = Math.sin((this.settings.minorTickAngle[p] - 180) * Math.PI / 180) * this.settings.innerRadius;
                        deltaCY[p] = Math.cos((this.settings.minorTickAngle[p] - 180) * Math.PI / 180) * this.settings.innerRadius;
                        this.settings.minorPosX[p] = this.settings.radius - deltaCX[p];
                        this.settings.minorPosY[p] = this.settings.radius + deltaCY[p];
                    }
                    else if (this.settings.minorTickAngle[p] >= 270 && this.settings.minorTickAngle[p] < 360) {
                        deltaCX[p] = Math.cos((this.settings.minorTickAngle[p] - 270) * Math.PI / 180) * this.settings.innerRadius;
                        deltaCY[p] = Math.sin((this.settings.minorTickAngle[p] - 270) * Math.PI / 180) * this.settings.innerRadius;
                        this.settings.minorPosX[p] = this.settings.radius - deltaCX[p];
                        this.settings.minorPosY[p] = this.settings.radius - deltaCY[p];
                    }
                }

                _drawMinorTicks(this);
            }
        }
    };

    p.calcPointer = function () {

        var knobSize = 0.04,
            needleSize = 0.75;

        this.settings.knobRadius = parseInt(this.settings.width, 10) * knobSize / 2;

        this.needleData = [
            {
                M1: 'M' + this.settings.radius + ',' + (this.settings.radius - this.settings.innerRadius) + ' ',
                L1: 'L' + (this.settings.radius - this.settings.knobRadius * needleSize) + ',' + this.settings.radius + ' ',
                L2: 'L' + (this.settings.radius + this.settings.knobRadius * needleSize) + ',' + this.settings.radius + ' ',
                M2: 'L' + this.settings.radius + ',' + (this.settings.radius - this.settings.innerRadius) + ' Z'
            }
        ];

        this.drawPointer();
    };

    p.drawPointer = function () {

        this.groupToRotate = this.svgContainer.append('g')
            .attr('class', 'groupToRotate');


        this.groupPointer = this.groupToRotate.append('g')
            .attr('class', 'groupPointer');

        this.pointerNeedle = this.groupPointer.selectAll('path')
            .data(this.needleData)
            .enter()
            .append("path")
            .attr('class', 'needle')
            .attr("d", function (d) { return (d.M1 + d.L1 + d.L2 + d.M2); });

        this.pointerKnob = this.groupPointer.append('circle')
            .attr('cx', this.settings.radius)
            .attr('cy', this.settings.radius)
            .attr('r', this.settings.knobRadius)
            .attr('class', 'knob');

        this.updateNeedle();
    };

    p.updateNeedle = function () {

        this.groupToRotate.attr('transform', 'rotate(' + this.settings.startAngle + ' ' + this.settings.radius + ',' + this.settings.radius + ')');

        this.settings.minMaxScale = d3.scale.linear().domain([this.data.node.minValue, this.data.node.maxValue])
            .range([0, this.settings.range]);

        if (this.data.node.value > this.data.node.maxValue) {
            this.settings.oldPosition = this.settings.actPosition;
            this.settings.actPosition = this.settings.range;
        }
        else if (this.data.node.value < this.data.node.minValue) {
            this.settings.oldPosition = this.settings.actPosition;
            this.settings.actPosition = 0;
        }
        else {
            this.settings.oldPosition = this.settings.actPosition;
            this.settings.actPosition = this.settings.minMaxScale(this.data.node.value);
        }

        this.groupPointer.transition()
            .duration(this.widget.settings.transitionTime)
            .attrTween('transform', _.bind(function () {
                if (this.settings.oldPosition !== undefined) {
                    return d3.interpolateString('rotate(' + this.settings.oldPosition + ' ' + this.settings.radius + ',' + this.settings.radius + ')', 'rotate(' + this.settings.actPosition + ' ' + this.settings.radius + ',' + this.settings.radius + ')');
                }
                else {
                    return d3.interpolateString('rotate(0 ' + this.settings.radius + ',' + this.settings.radius + ')', 'rotate(' + this.settings.actPosition + ' ' + this.settings.radius + ',' + this.settings.radius + ')');
                }
            }, this));

    };

    p.writeNumbers = function () {

        var rangeStep;

        if (this.settings.majorTicks > 0) {
            rangeStep = (this.data.node.maxValue - this.data.node.minValue) / this.settings.majorTicks;
        }
        else {
            rangeStep = 0;
        }

        for (var i = 0; i < this.settings.majorTicks + 1; i += 1) {
            if (this.settings.numberFormat !== undefined) {
                this.majorNumbers[i].text(brease.formatter.formatNumber((this.data.node.minValue + i * rangeStep), this.settings.numberFormat, this.settings.useDigitGrouping, this.settings.separators));
            }
        }
    };

    p.drawText = function () {

        var width = this.settings.width,
            height = this.settings.height,
            groupRotation = (360 - this.settings.range) / 2,
            containerRotation = (this.settings.startAngle + this.settings.range) % 360 + groupRotation;

        this.groupText = this.textContainer.append('g')
            .attr('class', 'groupText');

        this.textElement = this.groupText.append('text')
            .attr('x', '50%')
            .attr('y', '20%');

        this.unitElement = this.groupText.append('text')
            .attr('x', '50%')
            .attr('y', '27%');

        this.textContainer.style('transform', 'rotate(' + containerRotation + 'deg)');
        this.groupText.attr('transform', 'rotate(' + containerRotation * (-1) + ', ' + width * 0.5 + ', ' + height * 0.2 + ')');

    };

    p.redraw = function () {
        this.widget.el.find('.groupMajorTicks').remove();
        this.widget.el.find('.groupMinorTicks').remove();
        this.widget.el.find('.groupNumbers').remove();
        this.widget.el.find('.groupScaleAreas').remove();
        this.widget.el.find('.groupToRotate').remove();
        this.widget.el.find('.textContainer').children().remove();

        _resizeContainers(this);

        this.backgroundShape.css('border-radius', '50%');

        this.updateScaleAreas();
        this.calcMajorTick();
        this.calcMinorTick();
        this.calcPointer();
        this.writeNumbers();
        this.drawText();
        this.widget.writeUnit(this.widget.settings.unitSymbol);
        this.textElement.text(this.widget.settings.text);
    };

    /*PRIVATE
     **FUNCTIONS*/

    function _drawScaleAreas(widget) {

        var pieScale,
            outerSize = 0.70,
            innerSize = 0.55,
            scaleRange = widget.settings.range * Math.PI / 180;

        widget.settings.radius = parseInt((widget.settings.width / 2), 10);
        widget.settings.innerRadius = widget.settings.radius * innerSize;
        widget.settings.outerRadius = widget.settings.radius * outerSize;

        if (widget.arc !== undefined) {
            widget.widget.el.find('.groupScaleAreas').remove();
        }

        if (widget.settings.scaleAreaInPercent) {
            pieScale = d3.scale.linear().domain([0, 100]).range([0, scaleRange]);
        }
        else {
            pieScale = d3.scale.linear().domain([widget.data.node.minValue, widget.data.node.maxValue]).range([0, scaleRange]);
        }

        widget.arc = d3.svg.arc()
            .innerRadius(widget.settings.innerRadius)
            .outerRadius(widget.settings.outerRadius)
            .startAngle(function (d) { return pieScale(d.startAngle); })
            .endAngle(function (d) { return pieScale(d.endAngle); });

        widget.groupScaleAreas = widget.svgContainer.insert('g', ':first-child')
            .attr('class', 'groupScaleAreas');

        widget.groupScaleAreas.selectAll('path')
            .data(widget.scaleData)
            .enter()
            .append('path')
            .attr('d', widget.arc)
            .attr('class', function (d) { return d.pieClass; })
            .attr('transform', 'translate(' + widget.settings.radius + ',' + widget.settings.width / 2 + ') rotate(' + widget.settings.startAngle + ')');

    }

    function _drawMajorTicks(widget) {

        var svgMajorTick = [],
            majorLength = widget.settings.outerRadius - widget.settings.innerRadius,
            fontSizeNumbers = 0.085;

        widget.majorNumbers = [];

        widget.groupMajorTicks = widget.svgContainer.append('g')
            .attr('class', 'groupMajorTicks');

        widget.groupMajorNumbers = widget.svgContainer.append('g')
            .attr('class', 'groupNumbers');

        for (var i = 0; i < widget.settings.majorTicks + 1; i += 1) {

            svgMajorTick[i] = widget.groupMajorTicks.append('line')
                .attr('class', 'majorTick')
                .attr('id', 'major' + i)
                .attr('x1', widget.settings.majorTickPosX[i])
                .attr('x2', widget.settings.majorTickPosX[i] + majorLength)
                .attr('y1', widget.settings.majorTickPosY[i])
                .attr('y2', widget.settings.majorTickPosY[i]);

            widget.widget.el.find('#major' + i).css({
                'transform': 'rotate(' + (widget.settings.majorTickAngle[i] - 90) + 'deg)'
            });

            widget.majorNumbers[i] = widget.groupMajorNumbers.append('text')
                .attr('x', widget.settings.numberPosX[i])
                .attr('y', widget.settings.numberPosY[i]);
        }
    }

    function _drawMinorTicks(widget) {

        var svgMinorTick = [],
            minorLength = (widget.settings.outerRadius - widget.settings.innerRadius) / 2;

        widget.groupMinorTicks = widget.svgContainer.append('g')
            .attr('class', 'groupMinorTicks');

        for (var i = 0; i < widget.settings.totalMinorTicks ; i += 1) {

            svgMinorTick[i] = widget.groupMinorTicks.append('line')
                .attr('class', 'minorTick')
                .attr('id', 'minor' + i)
                .attr('x1', widget.settings.minorPosX[i])
                .attr('x2', widget.settings.minorPosX[i] + minorLength)
                .attr('y1', widget.settings.minorPosY[i])
                .attr('y2', widget.settings.minorPosY[i]);

            widget.widget.el.find('#minor' + i).css({
                'transform': 'rotate(' + (widget.settings.minorTickAngle[i] - 90) + 'deg)'
            });
        }
    }

    function _initParsing(widget) {
        widget.settings.majorTicks = parseInt(widget.settings.majorTicks, 10);
        widget.settings.minorTicks = parseInt(widget.settings.minorTicks, 10);
        widget.settings.startAngle = parseInt(widget.settings.startAngle, 10);
        widget.settings.scaleArea0 = parseInt(widget.settings.scaleArea0, 10);
        widget.settings.scaleArea1 = parseInt(widget.settings.scaleArea1, 10);
        widget.settings.scaleArea2 = parseInt(widget.settings.scaleArea2, 10);
        widget.settings.scaleArea3 = parseInt(widget.settings.scaleArea3, 10);
        widget.settings.scaleArea4 = parseInt(widget.settings.scaleArea4, 10);
        widget.settings.scaleArea5 = parseInt(widget.settings.scaleArea5, 10);
    }

    function _resizeContainers(widget) {
        widget.widget.el.css('height', parseInt(widget.widget.settings.height, 10))
            .css('width', parseInt(widget.widget.settings.width, 10));
        widget.svgContainer.attr('width', parseInt(widget.widget.settings.width, 10))
            .attr('height', parseInt(widget.widget.settings.width, 10));
        widget.textContainer.attr('width', parseInt(widget.widget.settings.width, 10))
            .attr('height', parseInt(widget.widget.settings.width, 10));
    }

    return Renderer;

});