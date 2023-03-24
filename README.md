# Webcam-application
即時影像轉灰階、邊緣偵測、去雜訊/平滑

使用Webcam鏡頭，即時輸入影像並進行處理

Mission 1 邊緣偵測:
- 將影像轉為灰階
- TH_value、TL_value :用來區分 strong edge 和 weak edge，範圍都是 0 ~ 255

![image](https://github.com/LizhuChen/Webcam-application/blob/main/img/mission.PNG)

Mission 2 邊緣偵測:
- 將影像轉為灰階
- 每個pixel做bitwise_not
- 做GaussianBlur使圖像變平滑

![image](https://github.com/LizhuChen/Webcam-application/blob/main/img/mission2.PNG)
