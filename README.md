# View Tabular Data on Flow Screen

A table viewer node which can preview the data in a tabular fasion. 

![table viewer](https://github.com/GuanyiLi-Craig/static-files/blob/422bc7a9b5dba629ca61a82363e9983c58ad855d/node-red-contrib-dx-viewer/dx_viewer.gif)

This project is inspired by following two projects.

[data-view](https://github.com/mblackstock/node-red-contrib-data-view)

[image-output](https://github.com/rikukissa/node-red-contrib-image-output)

## Input

An arry of arrays, for exampe:

```javascript
let data = [
    ["id","Stock","Price"],
    [0, "TSLA", 222.22],
    [0, "AAPL", 144.44]];
```
or array of objects, such as returned from database directly. 
```javascript
let data = [
    {"id": 0,"Stock":"TSLA","Price":222.22},
    {"id": 2,"Stock":"AAPL","Price":144.44}];
```

On flow editor, user can taggle the active button. If active is on, it will show a table under the node. 

User can adjust the width and height of the table size. And also can scroll up-down or left-right if the table size is larger than the area. 

![table viewer resize](https://github.com/GuanyiLi-Craig/static-files/blob/422bc7a9b5dba629ca61a82363e9983c58ad855d/node-red-contrib-dx-viewer/dx_viewer_size.gif)
# node-red-contrib-dx-viewer
