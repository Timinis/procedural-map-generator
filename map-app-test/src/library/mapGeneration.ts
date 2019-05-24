interface customMap {
  xAxis: number[];
  yAxis: number[];
}

interface QueNode {
  value: any;
  next: QueNode | null;
}

interface Queue {
  first: QueNode | null;
  last: QueNode | null;
}

interface BinaryPartitionTree {
  value: customMap;
  left: BinaryPartitionTree | null;
  right: BinaryPartitionTree | null;
}

interface Tunnel {
  hTunnel: HTunnelCordinates;

  vTunnel: VTunnelCordinates;
}

interface HTunnelCordinates {
  tunnelRange: number[];
  yCordinates: number;
}

interface VTunnelCordinates {
  tunnelRange: number[];
  xCordinates: number;
}

const createNode = (value: any): QueNode => {
  return { value, next: null };
};

const createQue = (): Queue => {
  return { first: null, last: null };
};

const enqueue = (queue: Queue, value: any): Queue => {
  if (!queue.first && !queue.last) {
    queue.first = createNode(value);
    queue.last = queue.first;
  } else if (queue.first && queue.last) {
    queue.last.next = createNode(value);
    queue.last = queue.last.next;
  }
  return queue;
};

const dequeue = (queue: Queue): any => {
  if (queue.first && queue.first !== queue.last) {
    let deQue = queue.first;
    queue.first = queue.first.next;
    deQue.next = null;
    return deQue;
  } else if (queue.first && queue.first === queue.last) {
    let deQue = queue.first;
    queue.first = null;
    queue.last = null;
    return deQue;
  } else if (queue.first === null) {
    return 'Null Exception Error';
  }
};

const createBinaryTree = (map: customMap): BinaryPartitionTree => {
  return { value: map, left: null, right: null };
};

const getRandomPercentageInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return (Math.floor(Math.random() * (max - min) + 1) + min) / 100; //The maximum is inclusive and the minimum is inclusive
};

const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + 1) + min; //The maximum is inclusive and the minimum is inclusive
};

const generateNewMap = (width: number, height: number): customMap => {
  return { xAxis: [0, width - 1], yAxis: [0, height - 1] };
};

const verticalSplit = (mapToBeDivided: customMap): customMap[] => {
  let dividedLength = Math.floor(
    (mapToBeDivided.xAxis[1] - mapToBeDivided.xAxis[0] + 1) *
      getRandomPercentageInclusive(35, 70)
  );

  return [
    {
      xAxis: [
        mapToBeDivided.xAxis[0],
        mapToBeDivided.xAxis[0] + dividedLength - 1
      ],
      yAxis: [...mapToBeDivided.yAxis]
    },
    {
      xAxis: [dividedLength + mapToBeDivided.xAxis[0], mapToBeDivided.xAxis[1]],
      yAxis: [...mapToBeDivided.yAxis]
    }
  ];
};

const horizontalSplit = (mapToBeDivided: customMap): customMap[] => {
  let dividedLength = Math.floor(
    (mapToBeDivided.yAxis[1] - mapToBeDivided.yAxis[0] + 1) *
      getRandomPercentageInclusive(35, 70)
  );

  return [
    {
      xAxis: [...mapToBeDivided.xAxis],
      yAxis: [
        mapToBeDivided.yAxis[0],
        mapToBeDivided.yAxis[0] + dividedLength - 1
      ]
    },
    {
      xAxis: [...mapToBeDivided.xAxis],
      yAxis: [dividedLength + mapToBeDivided.yAxis[0], mapToBeDivided.yAxis[1]]
    }
  ];
};

const mapRandomizerDepth = (wholeMap: customMap, numberOfSlices: number) => {
  let counter = 0;
  //function to add new leaf onto the tree
  const binaryMapDivision = (inputMap: customMap): BinaryPartitionTree => {
    let newLeaf = createBinaryTree(inputMap);
    if (counter < numberOfSlices) {
      if (counter % 2 === 1) {
        let verticalSplittedMap = verticalSplit(newLeaf.value);
        counter++;
        newLeaf.left = binaryMapDivision(verticalSplittedMap[0]);
        newLeaf.right = binaryMapDivision(verticalSplittedMap[1]);
      } else if (counter % 2 === 0) {
        let horizontalSplittedMap = horizontalSplit(newLeaf.value);
        counter++;
        newLeaf.left = binaryMapDivision(horizontalSplittedMap[0]);
        newLeaf.right = binaryMapDivision(horizontalSplittedMap[1]);
      }
    }
    return newLeaf;
  };
  let newTree = binaryMapDivision(wholeMap);

  return newTree;
};

