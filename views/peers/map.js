function(doc) {
  if (doc.type == 'Peer') {
    emit(doc.created_at, doc.host);
  }
}