function () {
  var elem = $(this);
  $("window").bind("online", function () {
    elem.trigger("online");
  });
  $("window").bind("offline", function () {
    elem.trigger("offline");
  });
}