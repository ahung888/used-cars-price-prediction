$( document ).ready(function() {
    let predictResult = self = {
        chart: null,
        hand: null,
        label: null,
        label2: null,
        axis: null,
        axis2: null,
        chartMin: 5000,
        chartMax: 50000,
        data: {
            score: 5000,
            gradingData: [
                {
                    title: "LOW PRICE",
                    color: "#f3eb0c",
                    lowScore: 256,
                    highScore: 19922
                },
                {
                    title: "MIDDLE LOW PRICE",
                    color: "#b0d136",
                    lowScore: 19922,
                    highScore: 27495
                },
                {
                    title: "MIDDLE HIGH PRICE",
                    color: "#0f9747",
                    lowScore: 27495,
                    highScore: 39047
                },
                {
                    title: "HIGH PRICE",
                    color: "#f04922",
                    lowScore: 39047,
                    highScore: 67735
                },
            ]
        },
        init: function() {
            am4core.ready(function() {

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end
                
                
                /**
                Grading Lookup
                    */
                function lookUpGrade(lookupScore, grades) {
                    // Only change code below this line
                    for (var i = 0; i < grades.length; i++) {
                        if (
                            grades[i].lowScore < lookupScore &&
                            grades[i].highScore >= lookupScore
                        ) {
                            return grades[i];
                        }
                    }
                    return null;
                }
                
                // create chart
                self.chart = am4core.create("chart-result", am4charts.GaugeChart);
                self.chart.hiddenState.properties.opacity = 0;
                self.chart.fontSize = 11;
                self.chart.innerRadius = am4core.percent(80);
                self.chart.resizable = true;
                
                /**
                 * Normal axis
                 */
                
                self.axis = self.chart.xAxes.push(new am4charts.ValueAxis());
                self.axis.min = self.chartMin;
                self.axis.max = self.chartMax;
                self.axis.strictMinMax = true;
                self.axis.renderer.radius = am4core.percent(80);
                self.axis.renderer.inside = true;
                self.axis.renderer.line.strokeOpacity = 0.1;
                self.axis.renderer.ticks.template.disabled = false;
                self.axis.renderer.ticks.template.strokeOpacity = 1;
                self.axis.renderer.ticks.template.strokeWidth = 0.5;
                self.axis.renderer.ticks.template.length = 5;
                self.axis.renderer.grid.template.disabled = true;
                self.axis.renderer.labels.template.radius = am4core.percent(15);
                self.axis.renderer.labels.template.fontSize = "0.9em";
                
                /**
                 * Axis for ranges
                 */
                
                self.axis2 = self.chart.xAxes.push(new am4charts.ValueAxis());
                self.axis2.min = self.chartMin;
                self.axis2.max = self.chartMax;
                self.axis2.strictMinMax = true;
                self.axis2.renderer.labels.template.disabled = true;
                self.axis2.renderer.ticks.template.disabled = true;
                self.axis2.renderer.grid.template.disabled = false;
                self.axis2.renderer.grid.template.opacity = 0.5;
                self.axis2.renderer.labels.template.bent = true;
                self.axis2.renderer.labels.template.fill = am4core.color("#000");
                self.axis2.renderer.labels.template.fontWeight = "bold";
                self.axis2.renderer.labels.template.fillOpacity = 0.3;
                
                
                
                /**
                Ranges
                */
                
                for (let grading of self.data.gradingData) {
                    var range = self.axis2.axisRanges.create();
                    range.axisFill.fill = am4core.color(grading.color);
                    range.axisFill.fillOpacity = 0.8;
                    range.axisFill.zIndex = -1;
                    range.value = grading.lowScore > self.chartMin ? grading.lowScore : self.chartMin;
                    range.endValue = grading.highScore < self.chartMax ? grading.highScore : self.chartMax;
                    range.grid.strokeOpacity = 0;
                    range.stroke = am4core.color(grading.color).lighten(-0.1);
                    range.label.inside = true;
                    range.label.text = grading.title.toUpperCase();
                    range.label.inside = true;
                    range.label.location = 0.5;
                    range.label.inside = true;
                    range.label.radius = am4core.percent(10);
                    range.label.paddingBottom = -5; // ~half font size
                    range.label.fontSize = "0.9em";
                }
                
                var matchingGrade = lookUpGrade(self.data.score, self.data.gradingData);
                
                /**
                 * Label 1
                 */
                
                self.label = self.chart.radarContainer.createChild(am4core.Label);
                self.label.isMeasured = false;
                self.label.fontSize = "6em";
                self.label.x = am4core.percent(50);
                self.label.paddingBottom = 15;
                self.label.horizontalCenter = "middle";
                self.label.verticalCenter = "bottom";
                // self.label.dataItem = self.data;
                self.label.text = self.data.score.toFixed(0);
                // self.label.text = "{score}";
                self.label.fill = am4core.color(matchingGrade.color);
                
                /**
                 * Label 2
                 */
                
                self.label2 = self.chart.radarContainer.createChild(am4core.Label);
                self.label2.isMeasured = false;
                self.label2.fontSize = "2em";
                self.label2.horizontalCenter = "middle";
                self.label2.verticalCenter = "bottom";
                self.label2.text = matchingGrade.title.toUpperCase();
                self.label2.fill = am4core.color(matchingGrade.color);

                // label position adjustement
                if (window.innerWidth < 768) {
                    setTimeout(() => {
                        self.label.bbox.y = -100
                        self.label.updateCenter()
                        self.label2.bbox.y = -110
                        self.label2.updateCenter()
                    }, 250)
                }

                
                /**
                 * Hand
                 */
                
                self.hand = self.chart.hands.push(new am4charts.ClockHand());
                self.hand.axis = self.axis2;
                self.hand.innerRadius = am4core.percent(55);
                self.hand.startWidth = 8;
                self.hand.pin.disabled = true;
                self.hand.value = self.data.score;
                self.hand.fill = am4core.color("#444");
                self.hand.stroke = am4core.color("#000");
                
                self.hand.events.on("positionchanged", function(){
                    if (self.hand.currentPosition < 0) return;
                    self.label.text = window.numberWithCommas(self.axis2.positionToValue(self.hand.currentPosition).toFixed(0));
                    // var value2 = axis.positionToValue(self.hand.currentPosition);
                    var matchingGrade = lookUpGrade(self.axis.positionToValue(self.hand.currentPosition), self.data.gradingData);
                    if (matchingGrade) {
                        self.label2.text = matchingGrade.title.toUpperCase();
                        self.label2.fill = am4core.color(matchingGrade.color);
                        self.label2.stroke = am4core.color(matchingGrade.color);  
                        self.label.fill = am4core.color(matchingGrade.color);
                    }
                })
            }); // end am4core.ready()
            return this
        },
        animate: function(val) {
            self.data.score = val
            self.hand.currentPosition = 0
            self.hand.rotation = 180
            if (!self.firtAnimate) {
                self.firtAnimate = true
                setTimeout(function(){
                    self.hand.showValue(self.data.score, 1000, am4core.ease.cubicOut);
                } ,1000)
            } else {
                setTimeout(function(){
                    self.hand.showValue(self.data.score, 1000, am4core.ease.cubicOut);
                } ,10)
            }
        }
    }

    predictResult.init()
    window.mycharts.predictResult = predictResult
})