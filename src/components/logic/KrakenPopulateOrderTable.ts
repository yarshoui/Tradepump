
export const data = {
  as: [],
  bs: [],
};

export function populateOrderTable(msg) {
  const newData = JSON.parse(msg.data);

  if (newData.channelID || newData.connectionID || !Array.isArray(newData) || newData.length < 2 || !newData[1]) {
    return;
  }

  // bid update
  if (newData[1].b) {
    // if bid is 0 - find and remove from initial data
    // data.bs = [ ...data.bs, ...newData[1].b ];
    return;
  }

  // ask update
  if (newData[1].a) {
    // if ask is 0 - find and remove from initial data
    // data.as = [ ...data.as, ...newData[1].a ];
    return;
  }

  // something which is not valid for us
  if (!newData[1].as || !newData[1].bs) {
    return;
  }

  resetData(data);

  console.count('onmessage');
  console.log(newData[1]);
  // update initial ask/bid array(1000 elements)
  data.as = newData[1].as;
  data.bs = newData[1].bs;
}

function resetData(data) {
  data.as = [];
  data.bs = [];
}