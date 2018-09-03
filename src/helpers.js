const deepEqual = require('deep-equal');

function getGroupId(id, obj) {
  let groupId;

  if (typeof id === 'string') {
    const candidateId = obj[id];
    if (!(typeof candidateId === 'string'
        || typeof candidateId === 'number')) {
      throw TypeError('Only types "string" and "number" are supported for group ids.');
    }
    groupId = candidateId;
  } else if (Array.isArray(id)) {
    groupId = id.reduce((aggregated, key) => {
      aggregated[key] = obj[key];
      return aggregated;
    }, {});
  }

  return groupId;
}

function getGroup(groupId, aggregated) {
  let idx;
  if (Object.keys(groupId).length) {
    idx = aggregated.findIndex((item) => {
      for (const field of Object.keys(item.id)) {
        if (groupId[field] !== item.id[field]) {
          return false;
        }
      }
      return true;
    });
  } else if (typeof groupId === 'string' || typeof groupId === 'number') {
    idx = aggregated.findIndex(item => item.id === groupId);
  }
  const groupObj = idx === -1 ? { id: groupId } : aggregated.splice(idx, 1)[0];
  return groupObj;
}

function getGroupKeys(groupId, aggregated) {
  if (typeof groupId === 'string' || typeof groupId === 'number') {
    if (aggregated.indexOf(groupId) === -1) {
      aggregated.push(groupId);
    }
  } else if (typeof groupId === 'object') {
    let exists = false;
    for (const record of aggregated) {
      if (deepEqual(groupId, record.id)) {
        exists = true;
        break;
      }
    }
    if (!aggregated.length || !exists) {
      aggregated.push({ id: groupId });
    }
  }
  return aggregated;
}

module.exports = {
  getGroupId,
  getGroup,
  getGroupKeys,
};
