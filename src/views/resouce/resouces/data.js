export default function() {
  var arr = [{
    name: 'node 1-1',
    expanded: true,
    children: [{
      name: 'node 1-1-1',
      children: [{
        name: 'node 6-1-1'
      }]
    }, {
      name: 'node 1-1-2'
    }, {
      name: 'node 1-1-3'
    }]
  }, {
    name: 'node 1-2',
    children: [{
      name: 'node 2-1-1'
    }, {
      name: 'node 2-1-2'
    }]
  }, {
    name: 'node 1-3',
    children: [{
      name: 'node 3-1-1'
    }, {
      name: 'node 3-1-2'
    }]
  }, {
    name: 'node 1-4'
  }, {
    name: 'node 1-5'
  }]
  return arr
}
