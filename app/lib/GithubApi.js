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
  },

  get_repos : function(chain) {
    var self = this;
    
    self.httpRequest(self.options.git_base_url + self.options.git_org + '/repos', function(err, data) {
      var repos = JSON.parse(data);
      chain(repos);
    });  
  },

  get_repo_graph : function(repo_name, chain) {
    var self = this;

    self.httpRequest('https://github.com/' + self.options.git_org + '/' + repo_name + '/graphs/participation?h=100&w=640', function(err, data) {
      var dom = data;
      console.log(dom);
    });
  },

  get_members : function(chain) {
    var self = this;

    self.httpRequest(self.options.git_base_url + self.options.git_org + '/public_members', function(err, data) {
      var members = JSON.parse(data);
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
