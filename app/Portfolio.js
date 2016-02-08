"use strict";

var Class     = require('uclass'),
    Events    = require('uclass/events'),
    Mustache  = require('mustache'),
    GithubApi = require('./lib/GithubApi');

var Portfolio = new Class({

  Implements : [Events],

  Binds : ['ready'],

  templates : {},
  
  //config.json
  git_org : 'ivsgroup',

  initialize : function() {
    var self = this;
    $("<link/>", {rel: "stylesheet", type: "text/css", href: "theme/main.css?" }).appendTo("head");
  },

  init : function() {
    var self = this;

    self.addEvent('init', self.ready);

    self.load_templates();
  },

  ready : function() {
    var self = this;

    console.log('ready');

    var options = {
      'git_org' : self.git_org
    };

    self.github = new GithubApi(self, options);

    self.github.get_repos(function(repos) {
      repos.forEach(function(repo, key) {
        self.github.get_repo_graph(repo.name, function() {});
        var dom = self.render('repo_block', repo);
        $(document.body).append(dom);
      });
    });

    self.github.get_members(function(members) {
      members.forEach(function(member, key) {
        console.log(member);
        var dom = self.render('member_block', member);
        $(document.body).append(dom);
      });
    });
  },

  xpath : function(xml, query) {
    var out = [],
        result = xml.evaluate(query, xml, null, XPathResult.ANY_TYPE, null),
        current = result.iterateNext();
    while (current) {
      out.push(current);
      current = result.iterateNext();
    }
    return out;
  },

  httpRequest : function(url, chain, xml) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);

    xmlHttp.onload = function() {
      chain(null, (xml ? xmlHttp.responseXML : xmlHttp.responseText));
    };

    xmlHttp.onerror = function(err) {
      console.log('err');
      chain(new Error("request error"));
    };
  },

  render : function(template_id, view) {
    var self = this,
        output = Mustache.render(self.templates[template_id], view, self.templates),
        res = $('<div></div>').append(output);
    output = res[0];
    return output;
  },

  load_templates : function() {
    var self = this;
    self.httpRequest('templates.xml', function(err, data) {
      var serializer = new XMLSerializer();
      self.xpath(data, "//script[@type='text/template']").forEach(function(node) {
        var str = "";
        for (var i = 0; i < node.childNodes.length; i++)
          str += serializer.serializeToString(node.childNodes[i]);

        self.templates[node.getAttribute('id')] = str.replace(']]>', '');
      });

      self.fireEvent('init');
    }, true);
  }

});

module.exports = Portfolio;
