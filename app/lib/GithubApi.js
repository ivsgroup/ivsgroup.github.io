"use strict";

var Class     = require('uclass');

var GithubApi = new Class({

  Implements : [
    require('uclass/events'),
    require('uclass/options')
  ],

  options : {
    'git_org'      : false,
    'git_base_url' : 'https://api.github.com/orgs/'
  },

  initialize : function(app, options) {
    var self = this;
    self.app = app;
    self.setOptions(options);
    self.debug = self.options.debug;
  },

  get_repos : function(chain) {
    var self = this,
        url  = self.options.git_base_url + self.options.git_org + '/repos';
    
    self.httpRequest(url, function(err, data) {
      var repos = JSON.parse(data);
      if (self.debug)
        console.log(url + ' : ', repos);
      chain(repos);
    });  
  },

  ger_org : function(chain) {
    var self = this,
        url  = self.options.git_base_url + self.options.git_org;

    self.httpRequest(url, function(err, data) {
      var org = JSON.parse(data);
      if (self.debug)
        console.log(url + ' : ', org);
      chain(org);
    });
  },

  get_members : function(chain) {
    var self = this,
        url  = self.options.git_base_url + self.options.git_org + '/public_members';

    self.httpRequest(url, function(err, data) {
      var members = JSON.parse(data);
      if (self.debug)
        console.log(url + ' : ', members);
      chain(members);
    });
  },

  httpRequest : function(url, chain) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);

    xmlHttp.onload = function() {
      chain(null, xmlHttp.responseText);
    };

    xmlHttp.onerror = function(err) {
      console.log('err');
      chain(new Error("request error"));
    };
  }

});

module.exports = GithubApi;