const getLeaf = (wholeTree: BinaryPartitionTree): customMap[] => {
  let returnedArray: customMap[] = [];
  const treeTraversal = (treeNode: BinaryPartitionTree | null) => {
    if (!treeNode) {
      return;
    }

    if (!treeNode.left && !treeNode.right) {
      returnedArray.push(treeNode.value);
    }
    treeTraversal(treeNode.left);
    treeTraversal(treeNode.right);
  };
  treeTraversal(wholeTree);
  return returnedArray;
};

const mapRandomizerBreadth = (
  wholeMap: customMap,
  numberOfSlices: number
): BinaryPartitionTree => {
  let counter = 0;
  let tree = createBinaryTree(wholeMap);
  let queue = createQue();
  let switchSlice = false;
  let expoCounter = 0;
  enqueue(queue, tree);
  while (counter < numberOfSlices) {
    let currentNode;
    counter++;
    if (counter === Math.pow(2, expoCounter)) {
      expoCounter++;
      switchSlice = !switchSlice;
    }
    if (queue.first) {
      currentNode = queue.first.value;
    }
    let splitMap;
    if (switchSlice) {
      splitMap = verticalSplit(currentNode.value);
    } else {
      splitMap = horizontalSplit(currentNode.value);
    }

    currentNode.left = createBinaryTree(splitMap[0]);
    enqueue(queue, currentNode.left);
    currentNode.right = createBinaryTree(splitMap[1]);
    enqueue(queue, currentNode.right);
    dequeue(queue);
  }
  return tree;
};

const placeRoom = (mapArea: customMap[]): customMap[] => {
  let returnArea: customMap[] = [];
  mapArea.forEach(element => {
    let xNumber1 = getRandomIntInclusive(
      element.xAxis[0],
      Math.floor((element.xAxis[1] - element.xAxis[0]) / 2) + element.xAxis[0]
    );
    let xNumber2 = getRandomIntInclusive(xNumber1 + 3, element.xAxis[1] - 1);
    let yNumber1 = getRandomIntInclusive(
      element.yAxis[0],
      Math.floor((element.yAxis[1] - element.yAxis[0]) / 2) + element.yAxis[0]
    );
    let yNumber2 = getRandomIntInclusive(yNumber1 + 3, element.yAxis[1] - 1);

    let roomArea = { xAxis: [xNumber1, xNumber2], yAxis: [yNumber1, yNumber2] };

    returnArea = [...returnArea, ...[roomArea]];
  });
  return returnArea;
};

const connectRoom = (roomArea: customMap[]): Tunnel[] => {
  let randomChosenPoints: any = [];
  let tunnelArray: Tunnel[] = [];

  roomArea.forEach(element => {
    let pointX = getRandomIntInclusive(element.xAxis[0], element.xAxis[1] - 1);
    let pointY = getRandomIntInclusive(element.yAxis[0], element.yAxis[1] - 1);
    randomChosenPoints = [...randomChosenPoints, [pointX, pointY]];
  });

  for (let i = 0; i < randomChosenPoints.length - 1; i++) {
    let firstPointX = randomChosenPoints[i][0];
    let secondPointX = randomChosenPoints[i + 1][0];
    let hTunnelY = randomChosenPoints[i][1];
    let hTunnelRange = [firstPointX, secondPointX];
    hTunnelRange.sort(function(a, b) {
      return a - b;
    });
    let HTunnelCordinates: HTunnelCordinates = {
      tunnelRange: hTunnelRange,
      yCordinates: hTunnelY
    };

    let firstPointY = randomChosenPoints[i][1];
    let secondPointY = randomChosenPoints[i + 1][1];
    let vTunnelX = randomChosenPoints[i + 1][0];
    let vTunnelRange = [firstPointY, secondPointY];
    vTunnelRange.sort(function(a, b) {
      return a - b;
    });
    let VTunnelCordinates: VTunnelCordinates = {
      tunnelRange: [firstPointY, secondPointY],
      xCordinates: vTunnelX
    };
    tunnelArray = [
      ...tunnelArray,
      { hTunnel: HTunnelCordinates, vTunnel: VTunnelCordinates }
    ];
  }
  console.log(tunnelArray);
  return tunnelArray;
};

export {
  generateNewMap,
  mapRandomizerDepth,
  mapRandomizerBreadth,
  getLeaf,
  getRandomIntInclusive,
  placeRoom,
  connectRoom
};
