(function () {
    'use strict';

    angular
        .module('beincharge.patientdetail')
        .controller('PatientDetailHighChartsController', PatientDetailHighChartsController);

    PatientDetailHighChartsController.$inject = ['patientDataService', '$stateParams', 'headerService'];

    function PatientDetailHighChartsController(patientDataService, $stateParams, headerService) {
        /* jshint validthis:true */
        var vm = this;
        vm.averageBreakfastCaloriesBeforeSession = 0;
        vm.averageDinnerCaloriesBeforeSession = 0;
        vm.averageLunchCaloriesBeforeSession = 0;
        vm.averageSnackCaloriesBeforeSession = 0;
        vm.addCompletingSessionToLegend = false;
        vm.showTotal = true;
        vm.noDataFound = false;
        vm.showBreakfast = true;
        vm.showLunch = true;
        vm.showSnack = true;
        vm.breakfast = [];
        vm.breakfastSeries = [1, 5, 6];
        vm.chart = '';
        vm.chartDate = '';
        vm.chartLoaded = false;
        vm.dinner = [];
        vm.dinnerSeries = [3, 9, 10];
        vm.linecolor = '#F3B827'
        vm.lunch = [];
        vm.lunchSeries = [2, 7, 8];
        vm.myData = {};
        vm.patientID = $stateParams.patientID;
        vm.headerService = headerService;
        vm.showDetails = false;
        vm.snack = [];
        vm.snackSeries = [4, 11, 12];
        vm.toggleGraph = toggleGraph;
        vm.totalCalories = '';
        vm.totalSeries = [0, 13, 14];
        vm.xBreakfastPlotbands = [];
        vm.xBreakfastPlotlines = [];
        vm.xDinnerPlotbands = [];
        vm.xDinnerPlotlines = [];
        vm.xLunchPlotbands = [];
        vm.xLunchPlotlines = [];
        vm.xPlotbands = [];
        vm.xPlotlines = [];
        vm.xSnackPlotbands = [];
        vm.xSnackPlotlines = [];

        ///// public /////

        activate();

        function activate() {
            return getData(vm.patientID)
                .then(function (data) {
                    if (data.Plots.length > 0) {
                        loadhighchart(data);
                    } else {
                        toastr.warning('No data has been entered yet for this chart.', 'No Data Found', {
                            timeOut: 5000
                        });
                        vm.noDataFound = true;
                    }

                    vm.chartLoaded = true;
                })
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                    toastr.error(vm.headerService.errors[0] === 'Internal Server Error' ? 'no available chart data. ' : vm.headerService.errors[0] || error.message, 'Error Loading Chart', {
                        timeOut: 5000
                    });
                    vm.chartLoaded = true;
                });
        }

        ///////highchart///////

        /* KEY
        index 0, session 1 = baseline
        index 1, session 2 = snack
        index 2, session 3 = breakfast
        index 3, session 4 = review
        index 4, session 5 = lunch
        index 4, session 6 = dinner
        */

        function loadhighchart(data) {
            var seriesData = [];
            var breakfastSeriesData = [];
            var lunchSeriesData = [];
            var dinnerSeriesData = [];
            var snackSeriesData = [];
            var averageBreakfastSeriesData = [];
            var breakfastCaloriesGoalSeriesData = [];
            var averageLunchSeriesData = [];
            var lunchCaloriesGoalSeriesData = [];
            var averageDinnerSeriesData = [];
            var dinnerCaloriesGoalSeriesData = [];
            var averageSnackSeriesData = [];
            var snackCaloriesGoalSeriesData = [];
            var averageTotalSeriesData = [];
            var totalCaloriesGoalSeriesData = [];
            var zones = [];
            var breaks = [];
            var prevElement = null;

            setAverageCaloriesBeforeSession(data);

            prepareZones(data, zones);

            

            data.Plots.forEach(function (element) {

                seriesData.push({
                    'y': element.TotalCalories,
                    'x': newDate(element.Day)
                        ,
                    'myData': element,
                    'name': 'total'
                });

                ['Breakfast', 'Snack', 'Lunch', 'Dinner'].forEach(function (el) {
                    eval(el.toLowerCase() + 'SeriesData')
                        .push({
                            'y': element[el + 'Calories'],
                            'x': newDate(element.Day),
                            'myData': element,
                            'name': el.toLowerCase()
                        })
                });

            });

            data.PlotLines.forEach(function (element, index) {

                if (index === 0 && snackSeriesData && snackSeriesData.length) {
                    addClosestNullValue(element, snackSeriesData)
                }
                if (index === 1 && breakfastSeriesData && breakfastSeriesData.length) {
                    addClosestNullValue(element, breakfastSeriesData)
                }
                if (index === 3 && lunchSeriesData && lunchSeriesData.length) {
                    addClosestNullValue(element, lunchSeriesData)
                }
                if (index === 4 && dinnerSeriesData && dinnerSeriesData.length) {
                   
                    addClosestNullValue(element, dinnerSeriesData)
                }
                

                vm.xPlotlines.push({
                    color: 'black',
                    'value': newDate(element.EndDate),
                    'width': 1
                });

                vm.xPlotbands.push({
                    from: newDate(element.StartDate),
                    to: newDate(element.DashedDate),
                    label: {
                        'text': 'Session ' + (index + 1),
                        //'y': index % 2 ? -20 : -5,
                        'y': index  -27,
                        'rotation': 45
                    }

                });

                if (element.Title === 'baseline') {
                    ['Breakfast', 'Snack', 'Lunch', 'Dinner'].forEach(function (el) {
                        vm['x' + el + 'Plotbands'].push({
                            from: newDate(element.StartDate),
                            to:  newDate(element.DashedDate),
                            label: {
                                'text': 'Baseline',
                                'y': -20
                            }

                        });
                    });
                }

                if (element.Title === 'Snack' || element.Title === 'Breakfast' || element.Title === 'Lunch' || element.Title === 'Dinner') {

                    vm['x' + element.Title + 'Plotlines'].push({
                        color: 'black',
                        'value': newDate(prevElement.EndDate),
                        'width': 1
                    });

                    vm['x' + element.Title + 'Plotbands'].push({
                        from: newDate(element.StartDate),
                        to: newDate(element.DashedDate),
                        label: {
                            'text': 'Session ' + (index + 1),
                            'y': -20,
                        }
                    });

                }

                if (newDate(element.DashedDate) < newDate(element.EndDate)) {
                    vm.xPlotlines.push({
                        'color': 'black',
                        'value': newDate(element.DashedDate),
                        'width': 1,
                        'dashStyle': 'longdash'
                    });
                    vm.addCompletingSessionToLegend = true;
                    zones.push({
                        value: newDate(element.DashedDate),
                        color: vm.linecolor
                    });

                    zones.push({
                        value: newDate(element.EndDate),
                        color: '#B0B0B0'
                    });

                }

                pushNullValue(element);

                //////////////////////////////////////////

                averageBreakfastSeriesData.push({
                    'y': index > 1 ? element.AverageBreakfastCalories : vm.averageBreakfastCaloriesBeforeSession,
                    'x': index > 0 ? newDate(data.PlotLines[index - 1].EndDate)
                         : newDate(element.StartDate)
                            
                });
                averageBreakfastSeriesData.push({
                    'y': index > 1 ? element.AverageBreakfastCalories : vm.averageBreakfastCaloriesBeforeSession,
                    'x': newDate(element.DashedDate)
                        
                });
                if (index) {

                    averageBreakfastSeriesData.push({
                        'y': null,
                        'x': newDate(element.DashedDate)
                            
                    });

                }

                ///////////////////////////////////
                if (index > 1) {
                    breakfastCaloriesGoalSeriesData.push({
                        'y': element.BreakfastCaloriesGoal,
                        'x': newDate(data.PlotLines[index - 1].EndDate)
                            
                    });
                    breakfastCaloriesGoalSeriesData.push({
                        'y': element.BreakfastCaloriesGoal,
                        'x': newDate(data.PlotLines[index - 1].EndDate)
                    });

                    breakfastCaloriesGoalSeriesData.push({
                        'y': index > 1 ? element.BreakfastCaloriesGoal : null,
                        'x': newDate(element.DashedDate)
                    });
                }

                /////////////////////////////////////
                averageLunchSeriesData.push({
                    'y': index > 3 ? element.AverageLunchCalories : vm.averageLunchCaloriesBeforeSession,
                    'x': index > 0 ? newDate(data.PlotLines[index - 1].EndDate)
                         : newDate(element.StartDate)
                            
                            
                });
                averageLunchSeriesData.push({
                    'y': index > 3 ? element.AverageLunchCalories : vm.averageLunchCaloriesBeforeSession,
                    'x': newDate(element.DashedDate)
                        
                });
                if (index > 2) {
                    averageLunchSeriesData.push({
                        'y': null,
                        'x': newDate(element.DashedDate)
                            
                    });
                }

                ////////////////////////////////////
                if (index > 3) {
                    lunchCaloriesGoalSeriesData.push({
                        'y': element.LunchCaloriesGoal,
                        'x': newDate(data.PlotLines[index - 1].EndDate)
                            
                    })
                    lunchCaloriesGoalSeriesData.push({
                        'y': element.LunchCaloriesGoal,
                        'x': newDate(data.PlotLines[index - 1].EndDate)
                    })

                    lunchCaloriesGoalSeriesData.push({
                        'y': index > 1 ? element.LunchCaloriesGoal : null,
                        'x': newDate(element.DashedDate)
                    });

                }

                /////////////////////////////////////
                averageDinnerSeriesData.push({
                    'y': index > 4 ? element.AverageDinnerCalories : vm.averageDinnerCaloriesBeforeSession,
                    'x': index > 0 ? newDate(data.PlotLines[index - 1].EndDate)
                         : newDate(element.StartDate)
                            
                });
                averageDinnerSeriesData.push({
                    'y': index > 4 ? element.AverageDinnerCalories : vm.averageDinnerCaloriesBeforeSession,
                    'x': newDate(element.DashedDate)
                        
                });
                if (index > 3) {
                    averageDinnerSeriesData.push({
                        'y': null,
                        'x': newDate(element.DashedDate)
                            
                            
                    });
                }
                //////////////////////////////////////
                if (index > 4) {
                    dinnerCaloriesGoalSeriesData.push({
                        'y': element.DinnerCaloriesGoal,
                        'x': newDate(data.PlotLines[index - 1].EndDate)
                            
                            
                    });
                    dinnerCaloriesGoalSeriesData.push({
                        'y': element.DinnerCaloriesGoal,
                        'x': newDate(data.PlotLines[index - 1].EndDate)
                            
                    });
                    dinnerCaloriesGoalSeriesData.push({
                        'y': element.DinnerCaloriesGoal,
                        'x': newDate(element.DashedDate)
                            
                    });
                }

                //////////////////////////////////
                averageSnackSeriesData.push({
                    'y': index > 0 ? element.AverageSnackCalories : vm.averageSnackCaloriesBeforeSession,
                    'x': index > 0 ? newDate(data.PlotLines[index - 1].EndDate)
                        
                         : newDate(element.StartDate)
                            
                            
                });
                averageSnackSeriesData.push({
                    'y': element.AverageSnackCalories,
                    'x': newDate(element.DashedDate)
                        
                        
                });
                averageSnackSeriesData.push({
                    'y': null,
                    'x': newDate(element.DashedDate)
                        
                        
                });
                //////////////////////////////////
                if (index) {
                    snackCaloriesGoalSeriesData.push({
                        'y': element.SnackCaloriesGoal,
                        'x': newDate(data.PlotLines[index - 1].EndDate)
                            
                    })
                    snackCaloriesGoalSeriesData.push({
                        'y': element.SnackCaloriesGoal,
                        'x': newDate(data.PlotLines[index - 1].EndDate)
                            
                            
                    });
                    snackCaloriesGoalSeriesData.push({
                        'y': element.SnackCaloriesGoal,
                        'x': newDate(element.DashedDate)
                            
                    });
                }

                ///////////////////////////////
             
                    averageTotalSeriesData.push({
                        'y': element.AverageTotalCalories,
                        'x': index ? newDate(data.PlotLines[index - 1].EndDate) : newDate(data.PlotLines[index].StartDate)
                    });
                           
                    averageTotalSeriesData.push({
                        'y': element.AverageTotalCalories,
                        'x': newDate(element.DashedDate) - 1
                    });
                    averageTotalSeriesData.push({
                        'y': null,
                        'x': newDate(element.DashedDate) - 1
                    });

                
       
                /////////////////////////////////
                totalCaloriesGoalSeriesData.push({
                    'y': index > 0 ? element.TotalCaloriesGoal : null,
                    'x': index > 0 ? newDate(data.PlotLines[index - 1].EndDate)                     
                        : newDate(element.StartDate)
                            

                });
                totalCaloriesGoalSeriesData.push({
                    'y': element.TotalCaloriesGoal,
                    'x': newDate(element.DashedDate)
                        
                });
                totalCaloriesGoalSeriesData.push({
                    'y': null,
                    'x': newDate(element.DashedDate)
                        
                });

                prevElement = element;

            });

            function pushNullValue(element) {
             
                seriesData.sort(function (a, b) {
                    return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
                })


                var enddt = newDate(element.EndDate)

                var closest = newDate(seriesData[0].x);
                var value = seriesData[0].y


                seriesData.forEach(function (d) {
                    var date = newDate(d.x);
                    if (date <= enddt ) {
                        closest = newDate(d.x);
                    }                      
                });

                seriesData.push({
                    'y': null,
                    'x': closest,
                    'myData': null,
                    'name': 'total'
                })
                
                seriesData.sort(function (a, b) {
                    return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
                })

           
            

            }

            addBreaksToGraphIfPointsAreMoreThanFiveDaysApart(data, breaks,
                averageTotalSeriesData, averageBreakfastSeriesData, averageSnackSeriesData, averageDinnerSeriesData, averageLunchSeriesData,
                totalCaloriesGoalSeriesData, breakfastCaloriesGoalSeriesData, snackCaloriesGoalSeriesData, dinnerCaloriesGoalSeriesData, lunchCaloriesGoalSeriesData)

        


           
            zones.sort(function (a, b) {
                return a.value - b.value;
            });

            seriesData.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            });


            breakfastSeriesData.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            });

            lunchSeriesData.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            });
            dinnerSeriesData.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            });
            snackSeriesData.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            });
          
            snackCaloriesGoalSeriesData.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            });
            breakfastCaloriesGoalSeriesData.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            });
            dinnerCaloriesGoalSeriesData.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            });
            lunchCaloriesGoalSeriesData.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            });          
            averageTotalSeriesData.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            });

            Highcharts.wrap(Highcharts.Axis.prototype, 'getLinePath', function (proceed, lineWidth) {
                var axis = this,
                    path = proceed.call(this, 2),
                    x = path[1],
                    y = path[2];

                Highcharts.each(this.breakArray || [], function (brk) {
                    x = axis.toPixels(brk.from);
                    path.splice(3, 0,
                        'L', x - 4, y, // stop
                        'M', x - 9, y + 5, 'L', x + 1, y - 5, // left slanted line
                        'M', x - 1, y + 5, 'L', x + 9, y - 5, // higher slanted line
                        'M', x + 4, y
                    );

                });
                return path;
            });
 

            vm.chart = Highcharts.chart('container', {

                navigation: {
                    buttonOptions: {
                        align: 'left'
                    }
                },

                chart: {
                    type: 'line',
                    marginTop: 55
                },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    },
                },
                subtitle: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },

                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        return Highcharts.dateFormat("%Y-%b-%e", this.x) +
                            '<br/><b>' + this.series.name + '</b>: ' + this.y;
                    }

                },

                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function (e) {

                                    vm.showTotal = false;
                                    vm.showBreakfast = false;
                                    vm.showLunch = false;
                                    vm.showSnack = false;
                                    vm.showDinner = false;
                                    if (this.name === 'total') {
                                        vm.showTotal = true;
                                        vm.showBreakfast = true;
                                        vm.showLunch = true;
                                        vm.showSnack = true;
                                        vm.showDinner = true;
                                    }
                                    if (this.name === 'breakfast') {
                                        vm.showBreakfast = true;
                                    }
                                    if (this.name === 'lunch') {
                                        vm.showLunch = true;
                                    }
                                    if (this.name === 'dinner') {
                                        vm.showDinner = true;
                                    }
                                    if (this.name === 'snack') {
                                        vm.showSnack = true;
                                    }

                                    var x = this.x;
                                    var y = this.y;
                                    vm.showDetails = true;
                                    vm.myData = this.myData;
                                    if (this.myData && this.myData.Day) {
                                        getUserDay(vm.patientID, this.myData.Day)
                                            .then(function (d) {
                                                vm.breakfast = [];
                                                vm.lunch = [];
                                                vm.dinner = [];
                                                vm.snack = [];
                                                d.Foods.forEach(function (element) {
                                                    if (element.MealCategoryID === 1) {
                                                        vm.breakfast.push(element);
                                                    }
                                                    if (element.MealCategoryID === 2) {
                                                        vm.lunch.push(element);
                                                    }
                                                    if (element.MealCategoryID === 3) {
                                                        vm.dinner.push(element);
                                                    }
                                                    if (element.MealCategoryID === 4) {
                                                        vm.snack.push(element);
                                                    }
                                                });
                                                vm.chartDate = Highcharts.dateFormat('%A, %b %e, %Y', x);
                                                vm.totalCalories = y;
                                            })

                                            .catch(function (error) {
                                                toastr.error(vm.headerService.errors[0], 'Error Loading User Day', {
                                                    timeOut: 5000
                                                });
                                            });
                                    }
                                }
                            }
                        },

                    }
                },
                xAxis: {
                    categories: data.Plots.map(function (a) {
                        return newDate(a.Day);
                    }),
                    type: 'datetime',
                    labels: {
                        format: '{value:%m/%d/%y}',
                        rotation: -45
                    },
                    tickInterval: 4 * 24 * 3600 * 1000,
                    plotLines: vm.xPlotlines,
                    linecolor: 'black',
                    breaks: breaks,
                    plotBands: vm.xPlotbands
                },
                yAxis: {
                    title: {
                        text: 'Calories'
                    },
                    labels: {
                        format: '{value}'
                    }

                },
                series: [{
                    name: 'Total Calories',
                    data: seriesData,
                    zoneAxis: 'x',
                    zones: zones,
                    color: vm.linecolor,
                    marker: {
                        symbol: 'circle',
                        enabled: true,
                    },
                   // gapSize: 5
                }, {
                    name: 'Breakfast Calories',
                    data: breakfastSeriesData,
                    visible: false,
                    showInLegend: false,
                    zoneAxis: 'x',
                    zones: zones,
                    color: vm.linecolor,
                    marker: {
                        symbol: 'circle',
                        enabled: true,
                    },
                  //  gapSize: 5
                },
                {
                    name: 'Lunch Calories',
                    data: lunchSeriesData,
                    zones: zones,
                    zoneAxis: 'x',
                    visible: false,
                    showInLegend: false,
                    color: vm.linecolor,
                    marker: {
                        symbol: 'circle',
                        enabled: true,

                    },
                 //   gapSize: 5
                },
                {
                    name: 'Dinner Calories',
                    data: dinnerSeriesData,
                    zones: zones,
                    zoneAxis: 'x',
                    visible: false,
                    showInLegend: false,
                    color: vm.linecolor,
                    marker: {
                        symbol: 'circle',
                        enabled: true,
                    },
                  //  gapSize: 5
                },
                {
                    name: 'Snack Calories',
                    data: snackSeriesData,
                    zones: zones,
                    zoneAxis: 'x',
                    visible: false,
                    showInLegend: false,
                    color: vm.linecolor,
                    marker: {
                        symbol: 'circle',
                        enabled: true,
                    },
                  //  gapSize: 5
                },
                {
                    name: 'Average Breakfast Calories',
                    data: averageBreakfastSeriesData,
                    visible: false,
                    showInLegend: false,
                    color: '#1C6A96',
                    marker: {
                        enabled: false
                    },
                    // gapSize: 4,
                },
                {
                    name: 'Breakfast Calories Goal',
                    data: breakfastCaloriesGoalSeriesData,
                    marker: {
                        enabled: false
                    },
                    visible: false,
                    showInLegend: false,
                    color: '#A7B240'
                },
                {
                    name: 'Average Lunch Calories',
                    data: averageLunchSeriesData,
                    visible: false,
                    showInLegend: false,
                    color: '#1C6A96',
                    marker: {
                        enabled: false
                    },
                },
                {
                    name: 'Lunch Calories Goal',
                    data: lunchCaloriesGoalSeriesData,
                    marker: {
                        enabled: false
                    },
                    visible: false,
                    showInLegend: false,
                    color: '#A7B240'
                },
                {
                    name: 'Average Dinner Calories',
                    data: averageDinnerSeriesData,
                    visible: false,
                    showInLegend: false,
                    color: '#1C6A96',
                    marker: {
                        enabled: false
                    },
                },
                {
                    name: 'Dinner Calories Goal',
                    data: dinnerCaloriesGoalSeriesData,
                    marker: {
                        enabled: false
                    },
                    visible: false,
                    showInLegend: false,
                    color: '#A7B240'
                },
                {
                    name: 'Average Snack Calories',
                    data: averageSnackSeriesData,
                    visible: false,
                    showInLegend: false,
                    color: '#1C6A96',
                    marker: {
                        enabled: false
                    },
                },
                {
                    name: 'Snack Calories Goal',
                    data: snackCaloriesGoalSeriesData,
                    marker: {
                        enabled: false
                    },
                    visible: false,
                    showInLegend: false,
                    color: '#A7B240'
                },
                {
                    name: 'Average Total Calories',
                    data: averageTotalSeriesData,
                    color: '#1C6A96',
                    marker: {
                        enabled: false
                    },
                },
                {
                    name: 'Total Calories Goal',
                    data: totalCaloriesGoalSeriesData,
                    color: '#A7B240',
                    marker: {
                        enabled: false
                    },
                },
                {
                    name: 'Data While Completing Session',
                    data: [],
                    color: '#b0b0b0',
                    showInLegend: vm.addCompletingSessionToLegend
                }
                ]
            });
            vm.chart.series[0].data[vm.chart.series[0].data.length - 1].firePointEvent('click', {
                ctrlKey: true
            });

        }

        //public//
        function toggleGraph(arr, isCustomIn, session) {
            if (vm.chart) {
                vm.showDetails = false;

                var i = vm.chart.xAxis[0].plotLinesAndBands.length;
                if (i > 0) {
                    while (i--) {
                        vm.chart.xAxis[0].plotLinesAndBands[i].destroy();
                    }
                }

                if (session != 'Total' && session != 'Custom') {

                    vm.chart.xAxis[0].update({
                        plotLines: vm['x' + session + 'Plotlines'],
                        plotBands: vm['x' + session + 'Plotbands']
                    });
                } else {

                    vm.chart.xAxis[0].update({
                        plotLines: vm.xPlotlines,
                        plotBands: vm.xPlotbands
                    });
                }

                for (var i = 0; i < 15; i++) {
                    if (vm.chart.series[i]) {
                        if (isCustomIn && false) {
                            vm.chart.series[i].update({
                                color: null
                            });
                        } else {
                            if (i < 5) {
                                vm.chart.series[i].update({
                                    color: vm.linecolor
                                });
                            } else if ([5, 7, 9, 11, 13].indexOf(i) > -1) {
                                vm.chart.series[i].update({
                                    color: '#1C6A96'
                                });
                            } else {
                                vm.chart.series[i].update({
                                    color: '#A7B240'
                                });
                            }
                        }
                        if (arr.indexOf(i) >= 0) {
                            vm.chart.series[i].show();
                            vm.chart.series[i].update({
                                showInLegend: true
                            });
                        } else {
                            vm.chart.series[i].hide();
                            if (isCustomIn) {
                                vm.chart.series[i].update({
                                    showInLegend: true
                                });
                            } else {
                                vm.chart.series[i].update({
                                    showInLegend: false
                                });
                            }

                        }

                    }
                }
            }
        }

        function setAverageCaloriesBeforeSession(data) {
            if (data.PlotLines && data.PlotLines[0]) {
                vm.averageSnackCaloriesBeforeSession = data.PlotLines[0].AverageSnackCalories || 0;
            }

            if (data.PlotLines && data.PlotLines[2]) {
                var cutOffDate = newDate(data.PlotLines[2].StartDate);
                var myArray = data.Plots.filter(function (el) {
                    return newDate(el.Day) < cutOffDate;
                });
                var justCalories = myArray.map(function (el) {
                    return el.BreakfastCalories
                })
                vm.averageBreakfastCaloriesBeforeSession = parseInt(justCalories.reduce(function (p, c) {
                    return p + c;
                }) / justCalories.length);
            }

            if (data.PlotLines && data.PlotLines[4]) {

                var cutOffDate = newDate(data.PlotLines[4].StartDate);
                var myArray = data.Plots.filter(function (el) {
                    return newDate(el.Day) < cutOffDate;
                });
                var justCalories = myArray.map(function (el) {
                    return el.LunchCalories
                })
                vm.averageLunchCaloriesBeforeSession = parseInt(justCalories.reduce(function (p, c) {
                    return p + c;
                }) / justCalories.length);
            }

            if (data.PlotLines && data.PlotLines[5]) {

                var cutOffDate = newDate(data.PlotLines[5].StartDate);
                var myArray = data.Plots.filter(function (el) {
                    return newDate(el.Day) < cutOffDate;
                });
                var justCalories = myArray.map(function (el) {
                    return el.DinnerCalories
                })
                vm.averageDinnerCaloriesBeforeSession = parseInt(justCalories.reduce(function (p, c) {
                    return p + c;
                }) / justCalories.length);

            }
        }

        function prepareZones(data, zones) {
            if (data.PlotLines && data.PlotLines[0] && data.PlotLines[0].StartDate) {
                if (data.PlotLines[0].Day && data.PlotLines[0].Day < PlotLines[0].StartDate) {
                    vm.addCompletingSessionToLegend = true;
                }
                zones.push({
                    value: newDate(data.PlotLines[0].StartDate),
                    color: '#B0B0B0'
                });
            } else {
                vm.linecolor = '#B0B0B0';
            }
        }

        function addBreaksToGraphIfPointsAreMoreThanFiveDaysApart(data, breaks,
            averageTotalSeriesData, averageBreakfastSeriesData, averageSnackSeriesData, averageDinnerSeriesData, averageLunchSeriesData,
            totalCaloriesGoalSeriesData, breakfastCaloriesGoalSeriesData, snackCaloriesGoalSeriesData, dinnerCaloriesGoalSeriesData, lunchCaloriesGoalSeriesData) {
           for (var i = 0; i < data.Plots.length; i++) {
                if (i > 0) {
                    if (Math.abs(newDate(data.Plots[i].Day) - newDate(data.Plots[i - 1].Day)) >= 1000 * 60 * 60 * 24 * 5) {
                        var from = newDate(data.Plots[i - 1].Day);
                        var to = newDate(data.Plots[i].Day);
                        var from_utc = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), from.getUTCHours(), from.getUTCMinutes(), from.getUTCSeconds());
                        var to_utc = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate(), to.getUTCHours(), to.getUTCMinutes(), to.getUTCSeconds(), to.getUTCMilliseconds);
                       breaks.push({
                            from: from_utc,
                            to: to_utc
                        });

                        ['averageTotalSeriesData','averageBreakfastSeriesData', 'averageSnackSeriesData', 'averageDinnerSeriesData', 'averageLunchSeriesData',
                            'totalCaloriesGoalSeriesData', 'breakfastCaloriesGoalSeriesData', 'snackCaloriesGoalSeriesData', 'dinnerCaloriesGoalSeriesData', 'lunchCaloriesGoalSeriesData']
                            .forEach(function (arr) {

                            for (var j = 0; j < eval(arr).length; j++) {
                                if (eval(arr)[j].x >= to_utc && eval(arr)[j].x <= to_utc) {
                                    eval(arr)[j].x = to_utc
                                }
                            }
                        })

                    }

                }
            }
        }

   

        ///data service functions /////////

        function getData(id) {
            return patientDataService.getChartInfo(id)
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    throw error;
                });
        }

        function getUserDay(id, day) {
            return patientDataService.getUserDay(id, day)
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    throw error;
                });
        }

        function addClosestNullValue(element, series) {
            var enddt = newDate(element.EndDate);

            series.sort(function (a, b) {
                return cmp(new Date(a.x), new Date(b.x)) || cmp(b.y, a.y)
            })

            var closest = newDate(series[0].x);

            series.forEach(function (d) {
                var date = newDate(d.x);
                if (date <= enddt) {
                    closest = newDate(d.x);
                }
            });

            series.push({
                'y': null,
                'x': closest,
                'myData': null,
                'name': 'snack'
            })
        }

        function newDate(dt) {
            var d = new Date(dt)
           /* d.setHours(0, 0, 0, 0);*/
            return d;
        }

       function cmp (a, b) {
            if (a > b) return +1;
            if (a < b) return -1;
            return 0;
        }

    }

})();