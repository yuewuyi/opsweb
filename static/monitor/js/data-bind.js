/**
 * Created by suyue on 2017/2/23.
 */
var app=angular.module('host-table',[])
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[')
    $interpolateProvider.endSymbol(']]')
})
zz=[
    {"host":"ysadsa","avli":"1","ip":"192.168.0.9"},
    {"host":"tsadsa","avli":"1","ip":"192.168.0.6"},
    {"host":"xsadsa","avli":"0","ip":"192.168.0.5"},
    {"host":"zdsa","avli":"1","ip":"192.168.0.4"},
    {"host":"dsa","avli":"0","ip":"192.168.0.3"},
    {"host":"bsadsa","avli":"1","ip":"192.168.0.2"},
]
app.controller('HostInfo',function ($scope) {
   $scope.names = zz
})