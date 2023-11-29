## 01_垂直水平居中

1. 可以使用定位来解决

   ```css
   .container {
     position: relative;
     height: 300px;
     border: 1px solid red;
   }
   .item {
     width: 100px;
     height: 50px;
     position: absolute;
     left: 0;
     top: 0;
     right: 0;
     bottom: 0;
     margin: auto;
     border: 1px solid green;
   }
   ```

2. 定位+transform：主要来处理高宽未知的元素

   ```css
   .container {
     position: relative;
     height: 300px;
     border: 1px solid red;
   }
   .item {
     postion: absolute;
     top: 50%;
     bottom: 50%;
     width: 50px;
     height: 50px;
     transform: translate(-50%, -50%);
   }
   ```

3. 经典的flex方法

   ```css
   .container {
     display: flex;
     justify-content: center;
     align-items: center;
   }
   ```

4. 新的flex方法

   ```css
   .container {
     display: flex;
   }
   .item{
     margin: auto
   }
   ```

5. grid方式

   其中：`place-content: center;`是`align-content`和`justify-content`的简写

   ```css
   .container {
     display: grid;
     place-content: center;
   }
   ```

   其中：`place-items: center;`是`align-items`和`justify-items`的简写

   ```css
   .container {
     display: grid;
     place-items: center;
   }
   ```

## 02_



















