function () {
  var elem = $$(this);

  function startReplication() {
    elem.app.view('peers', {
      success: function (view) {
        // Are we all alone in this world?
        if (view.total_rows == 1) {
          return;
        }
        tryReplication(view.rows.slice(0), "push");
        tryReplication(view.rows.slice(0), "pull");
      }
    });
  }

  function tryReplication(hosts, direction) {
    if (hosts.length == 0) {
      return;
    }
    var host = hosts.pop().value,
        peer = 'http://'+host+'/jibjab',
        selector = '.'+direction+'_replication',
        replication = direction == 'push' ? {target: peer, source: 'jibjab', continuous: true} : {target: 'jibjab', source: peer, continuous: true};
    // don't replicate to ourselves or to localhost
    if (window.location.host == host || ['localhost', '127.0.0.1'].indexOf(host.split(':')[0]) != -1) {
      tryReplication(hosts, direction);
      return;
    }
    $(selector).text("Trying to "+direction+" here: "+peer);
    $.ajax({
      url: 'http://'+window.location.host+'/_replicate',
      type: 'POST',
      data: JSON.stringify(replication),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      success: function(result, status, xhr) {
        $(selector).text(direction+"ing here: "+peer);
      },
      error: function () {
        tryReplication(hosts, direction);
      }
    });
  }

  var doc = {
    _id : "Peer-"+window.location.host,
    created_at : new Date(),
    host : window.location.host,
    type : "Peer"
  };
  elem.app.db.saveDoc(doc, {
    success : function() {
      startReplication();
    },
    error : function(e) {
      if (e == 409) {
        startReplication();
      }
    }
  });
}