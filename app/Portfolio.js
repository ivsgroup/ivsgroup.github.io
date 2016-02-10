"use strict";

var Class     = require('uclass'),
    Events    = require('uclass/events'),
    Mustache  = require('mustache'),
    GithubApi = require('./lib/GithubApi');

var Portfolio = new Class({

  Implements : [Events],

  Binds : ['ready'],

  templates : {},

  main  : null,
  debug : true,
  
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
      'git_org' : self.git_org,
      'debug'   : self.debug
    };

    self.github = new GithubApi(self, options);

    self.github.ger_org(function(org) {
      self.main = self.render('main_block', org);
      $(document.body).append(self.main);
      self.bind_nav();
    });
  },

  show_repositories : function() {
    var self = this;

    self.github.get_repos(function(repos) {
      var dom = $('<div></div>');
      repos.forEach(function(repo, key) {
        repo.updated_at = self.format_date(repo.updated_at);
        dom.append(self.render('repo_block', repo));
      });
      self.switch_content('#container', dom);
    });
  },

  show_members : function() {
    var self = this;
    self.github.get_members(function(members) {
      var dom = $('<div></div>');
      members.forEach(function(member, key) {
        dom.append(self.render('member_block', member));
      });
      self.switch_content('#container', dom);
    });
  },

  show_about : function() {

  },

  switch_content : function(container, dom) {
    $(container).fadeOut('fast', function() {
      $(container).empty();
      $(container).append(dom);
      $(container).fadeIn('fast');
    });
  },

  bind_nav : function() {
    var self = this;

    self.show_repositories();

    var elems = $('#main_nav').find('li');
    $(elems).click(function(test, test2) {
      if ($(this).hasClass('active'))
        return;
      $(elems).removeClass('active');
      $(this).addClass('active');
      var rub = $(this).attr('rel');
      switch (rub) {
        case 'repositories' :
        self.show_repositories();
          break;
        case 'members' :
          self.show_members();
          break;
        case 'about' :
          self.show_about();
          break;
      }
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

  format_date : function(date) {
    var date = new Date(date),
        date_str = date.toLocaleDateString('en-us', { //tmp en-us
          day   : "numeric",
          month : "long",
          year  : "numeric"
        });
    return date_str;
  },

  render : function(template_id, view) {
    var self = this,
        output = Mustache.render(self.templates[template_id], view, self.templates),
        res = $('<div></div>').append(output);
    output = res[0].innerHTML;
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

        self.templates[node.getAttribute('id')] = str.replace(']]>', '').replace('<![CDATA[', '');
      });

      self.fireEvent('init');
    }, true);
  }

});

module.exports = Portfolio;
